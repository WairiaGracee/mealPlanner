import json
import logging
import time

import requests
from django.conf import settings
from google import genai
from google.genai.errors import ServerError

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-3.5-flash"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5

PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"
IMAGE_FETCH_TIMEOUT_SECONDS = 4

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "days": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "day_of_week": {
                        "type": "integer",
                        "description": "0=Monday through 6=Sunday",
                    },
                    "meals": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "meal_type": {
                                    "type": "string",
                                    "enum": ["breakfast", "lunch", "dinner"],
                                },
                                    "emoji": {
                                    "type": "string",
                                    "description": "One emoji that best represents this dish",
                                },
                                "name": {"type": "string"},
                                "region": {"type": "string"},
                                "description": {"type": "string"},
                                "calories": {"type": "integer"},
                                "protein_g": {"type": "number"},
                                "carbs_g": {"type": "number"},
                                "fat_g": {"type": "number"},
                                "prep_minutes": {"type": "integer"},
                                "ingredients": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {"type": "string"},
                                            "quantity": {"type": "string"},
                                            "unit": {"type": "string"},
                                        },
                                        "required": ["name", "quantity"],
                                    },
                                },
                                "steps": {"type": "array", "items": {"type": "string"}},
                                "tags": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": ["meal_type", "name", "ingredients", "steps"],
                        },
                    },
                },
                "required": ["day_of_week", "meals"],
            },
        },
        "grocery_list": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "quantity": {"type": "string"},
                    "category": {
                        "type": "string",
                        "enum": [
                            "proteins",
                            "vegetables",
                            "carbs_staples",
                            "fruits",
                            "dairy",
                            "other",
                        ],
                    },
                },
                "required": ["name", "category"],
            },
        },
    },
    "required": ["days", "grocery_list"],
}


def _build_prompt(profile) -> str:
    lines = [
        "You are a meal-planning assistant specializing exclusively in Kenyan cuisine.",
        "Generate a full 7-day meal plan — breakfast, lunch, and dinner each day — "
        "using only Kenyan dishes and ingredients commonly available in Kenya.",
        "",
        "Person's preferences:",
        f"- Goal: {profile.get_goal_display() or 'General health'}",
        f"- Household: {profile.get_household_display() or 'Not specified'}",
        f"- Dietary style: {profile.get_diet_style_display()}",
        f"- Allergies/ingredients to avoid: "
        f"{', '.join(profile.allergies) if profile.allergies else 'None'}",
        f"- Time available per meal: {profile.get_cooking_time_display() or 'Not specified'}",
        f"- Grocery budget: {profile.get_budget_display() or 'Not specified'}",
    ]
    if profile.weight_kg:
        lines.append(f"- Weight: {profile.weight_kg} kg")
    if profile.height_cm:
        lines.append(f"- Height: {profile.height_cm} cm")

    lines += [
        "",
        "Rules:",
        "- Respect the dietary style and allergies strictly — never include an avoided ingredient.",
        "- Vary the meals across the week; don't repeat the same dish twice.",
        "- Keep prep time realistic for the stated time budget.",
        "- For each meal, include a single emoji that best represents that specific dish.",
        "- After listing all meals, compile ONE consolidated grocery list covering every "
        "ingredient needed for the whole week — merge duplicate ingredients into a single "
        "line with a combined quantity, grouped by category.",
        "- For each meal, estimate protein_g, carbs_g, and fat_g (grams) alongside calories — "
        "reasonable estimates based on standard portion sizes and typical recipe composition.",
    ]
    return "\n".join(lines)


def generate_meal_plan_sync(meal_plan: MealPlan) -> None:
    try:
        profile = meal_plan.user.profile
        prompt = _build_prompt(profile)

        meal_plan.status = MealPlan.Status.GENERATING
        meal_plan.prompt = prompt
        meal_plan.save(update_fields=["status", "prompt"])

        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = None
        last_error = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = client.models.generate_content(
                    model=MODEL_NAME,
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json",
                        "response_schema": RESPONSE_SCHEMA,
                    },
                )
                break
            except ServerError as exc:
                # 503/500-class errors are usually transient overload on
                # Google's side — worth a short retry before giving up.
                last_error = exc
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY_SECONDS)

        if response is None:
            raise last_error

        payload = json.loads(response.text)
        _save_generated_plan(meal_plan, payload)

        meal_plan.status = MealPlan.Status.READY
        meal_plan.save(update_fields=["status"])
    except Exception as exc:  # noqa: BLE001
        meal_plan.status = MealPlan.Status.FAILED
        meal_plan.error_message = str(exc)[:500]
        meal_plan.save(update_fields=["status", "error_message"])


def _fetch_recipe_image_url(dish_name: str, region: str, image_cache: dict) -> str:
    """
    Look up a photo that matches the generated dish, via Pexels.

    Order of preference:
      1. An in-memory cache for this generation run (same dish appears twice).
      2. A previously generated Recipe with the same name that already has
         an image — avoids re-querying Pexels for common Kenyan staples
         that show up across many users' plans.
      3. A live Pexels search, scoped with "Kenyan food" so results match
         the actual cuisine rather than a generic/Western interpretation
         of the dish name.

    Returns "" (never raises) if nothing is found or the API isn't
    configured — the frontend already falls back to the dish emoji.
    """
    cache_key = dish_name.strip().lower()
    if cache_key in image_cache:
        return image_cache[cache_key]

    existing = (
        Recipe.objects.filter(name__iexact=dish_name)
        .exclude(image_url="")
        .order_by("-created_at")
        .values_list("image_url", flat=True)
        .first()
    )
    if existing:
        image_cache[cache_key] = existing
        return existing

    if not settings.PEXELS_API_KEY:
        image_cache[cache_key] = ""
        return ""

    query = f"{dish_name} {region} Kenyan food".strip()
    try:
        response = requests.get(
            PEXELS_SEARCH_URL,
            headers={"Authorization": settings.PEXELS_API_KEY},
            params={"query": query, "per_page": 1, "orientation": "square"},
            timeout=IMAGE_FETCH_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        photos = response.json().get("photos", [])
        image_url = photos[0]["src"]["medium"] if photos else ""
    except (requests.RequestException, KeyError, ValueError) as exc:
        logger.warning("Pexels image lookup failed for %r: %s", dish_name, exc)
        image_url = ""

    image_cache[cache_key] = image_url
    return image_url


def _save_generated_plan(meal_plan: MealPlan, payload: dict) -> None:
    image_cache: dict = {}

    for day in payload.get("days", []):
        day_of_week = day["day_of_week"]
        for meal in day.get("meals", []):
            image_url = _fetch_recipe_image_url(
                meal["name"], meal.get("region", ""), image_cache
            )
            recipe = Recipe.objects.create(
                name=meal["name"],
                region=meal.get("region", ""),
                description=meal.get("description", ""),
                calories=meal.get("calories"),
                protein_g=meal.get("protein_g"),
                carbs_g=meal.get("carbs_g"),
                fat_g=meal.get("fat_g"),
                prep_minutes=meal.get("prep_minutes"),
                emoji=meal.get("emoji", ""),
                image_url=image_url,
                ingredients=meal.get("ingredients", []),
                steps=meal.get("steps", []),
                tags=meal.get("tags", []),
            )
            PlannedMeal.objects.create(
                meal_plan=meal_plan,
                recipe=recipe,
                day_of_week=day_of_week,
                meal_type=meal["meal_type"],
            )

    for item in payload.get("grocery_list", []):
        GroceryListItem.objects.create(
            meal_plan=meal_plan,
            name=item.get("name", ""),
            quantity=item.get("quantity", ""),
            category=item.get("category", GroceryListItem.Category.OTHER),
        )
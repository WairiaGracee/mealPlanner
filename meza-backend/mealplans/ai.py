import json
import re
import logging
import time

import requests
from django.conf import settings
from google import genai
from google.genai.errors import ServerError

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe
from .who_guidelines import build_prompt_block, build_targets, find_issues

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-3.5-flash"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5
MAX_WHO_REPAIRS = 1  # extra generations allowed to fix WHO violations

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
                                "image_query": {"type": "string"},
                                "image_query_fallback": {"type": "string"},
                                "region": {"type": "string"},
                                "description": {"type": "string"},
                                "calories": {"type": "integer"},
                                "protein_g": {"type": "number"},
                                "carbs_g": {"type": "number"},
                                "fat_g": {"type": "number"},
                                "fiber_g": {"type": "number"},
                                "free_sugar_g": {"type": "number"},
                                "sat_fat_g": {"type": "number"},
                                "sodium_mg": {"type": "number"},
                                "fruit_veg_g": {"type": "number"},
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
                                "image_query": {"type": "string"},
                                "image_query_fallback": {"type": "string"},
                                "tags": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": [
                                "meal_type", "name", "ingredients", "steps",
                                "calories", "protein_g", "carbs_g", "fat_g",
                                "fiber_g", "free_sugar_g", "sat_fat_g",
                                "sodium_mg", "fruit_veg_g",
                            ],
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
        "- For each meal, give image_query: 3-5 plain English words describing how the finished "
        "dish LOOKS, as a stock-photo site would tag it (for example 'vegetable omelette brown "
        "toast' or 'beef stew with rice'). Use NO Swahili or local dish names. Also give "
        "image_query_fallback: just the single most visible food in the dish (for example "
        "'omelette' or 'beef stew').",
        "- After listing all meals, compile ONE consolidated grocery list covering every "
        "ingredient needed for the whole week — merge duplicate ingredients into a single "
        "line with a combined quantity, grouped by category.",
        "- For each meal, estimate protein_g, carbs_g, and fat_g (grams) alongside calories — "
        "reasonable estimates based on standard portion sizes and typical recipe composition.",
    ]
    lines += build_prompt_block(profile)
    return "\n".join(lines)


def _call_gemini(client, prompt: str) -> dict:
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
            return json.loads(response.text)
        except ServerError as exc:
            # 503/500-class errors are usually transient overload on
            # Google's side — worth a short retry before giving up.
            last_error = exc
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY_SECONDS)
    raise last_error


def _flatten_meals(payload: dict) -> list:
    return [
        {"day_of_week": day["day_of_week"], **meal}
        for day in payload.get("days", [])
        for meal in day.get("meals", [])
    ]


def generate_meal_plan_sync(meal_plan: MealPlan) -> None:
    try:
        profile = meal_plan.user.profile
        prompt = _build_prompt(profile)

        meal_plan.status = MealPlan.Status.GENERATING
        meal_plan.prompt = prompt
        meal_plan.save(update_fields=["status", "prompt"])

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        payload = _call_gemini(client, prompt)

        # The model's numbers drift, so check the draft against the WHO
        # targets and ask for a corrected plan if any day breaks them.
        targets = build_targets(profile)
        for _ in range(MAX_WHO_REPAIRS):
            issues = find_issues(_flatten_meals(payload), targets)
            if not issues:
                break
            fix_prompt = (
                prompt
                + "\n\nYour previous draft broke these WHO limits. Fix them by changing "
                "the dishes or ingredients (not just the numbers) and return the COMPLETE "
                "plan and grocery list again:\n"
                + "\n".join(f"- {i}" for i in issues)
            )
            payload = _call_gemini(client, fix_prompt)

        _save_generated_plan(meal_plan, payload)

        meal_plan.status = MealPlan.Status.READY
        meal_plan.save(update_fields=["status"])
    except Exception as exc:  # noqa: BLE001
        meal_plan.status = MealPlan.Status.FAILED
        meal_plan.error_message = str(exc)[:500]
        meal_plan.save(update_fields=["status", "error_message"])

IMAGE_STOPWORDS = {"with", "and", "the", "for", "served", "fresh", "plate", "bowl"}
IMAGE_PEOPLE_WORDS = {"person", "people", "man", "woman", "hand", "hands", "holding", "girl", "boy", "child"}


def _norm_word(word: str) -> str:
    return word[:-1] if len(word) > 3 and word.endswith("s") else word


def _search_pexels(query: str, used_ids: set):
    """Return (photo_id, url) for the best photo whose alt text matches the
    query, or None. Better no photo (the UI shows the emoji) than a wrong one."""
    tokens = {
        _norm_word(w)
        for w in re.findall(r"[a-z]+", query.lower())
        if len(w) > 2 and w not in IMAGE_STOPWORDS
    }
    if not tokens:
        return None
    needed = 1 if len(tokens) == 1 else 2

    response = requests.get(
        PEXELS_SEARCH_URL,
        headers={"Authorization": settings.PEXELS_API_KEY},
        params={"query": query, "per_page": 15, "orientation": "square"},
        timeout=IMAGE_FETCH_TIMEOUT_SECONDS,
    )
    response.raise_for_status()

    best, best_key = None, None
    for photo in response.json().get("photos", []):
        if photo["id"] in used_ids:
            continue  # don't reuse one photo for two different dishes
        alt_words = {_norm_word(w) for w in re.findall(r"[a-z]+", (photo.get("alt") or "").lower())}
        hits = len(tokens & alt_words)
        if hits < needed:
            continue
        has_people = bool(alt_words & IMAGE_PEOPLE_WORDS)
        key = (hits, not has_people)  # prefer more matches, then photos without people
        if best_key is None or key > best_key:
            best, best_key = photo, key
    if best is None:
        return None
    return best["id"], best["src"]["medium"]


def _fetch_recipe_image_url(meal: dict, image_cache: dict) -> str:
    """
    Find a photo that matches the generated dish, via Pexels.

    Local dish names (kamande, omena, kunde...) don't exist in stock-photo
    tags, so we search with the plain-English image_query the model wrote for
    each meal, then its single-food fallback. Results are only accepted if
    the photo's alt text actually matches. Returns "" (never raises) when
    nothing matches, and the frontend falls back to the dish emoji.
    """
    dish_name = meal["name"]
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

    queries = [
        q.strip()
        for q in (meal.get("image_query"), meal.get("image_query_fallback"))
        if q and q.strip()
    ] or [dish_name]

    used_ids = image_cache.setdefault("__used_ids__", set())
    for query in queries:
        try:
            found = _search_pexels(query, used_ids)
        except (requests.RequestException, KeyError, ValueError) as exc:
            logger.warning("Pexels image lookup failed for %r: %s", query, exc)
            continue
        if found:
            photo_id, image_url = found
            used_ids.add(photo_id)
            image_cache[cache_key] = image_url
            return image_url

    image_cache[cache_key] = ""
    return ""


def _save_generated_plan(meal_plan: MealPlan, payload: dict) -> None:
    image_cache: dict = {}

    for day in payload.get("days", []):
        day_of_week = day["day_of_week"]
        for meal in day.get("meals", []):
            image_url = _fetch_recipe_image_url(meal, image_cache)
            recipe = Recipe.objects.create(
                name=meal["name"],
                region=meal.get("region", ""),
                description=meal.get("description", ""),
                calories=meal.get("calories"),
                protein_g=meal.get("protein_g"),
                carbs_g=meal.get("carbs_g"),
                fat_g=meal.get("fat_g"),
                fiber_g=meal.get("fiber_g"),
                free_sugar_g=meal.get("free_sugar_g"),
                sat_fat_g=meal.get("sat_fat_g"),
                sodium_mg=meal.get("sodium_mg"),
                fruit_veg_g=meal.get("fruit_veg_g"),
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
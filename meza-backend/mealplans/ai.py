import json
import time

from django.conf import settings
from google import genai
from google.genai.errors import ServerError

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe

MODEL_NAME = "gemini-3.5-flash"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5

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


def _save_generated_plan(meal_plan: MealPlan, payload: dict) -> None:
    for day in payload.get("days", []):
        day_of_week = day["day_of_week"]
        for meal in day.get("meals", []):
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
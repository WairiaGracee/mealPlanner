from rest_framework import serializers

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe
from .who_guidelines import NUTRIENT_FIELDS, build_targets, summarize


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            "id", "name", "region", "description", "calories",
            "protein_g", "carbs_g", "fat_g", "fiber_g", "free_sugar_g",
            "sat_fat_g", "sodium_mg", "fruit_veg_g", "prep_minutes",
            "image_url", "emoji", "ingredients", "steps", "tags",
        ]


class PlannedMealSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer()
    day_of_week_display = serializers.CharField(source="get_day_of_week_display", read_only=True)

    class Meta:
        model = PlannedMeal
        fields = ["id", "day_of_week", "day_of_week_display", "meal_type", "recipe"]


class GroceryListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItem
        fields = ["id", "name", "quantity", "category", "is_checked"]


class MealPlanStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ["id", "status", "error_message", "prompt", "week_start_date"]


class MealPlanDetailSerializer(serializers.ModelSerializer):
    meals = PlannedMealSerializer(many=True, read_only=True)
    grocery_items = GroceryListItemSerializer(many=True, read_only=True)
    weekly_nutrition = serializers.SerializerMethodField()

    class Meta:
        model = MealPlan
        fields = [
            "id", "status", "week_start_date", "is_active", "prompt",
            "meals", "grocery_items", "weekly_nutrition", "created_at",
        ]

    def get_weekly_nutrition(self, obj):
        meals = [
            {"day_of_week": m.day_of_week,
             **{f: getattr(m.recipe, f) for f in NUTRIENT_FIELDS}}
            for m in obj.meals.all()
        ]
        return summarize(meals, build_targets(obj.user.profile))
class UserRecipeSerializer(serializers.ModelSerializer):
    """What a person can fill in when writing their own recipe."""

    ingredients = serializers.ListField(
        child=serializers.DictField(), allow_empty=False, max_length=60
    )
    steps = serializers.ListField(
        child=serializers.CharField(max_length=1000, allow_blank=True),
        allow_empty=False,
        max_length=40,
    )

    class Meta:
        model = Recipe
        fields = [
            "name", "description", "region", "prep_minutes",
            "calories", "emoji", "ingredients", "steps",
        ]

    def validate_ingredients(self, value):
        cleaned = []
        for item in value:
            name = str(item.get("name", "")).strip()[:100]
            if not name:
                continue
            quantity = str(item.get("quantity", "")).strip()[:50]
            cleaned.append({"name": name, "quantity": quantity})
        if not cleaned:
            raise serializers.ValidationError("Add at least one ingredient.")
        return cleaned

    def validate_steps(self, value):
        cleaned = [s.strip() for s in value if s.strip()]
        if not cleaned:
            raise serializers.ValidationError("Add at least one step.")
        return cleaned
from rest_framework import serializers

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            "id", "name", "region", "description", "calories",
            "prep_minutes", "image_url", "ingredients", "steps", "tags",
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

    class Meta:
        model = MealPlan
        fields = [
            "id", "status", "week_start_date", "is_active", "prompt",
            "meals", "grocery_items", "created_at",
        ]
import uuid

from django.conf import settings
from django.db import models


class Recipe(models.Model):
    """A single Kenyan dish — the backend counterpart to the frontend's
    MealPlanPreview/DishFeature mock data. AI-generated or hand-authored
    recipes will both live here."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    region = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    calories = models.PositiveSmallIntegerField(null=True, blank=True)
    prep_minutes = models.PositiveSmallIntegerField(null=True, blank=True)
    image_url = models.URLField(blank=True)

    # [{ "name": "Sukuma wiki", "quantity": "1", "unit": "bunch" }, ...]
    ingredients = models.JSONField(default=list, blank=True)
    # ["Wash and chop the greens.", "Heat oil in a pan...", ...]
    steps = models.JSONField(default=list, blank=True)
    # Dietary/health tags this recipe suits, e.g. ["vegetarian", "low_sodium"]
    tags = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class MealPlan(models.Model):
    """One user's plan for a given week."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="meal_plans"
    )
    week_start_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-week_start_date"]

    def __str__(self):
        return f"{self.user.email} — week of {self.week_start_date}"


class PlannedMeal(models.Model):
    """A single recipe slotted into a specific day/meal-type of a plan."""

    class DayOfWeek(models.IntegerChoices):
        MONDAY = 0, "Monday"
        TUESDAY = 1, "Tuesday"
        WEDNESDAY = 2, "Wednesday"
        THURSDAY = 3, "Thursday"
        FRIDAY = 4, "Friday"
        SATURDAY = 5, "Saturday"
        SUNDAY = 6, "Sunday"

    class MealType(models.TextChoices):
        BREAKFAST = "breakfast", "Breakfast"
        LUNCH = "lunch", "Lunch"
        DINNER = "dinner", "Dinner"
        SNACK = "snack", "Snack"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name="meals")
    recipe = models.ForeignKey(Recipe, on_delete=models.PROTECT, related_name="+")
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    meal_type = models.CharField(max_length=20, choices=MealType.choices)

    class Meta:
        ordering = ["day_of_week", "meal_type"]
        unique_together = ["meal_plan", "day_of_week", "meal_type"]

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.meal_type}: {self.recipe.name}"


class GroceryListItem(models.Model):
    """Auto-compiled from a MealPlan's recipes, grouped by category —
    mirrors the categorized shopping list shown on the dashboard."""

    class Category(models.TextChoices):
        PROTEINS = "proteins", "Proteins"
        VEGETABLES = "vegetables", "Vegetables"
        CARBS_STAPLES = "carbs_staples", "Carbohydrates & Staples"
        FRUITS = "fruits", "Fruits"
        DAIRY = "dairy", "Dairy"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meal_plan = models.ForeignKey(
        MealPlan, on_delete=models.CASCADE, related_name="grocery_items"
    )
    name = models.CharField(max_length=150)
    quantity = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER)
    is_checked = models.BooleanField(default=False)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.quantity})"
from django.contrib import admin

from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ["name", "region", "calories", "prep_minutes"]
    search_fields = ["name", "region"]


class PlannedMealInline(admin.TabularInline):
    model = PlannedMeal
    extra = 0


class GroceryListItemInline(admin.TabularInline):
    model = GroceryListItem
    extra = 0


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ["user", "week_start_date", "is_active"]
    list_filter = ["is_active"]
    inlines = [PlannedMealInline, GroceryListItemInline]
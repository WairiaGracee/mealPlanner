from django.urls import path

from .views import (
    ActiveMealPlanView,
    GenerateMealPlanView,
    GroceryItemUpdateView,
    MealPlanDetailView,
    MealPlanStatusView,
    RecipeDetailView,
    RecipeListView,
)

urlpatterns = [
    path("generate/", GenerateMealPlanView.as_view(), name="mealplan-generate"),
    path("active/", ActiveMealPlanView.as_view(), name="mealplan-active"),
    path("recipes/", RecipeListView.as_view(), name="mealplan-recipes"),
    path("recipes/<uuid:pk>/", RecipeDetailView.as_view(), name="mealplan-recipe-detail"),
    path("grocery-items/<uuid:pk>/", GroceryItemUpdateView.as_view(), name="grocery-item-update"),
    path("<uuid:pk>/", MealPlanDetailView.as_view(), name="mealplan-detail"),
    path("<uuid:pk>/status/", MealPlanStatusView.as_view(), name="mealplan-status"),
]
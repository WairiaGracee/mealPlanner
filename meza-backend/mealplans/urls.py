from django.urls import path

from .views import (
    ActiveMealPlanView,
    CollectionListView,
    CollectionToggleView,
    GenerateMealPlanView,
    GroceryItemUpdateView,
    MealPlanDetailView,
    MealPlanListView,
    MealPlanStatusView,
    RecipeDetailView,
    RecipeListView,
)

urlpatterns = [
    path("generate/", GenerateMealPlanView.as_view(), name="mealplan-generate"),
        path("", MealPlanListView.as_view(), name="mealplan-list"),
    path("collection/", CollectionListView.as_view(), name="mealplan-collection"),
    path(
        "recipes/<uuid:pk>/collection/",
        CollectionToggleView.as_view(),
        name="mealplan-collection-toggle",
    ),
    path("active/", ActiveMealPlanView.as_view(), name="mealplan-active"),
    path("recipes/", RecipeListView.as_view(), name="mealplan-recipes"),
    path("recipes/<uuid:pk>/", RecipeDetailView.as_view(), name="mealplan-recipe-detail"),
    path("grocery-items/<uuid:pk>/", GroceryItemUpdateView.as_view(), name="grocery-item-update"),
    path("<uuid:pk>/", MealPlanDetailView.as_view(), name="mealplan-detail"),
    path("<uuid:pk>/status/", MealPlanStatusView.as_view(), name="mealplan-status"),
]
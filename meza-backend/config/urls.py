from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/profile/", include("profiles.urls")),
    # mealplans app has models scaffolded (Recipe, MealPlan, PlannedMeal,
    # GroceryListItem) but no API endpoints wired up yet — that's the
    # next piece of backend work, once the frontend dashboard needs
    # real plan data instead of mock data.
]
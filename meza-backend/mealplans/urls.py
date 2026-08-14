from django.urls import path

from .views import (
    ActiveMealPlanView,
    GenerateMealPlanView,
    MealPlanDetailView,
    MealPlanStatusView,
)

urlpatterns = [
    path("generate/", GenerateMealPlanView.as_view(), name="mealplan-generate"),
    path("active/", ActiveMealPlanView.as_view(), name="mealplan-active"),
    path("<uuid:pk>/", MealPlanDetailView.as_view(), name="mealplan-detail"),
    path("<uuid:pk>/status/", MealPlanStatusView.as_view(), name="mealplan-status"),
]
import threading
from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import generate_meal_plan_sync
from .models import GroceryListItem, MealPlan, Recipe
from .serializers import (
    GroceryListItemSerializer,
    MealPlanDetailSerializer,
    MealPlanStatusSerializer,
    RecipeSerializer,
)


def _monday_of_this_week():
    today = date.today()
    return today - timedelta(days=today.weekday())


class GenerateMealPlanView(APIView):
    """POST /api/mealplans/generate/ — kicks off generation in a
    background thread and returns immediately with a pending plan id
    for the frontend to poll."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        MealPlan.objects.filter(user=request.user, is_active=True).update(is_active=False)
        meal_plan = MealPlan.objects.create(
            user=request.user,
            week_start_date=_monday_of_this_week(),
            status=MealPlan.Status.PENDING,
        )

        thread = threading.Thread(
            target=generate_meal_plan_sync, args=(meal_plan,), daemon=True
        )
        thread.start()

        return Response(
            MealPlanStatusSerializer(meal_plan).data, status=status.HTTP_202_ACCEPTED
        )


class MealPlanStatusView(APIView):
    """GET /api/mealplans/<id>/status/ — lightweight poll target."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        meal_plan = get_object_or_404(MealPlan, pk=pk, user=request.user)
        return Response(MealPlanStatusSerializer(meal_plan).data)


class MealPlanDetailView(APIView):
    """GET /api/mealplans/<id>/ — full plan with meals + grocery list."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        meal_plan = get_object_or_404(
            MealPlan.objects.prefetch_related("meals__recipe", "grocery_items"),
            pk=pk,
            user=request.user,
        )
        return Response(MealPlanDetailSerializer(meal_plan).data)


class ActiveMealPlanView(APIView):
    """GET /api/mealplans/active/ — the user's current active plan with
    full meal + grocery detail, or 404 if none exists yet."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        meal_plan = (
            MealPlan.objects.filter(user=request.user, is_active=True)
            .prefetch_related("meals__recipe", "grocery_items")
            .order_by("-created_at")
            .first()
        )
        if meal_plan is None:
            return Response({"detail": "No meal plan yet."}, status=404)
        return Response(MealPlanDetailSerializer(meal_plan).data)


class GroceryItemUpdateView(APIView):
    """PATCH /api/mealplans/grocery-items/<id>/ — toggle a single item's
    checked state, e.g. from a grocery-list checklist UI."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        item = get_object_or_404(GroceryListItem, pk=pk, meal_plan__user=request.user)
        is_checked = request.data.get("is_checked")
        if is_checked is not None:
            item.is_checked = bool(is_checked)
            item.save(update_fields=["is_checked"])
        return Response(GroceryListItemSerializer(item).data)


class RecipeListView(APIView):
    """GET /api/mealplans/recipes/ — every distinct recipe that has
    appeared in any of the user's generated meal plans, most recent first."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recipes = (
            Recipe.objects.filter(planned_meals__meal_plan__user=request.user)
            .distinct()
            .order_by("-created_at")
        )
        return Response(RecipeSerializer(recipes, many=True).data)
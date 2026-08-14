import threading
from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import generate_meal_plan_sync
from .models import MealPlan
from .serializers import MealPlanDetailSerializer, MealPlanStatusSerializer


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
    """GET /api/mealplans/<id>/ — full plan with meals + grocery list,
    once status is "ready"."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        meal_plan = get_object_or_404(
            MealPlan.objects.prefetch_related("meals__recipe", "grocery_items"),
            pk=pk,
            user=request.user,
        )
        return Response(MealPlanDetailSerializer(meal_plan).data)


class ActiveMealPlanView(APIView):
    """GET /api/mealplans/active/ — convenience lookup for the dashboard:
    the user's current active plan, whatever its status."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        meal_plan = (
            MealPlan.objects.filter(user=request.user, is_active=True)
            .order_by("-created_at")
            .first()
        )
        if meal_plan is None:
            return Response({"detail": "No meal plan yet."}, status=404)
        return Response(MealPlanStatusSerializer(meal_plan).data)
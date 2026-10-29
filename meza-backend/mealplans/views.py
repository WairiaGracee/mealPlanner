import threading
from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import generate_meal_plan_sync
from .models import GroceryListItem, MealPlan, PlannedMeal, Recipe, SavedRecipe
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
        data = RecipeSerializer(recipes, many=True).data

        # Which meal slot (breakfast/lunch/dinner/snack) each recipe was
        # planned for — the Recipes page shows this as the "Category".
        # Oldest plan first, so the most recent plan's slot wins.
        categories = {
            str(recipe_id): meal_type
            for recipe_id, meal_type in PlannedMeal.objects.filter(
                meal_plan__user=request.user
            )
            .order_by("meal_plan__week_start_date")
            .values_list("recipe_id", "meal_type")
        }
        flags = {}
        for recipe_id, kind in SavedRecipe.objects.filter(user=request.user).values_list(
            "recipe_id", "kind"
        ):
            flags.setdefault(str(recipe_id), set()).add(kind)

        for item in data:
            item["category"] = categories.get(item["id"], "")
            item["is_favourite"] = "favourite" in flags.get(item["id"], set())
            item["is_saved"] = "saved" in flags.get(item["id"], set())
        return Response(data)


class RecipeDetailView(APIView):
    """GET /api/mealplans/recipes/<id>/ — a single recipe, scoped to
    recipes that have appeared in one of the user's own meal plans (so
    people can't enumerate other users' recipes by guessing ids)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        recipe = get_object_or_404(
            Recipe.objects.filter(planned_meals__meal_plan__user=request.user).distinct(),
            pk=pk,
        )
        data = RecipeSerializer(recipe).data
        kinds = set(
            SavedRecipe.objects.filter(user=request.user, recipe=recipe).values_list(
                "kind", flat=True
            )
        )
        data["is_favourite"] = "favourite" in kinds
        data["is_saved"] = "saved" in kinds
        return Response(data)

VALID_KINDS = {value for value, _ in SavedRecipe.Kind.choices}


class MealPlanListView(APIView):
    """GET /api/mealplans/ — the user's finished meal plans, newest first
    (powers the Meal History page)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        plans = (
            MealPlan.objects.filter(user=request.user, status=MealPlan.Status.READY)
            .prefetch_related("meals__recipe")
            .order_by("-created_at")
        )
        data = []
        for plan in plans:
            meals = list(plan.meals.all())
            data.append(
                {
                    "id": str(plan.id),
                    "week_start_date": plan.week_start_date,
                    "is_active": plan.is_active,
                    "created_at": plan.created_at,
                    "meal_count": len(meals),
                    "preview": [
                        {
                            "name": m.recipe.name,
                            "emoji": m.recipe.emoji,
                            "image_url": m.recipe.image_url,
                        }
                        for m in meals[:4]
                    ],
                }
            )
        return Response(data)


class CollectionListView(APIView):
    """GET /api/mealplans/collection/?kind=favourite|saved — the recipes
    in one of the user's collections, most recently added first."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        kind = request.query_params.get("kind")
        if kind not in VALID_KINDS:
            return Response({"detail": "kind must be 'favourite' or 'saved'."}, status=400)
        entries = SavedRecipe.objects.filter(user=request.user, kind=kind).select_related(
            "recipe"
        )
        return Response(RecipeSerializer([e.recipe for e in entries], many=True).data)


class CollectionToggleView(APIView):
    """POST /api/mealplans/recipes/<id>/collection/ — body
    {"kind": "favourite" | "saved"}. Adds the recipe to that collection,
    or removes it if it's already there."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        kind = request.data.get("kind")
        if kind not in VALID_KINDS:
            return Response({"detail": "kind must be 'favourite' or 'saved'."}, status=400)
        recipe = get_object_or_404(
            Recipe.objects.filter(planned_meals__meal_plan__user=request.user).distinct(),
            pk=pk,
        )
        entry, created = SavedRecipe.objects.get_or_create(
            user=request.user, recipe=recipe, kind=kind
        )
        if not created:
            entry.delete()
        return Response({"kind": kind, "active": created})
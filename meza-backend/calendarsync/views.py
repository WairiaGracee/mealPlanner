from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GoogleCalendarConnection, ReminderPreference
from .sync import MEAL_HOURS, clear_future_reminders, sync_meal_reminders

from mealplans.models import MealPlan

from . import google_client
from .models import GoogleCalendarConnection

User = get_user_model()
signer = TimestampSigner()

MEAL_PREP_HOUR = 17  # 5pm local time — evening prep/cook reminder
GROCERY_HOUR = 9  # 9am the day before the plan week starts


class GoogleCalendarConnectView(APIView):
    """GET /api/calendar/connect/ — returns the Google consent URL for
    the frontend to redirect the browser to. `state` is a signed,
    10-minute-expiring token carrying the user's id, so the callback
    (a plain browser redirect from Google, not an authenticated API
    call) can identify who's connecting without depending on cookies
    surviving the Google round trip."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        state = signer.sign(str(request.user.id))
        return Response({"auth_url": google_client.build_auth_url(state)})


@method_decorator(csrf_exempt, name="dispatch")
class GoogleCalendarCallbackView(APIView):
    """GET /api/calendar/callback/ — Google redirects the browser here
    after the user grants (or denies) consent. Redirects on to the
    frontend settings page with a ?calendar= query param so the UI can
    show the result."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        frontend = settings.FRONTEND_URL.rstrip("/")

        if request.GET.get("error"):
            return HttpResponseRedirect(f"{frontend}/settings?calendar=error")

        code = request.GET.get("code")
        state = request.GET.get("state")
        if not code or not state:
            return HttpResponseRedirect(f"{frontend}/settings?calendar=error")

        try:
            user_id = signer.unsign(state, max_age=600)
            user = User.objects.get(id=user_id)
        except (BadSignature, SignatureExpired, User.DoesNotExist):
            return HttpResponseRedirect(f"{frontend}/settings?calendar=error")

        try:
            tokens = google_client.exchange_code(code)
        except Exception:
            return HttpResponseRedirect(f"{frontend}/settings?calendar=error")

        if "refresh_token" not in tokens:
            # Shouldn't happen since we always pass prompt=consent, but
            # if Google still omits it, we have nothing to refresh with
            # later — better to surface that than silently store a
            # connection that dies in an hour.
            return HttpResponseRedirect(
                f"{frontend}/settings?calendar=error&reason=no_refresh_token"
            )

        GoogleCalendarConnection.objects.update_or_create(
            user=user,
            defaults={
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "token_expiry": timezone.now()
                + timedelta(seconds=tokens.get("expires_in", 3600)),
                "scope": tokens.get("scope", ""),
            },
        )
        return HttpResponseRedirect(f"{frontend}/settings?calendar=connected")


class GoogleCalendarStatusView(APIView):
    """GET /api/calendar/status/"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        connection = GoogleCalendarConnection.objects.filter(user=request.user).first()
        return Response(
            {
                "connected": connection is not None,
                "connected_at": connection.connected_at if connection else None,
            }
        )


@method_decorator(csrf_exempt, name="dispatch")
class GoogleCalendarDisconnectView(APIView):
    """POST /api/calendar/disconnect/"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        connection = GoogleCalendarConnection.objects.filter(user=request.user).first()
        if connection is not None:
            clear_future_reminders(request.user, connection)
            ReminderPreference.objects.filter(user=request.user).update(enabled=False)
            connection.delete()
        return Response(status=204)


@method_decorator(csrf_exempt, name="dispatch")
class SyncMealPlanToCalendarView(APIView):
    """POST /api/calendar/sync/ — body: {"meal_plan_id": "<uuid>"}
    (optional; defaults to the user's active plan). Creates one grocery
    -shopping reminder plus one meal-prep reminder per day that has
    meals, on the user's own Google Calendar."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        connection = GoogleCalendarConnection.objects.filter(user=request.user).first()
        if connection is None:
            return Response({"detail": "Google Calendar isn't connected yet."}, status=400)

        meal_plan_id = request.data.get("meal_plan_id")
        qs = MealPlan.objects.filter(user=request.user).prefetch_related(
            "meals__recipe", "grocery_items"
        )
        meal_plan = (
            qs.filter(pk=meal_plan_id).first()
            if meal_plan_id
            else qs.filter(is_active=True).order_by("-created_at").first()
        )
        if meal_plan is None:
            return Response({"detail": "No meal plan to sync."}, status=404)

        created_links = []
        errors = []

        grocery_items = list(meal_plan.grocery_items.all())
        if grocery_items:
            shop_date = meal_plan.week_start_date - timedelta(days=1)
            lines = [
                f"- {item.name}" + (f" ({item.quantity})" if item.quantity else "")
                for item in grocery_items
            ]
            event = _build_event(
                title="🛒 intentionallyWell: Grocery shopping",
                description="This week's grocery list:\n" + "\n".join(lines),
                day=shop_date,
                hour=GROCERY_HOUR,
                reminder_minutes=60,
            )
            try:
                result = google_client.create_event(connection, event)
                created_links.append(result.get("htmlLink"))
            except Exception as exc:
                errors.append(str(exc))

        meals_by_day: dict[int, list] = {}
        for meal in meal_plan.meals.all():
            meals_by_day.setdefault(meal.day_of_week, []).append(meal)

        for day_of_week, meals in meals_by_day.items():
            meal_date = meal_plan.week_start_date + timedelta(days=day_of_week)
            lines = [f"- {m.get_meal_type_display()}: {m.recipe.name}" for m in meals]
            event = _build_event(
                title=f"🍽️ intentionallyWell: Meal prep — {meal_date.strftime('%A')}",
                description="\n".join(lines),
                day=meal_date,
                hour=MEAL_PREP_HOUR,
                reminder_minutes=30,
            )
            try:
                result = google_client.create_event(connection, event)
                created_links.append(result.get("htmlLink"))
            except Exception as exc:
                errors.append(str(exc))

        return Response({"created": len(created_links), "links": created_links, "errors": errors})


def _build_event(title: str, description: str, day, hour: int, reminder_minutes: int) -> dict:
    naive_start = datetime.combine(day, datetime.min.time()).replace(hour=hour)
    start = timezone.make_aware(naive_start)
    end = start + timedelta(minutes=30)
    return {
        "summary": title,
        "description": description,
        "start": {"dateTime": start.isoformat(), "timeZone": settings.TIME_ZONE},
        "end": {"dateTime": end.isoformat(), "timeZone": settings.TIME_ZONE},
        "reminders": {
            "useDefault": False,
            "overrides": [{"method": "popup", "minutes": reminder_minutes}],
        },
    }

@method_decorator(csrf_exempt, name="dispatch")
class ReminderSettingsView(APIView):
    """GET   /api/calendar/reminders/ — the user's meal-reminder settings.
    PATCH /api/calendar/reminders/ — body {"enabled": bool, "meals": [...]}.
    Saving also updates the reminders on their calendar right away."""

    permission_classes = [permissions.IsAuthenticated]

    def _payload(self, user, **extra):
        prefs = ReminderPreference.objects.filter(user=user).first()
        return {
            "connected": GoogleCalendarConnection.objects.filter(user=user).exists(),
            "enabled": bool(prefs and prefs.enabled),
            "meals": prefs.meals if prefs else [],
            **extra,
        }

    def get(self, request):
        return Response(self._payload(request.user))

    def patch(self, request):
        enabled = bool(request.data.get("enabled"))
        meals = request.data.get("meals", [])
        if not isinstance(meals, list) or any(m not in MEAL_HOURS for m in meals):
            return Response({"detail": "Choose from breakfast, lunch or dinner."}, status=400)
        if enabled and not meals:
            return Response({"detail": "Pick at least one meal to be reminded about."}, status=400)
        if not GoogleCalendarConnection.objects.filter(user=request.user).exists():
            return Response({"detail": "Connect Google Calendar first."}, status=400)

        ReminderPreference.objects.update_or_create(
            user=request.user, defaults={"enabled": enabled, "meals": meals}
        )

        meal_plan = (
            MealPlan.objects.filter(
                user=request.user, is_active=True, status=MealPlan.Status.READY
            )
            .order_by("-created_at")
            .first()
        )
        result = {"created": 0, "error": None}
        if meal_plan is not None:
            result = sync_meal_reminders(request.user, meal_plan)

        return Response(
            self._payload(request.user, created=result["created"], error=result["error"])
        )
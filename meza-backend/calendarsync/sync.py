import logging
from datetime import datetime, timedelta

from django.conf import settings
from django.utils import timezone

from . import google_client
from .models import GoogleCalendarConnection, ReminderPreference, SyncedCalendarEvent

logger = logging.getLogger(__name__)

# Meal times (Nairobi time), and how long before each one the notification fires.
MEAL_HOURS = {"breakfast": 8, "lunch": 13, "dinner": 19}
REMINDER_LEAD_MINUTES = 60


def clear_future_reminders(user, connection) -> None:
    """Remove the meal reminders we added that haven't happened yet."""
    for entry in SyncedCalendarEvent.objects.filter(user=user, starts_at__gte=timezone.now()):
        try:
            google_client.delete_event(connection, entry.google_event_id)
        except Exception:
            logger.warning("Couldn't delete calendar event %s", entry.google_event_id)
        entry.delete()


def _meal_start(week_start, day_of_week: int, hour: int):
    day = week_start + timedelta(days=day_of_week)
    return timezone.make_aware(datetime.combine(day, datetime.min.time()).replace(hour=hour))


def sync_meal_reminders(user, meal_plan) -> dict:
    """Make the user's calendar match their reminder settings for this plan.
    Returns {"created": number, "error": text or None}."""
    connection = GoogleCalendarConnection.objects.filter(user=user).first()
    if connection is None:
        return {"created": 0, "error": "Google Calendar isn't connected."}

    # Replace what we added before, so plans and re-syncs never stack up.
    clear_future_reminders(user, connection)

    prefs = ReminderPreference.objects.filter(user=user).first()
    if prefs is None or not prefs.enabled:
        return {"created": 0, "error": None}

    wanted = [m for m in prefs.meals if m in MEAL_HOURS]
    now = timezone.now()
    frontend = settings.FRONTEND_URL.rstrip("/")
    created = 0

    for meal in meal_plan.meals.select_related("recipe"):
        if meal.meal_type not in wanted:
            continue
        start = _meal_start(meal_plan.week_start_date, meal.day_of_week, MEAL_HOURS[meal.meal_type])
        if start - timedelta(minutes=REMINDER_LEAD_MINUTES) <= now:
            continue  # the notification time has already passed
        event = {
            "summary": f"🍽️ {meal.get_meal_type_display()}: {meal.recipe.name}",
            "description": f"Planned by IntentionallyWell.\n{frontend}/recipes/{meal.recipe.id}",
            "start": {"dateTime": start.isoformat(), "timeZone": settings.TIME_ZONE},
            "end": {
                "dateTime": (start + timedelta(minutes=45)).isoformat(),
                "timeZone": settings.TIME_ZONE,
            },
            "reminders": {
                "useDefault": False,
                "overrides": [{"method": "popup", "minutes": REMINDER_LEAD_MINUTES}],
            },
        }
        try:
            result = google_client.create_event(connection, event)
        except Exception as exc:
            logger.warning("Couldn't create meal reminder: %s", exc)
            return {
                "created": created,
                "error": "Google Calendar rejected the request. Try reconnecting it.",
            }
        SyncedCalendarEvent.objects.create(
            user=user,
            meal_plan=meal_plan,
            google_event_id=result["id"],
            starts_at=start,
        )
        created += 1

    return {"created": created, "error": None}
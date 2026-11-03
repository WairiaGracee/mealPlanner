import uuid

from django.conf import settings
from django.db import models


class GoogleCalendarConnection(models.Model):
    """OAuth tokens that let us create events on a user's own Google
    Calendar. This is a separate consent/scope from Google Sign-In
    (accounts.User.auth_provider) — sign-in only verifies identity via
    an ID token and never grants Calendar access."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="calendar_connection",
    )
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField()
    scope = models.TextField(blank=True)
    connected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} — Google Calendar"

class ReminderPreference(models.Model):
    """Whether (and for which meals) a user wants a Google Calendar
    notification an hour before each meal."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reminder_preference",
    )
    enabled = models.BooleanField(default=False)
    meals = models.JSONField(default=list, blank=True)  # e.g. ["lunch", "dinner"]
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} — reminders {'on' if self.enabled else 'off'}"


class SyncedCalendarEvent(models.Model):
    """A meal reminder we created on the user's Google Calendar, kept so we
    can replace or remove it later instead of leaving duplicates behind."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="synced_events"
    )
    meal_plan = models.ForeignKey(
        "mealplans.MealPlan", on_delete=models.CASCADE, related_name="calendar_events"
    )
    google_event_id = models.CharField(max_length=255)
    starts_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
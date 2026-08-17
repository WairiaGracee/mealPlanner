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
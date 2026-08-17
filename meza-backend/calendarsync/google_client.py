"""Thin wrapper around Google's OAuth2 + Calendar REST APIs using plain
`requests` calls — no google-api-python-client dependency needed since
we only ever hit two endpoints (token exchange/refresh, event insert).

This is a separate OAuth flow from Google Sign-In (accounts/views.py):
sign-in verifies an ID token for identity only, while this requests the
`calendar.events` scope with offline access so we can create events on
the user's behalf later, without them being present.
"""
from datetime import timedelta
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.utils import timezone

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events"


def build_auth_url(state: str) -> str:
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_CALENDAR_REDIRECT_URI,
        "response_type": "code",
        "scope": CALENDAR_SCOPE,
        # offline + consent guarantees a refresh_token comes back even
        # if the user connected before — without "consent" Google skips
        # the refresh_token on repeat authorizations.
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    return f"{AUTH_URL}?{urlencode(params)}"


def exchange_code(code: str) -> dict:
    response = requests.post(
        TOKEN_URL,
        data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_CALENDAR_REDIRECT_URI,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def _refresh(refresh_token_value: str) -> dict:
    response = requests.post(
        TOKEN_URL,
        data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "refresh_token": refresh_token_value,
            "grant_type": "refresh_token",
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def get_valid_access_token(connection) -> str:
    """Returns a live access token, refreshing it first if it's expired
    or about to expire in the next 60 seconds."""
    if connection.token_expiry <= timezone.now() + timedelta(seconds=60):
        data = _refresh(connection.refresh_token)
        connection.access_token = data["access_token"]
        connection.token_expiry = timezone.now() + timedelta(
            seconds=data.get("expires_in", 3600)
        )
        connection.save(update_fields=["access_token", "token_expiry"])
    return connection.access_token


def create_event(connection, event: dict) -> dict:
    access_token = get_valid_access_token(connection)
    response = requests.post(
        EVENTS_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        json=event,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()
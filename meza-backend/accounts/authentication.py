from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    """Reads the access token from an httpOnly cookie instead of the
    Authorization header. The frontend never sees or handles the raw
    token — the browser sends the cookie automatically.

    If the cookie is present but stale/invalid (expired, malformed, or
    pointing at a user that no longer exists — e.g. after a dev DB
    reset), this treats it the same as "no cookie" rather than raising,
    so it never blocks an AllowAny endpoint like register/login."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS)
        if raw_token is None:
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError, AuthenticationFailed):
            return None
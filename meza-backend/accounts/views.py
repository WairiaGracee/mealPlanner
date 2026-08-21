from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from google.auth import exceptions as google_exceptions
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from .serializers import (
    GoogleAuthSerializer,
    RegisterSerializer,
    UpdateProfileSerializer,
    UserSerializer,
)

User = get_user_model()


def _set_auth_cookies(response, access, refresh=None):
    response.set_cookie(
        settings.AUTH_COOKIE_ACCESS,
        access,
        max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )
    if refresh is not None:
        response.set_cookie(
            settings.AUTH_COOKIE_REFRESH,
            refresh,
            max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
            httponly=True,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            path="/api/auth/",
        )


def _clear_auth_cookies(response):
    response.delete_cookie(settings.AUTH_COOKIE_ACCESS, path="/")
    response.delete_cookie(settings.AUTH_COOKIE_REFRESH, path="/api/auth/")


# These endpoints are authenticated via httpOnly cookie + SameSite=Lax
# rather than Django sessions, so Django's session-based CSRF token
# scheme doesn't apply to them — hence csrf_exempt on each one below.
# (Any future state-changing endpoint elsewhere that relies on the same
# cookie auth — e.g. in profiles/ or mealplans/ — will need the same
# decorator for the same reason.)


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — creates an account and logs the
    person in by setting auth cookies on the response."""

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token_serializer = TokenObtainPairSerializer()
        refresh = token_serializer.get_token(user)

        response = Response(UserSerializer(user, context={"request": request}).data, status=201)
        _set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    """POST /api/auth/login/ — body: {"email": ..., "password": ...}."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data
        user = serializer.user

        response = Response(UserSerializer(user, context={"request": request}).data, status=200)
        _set_auth_cookies(response, str(tokens["access"]), str(tokens["refresh"]))
        return response


@method_decorator(csrf_exempt, name="dispatch")
class GoogleLoginView(APIView):
    """POST /api/auth/google/ — body: {"id_token": "<Google ID token>"}.

    Verifies the token Google issued to the frontend, then creates the
    user on first sign-in or logs them in if they already exist. If an
    email/password account with the same email already exists, it gets
    linked to Google rather than erroring, so either sign-in method
    works going forward.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["id_token"]

        try:
            idinfo = google_id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            # Malformed/expired/wrong-audience token — Google's library
            # documents this as the "verification failed" case.
            return Response({"detail": "Invalid Google token."}, status=401)
        except google_exceptions.GoogleAuthError:
            # Anything else from the google-auth library — most commonly
            # a network/DNS failure fetching Google's signing certs. Not
            # the client's fault, so this is a 503, not a 400/401.
            return Response(
                {"detail": "Couldn't reach Google to verify that token. Please try again."},
                status=503,
            )

        email = idinfo.get("email")
        if not email:
            return Response({"detail": "Google account has no email."}, status=400)
        if not idinfo.get("email_verified", False):
            return Response({"detail": "Google email is not verified."}, status=400)

        email = email.lower()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": idinfo.get("name", ""),
                "auth_provider": "google",
            },
        )
        if created:
            user.set_unusable_password()
            user.save()
        elif user.auth_provider != "google":
            user.auth_provider = "google"
            user.save(update_fields=["auth_provider"])

        token_serializer = TokenObtainPairSerializer()
        refresh = token_serializer.get_token(user)

        response = Response(UserSerializer(user, context={"request": request}).data, status=200)
        _set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response


@method_decorator(csrf_exempt, name="dispatch")
class RefreshView(APIView):
    """POST /api/auth/refresh/ — reads the refresh cookie, issues a new
    access cookie (and rotated refresh cookie, since ROTATE_REFRESH_TOKENS
    is on). No request body needed — the frontend just calls this with
    credentials included."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if not refresh_token:
            return Response({"detail": "No refresh token cookie."}, status=401)

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)

        response = Response(status=200)
        _set_auth_cookies(
            response,
            serializer.validated_data["access"],
            serializer.validated_data.get("refresh"),
        )
        return response


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):
    """POST /api/auth/logout/ — clears both auth cookies."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response(status=204)
        _clear_auth_cookies(response)
        return response


@method_decorator(csrf_exempt, name="dispatch")
class MeView(APIView):
    """GET /api/auth/me/ — the currently authenticated user, or 401 if
    the access cookie is missing/expired (frontend then tries /refresh/).

    PATCH /api/auth/me/ — update display name and/or avatar photo, from
    the profile drawer. Accepts multipart/form-data (for the avatar
    file) or plain JSON (for a name-only change)."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user, context={"request": request}).data)
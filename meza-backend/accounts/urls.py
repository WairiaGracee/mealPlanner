from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import MeView, RegisterView

# Login re-uses SimpleJWT's default TokenObtainPairView rather than a
# custom one — since USERNAME_FIELD is "email" on our custom User model,
# it already expects {"email": ..., "password": ...} out of the box.
urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
]
from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateAPIView

from .models import Profile
from .serializers import ProfileSerializer


class MyProfileView(RetrieveUpdateAPIView):
    """GET/PUT/PATCH /api/profile/me/ — the logged-in user's own profile.
    This is what the onboarding wizard submits to."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile
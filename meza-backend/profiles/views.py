from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateAPIView

from .models import Profile
from .serializers import ProfileSerializer


class MyProfileView(RetrieveUpdateAPIView):
    """GET/PUT/PATCH /api/profile/me/ — the logged-in user's own profile.

    This is what the onboarding wizard submits to, and what the dashboard
    reads from, once both are wired up to the backend instead of
    localStorage.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "height_cm": 0,
                "weight_kg": 0,
                "age": 0,
                "sex": Profile.Sex.PREFER_NOT_TO_SAY,
                "activity_level": Profile.ActivityLevel.SEDENTARY,
                "goal": Profile.Goal.GENERAL_HEALTH,
            },
        )
        return profile
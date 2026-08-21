from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserPreferences
from .serializers import UserPreferencesSerializer


@method_decorator(csrf_exempt, name="dispatch")
class MyPreferencesView(APIView):
    """GET/PATCH /api/preferences/me/ — get-or-create so the frontend
    never has to special-case "no preferences row yet" for a user who
    hasn't opened the personalization panel before; they just get
    Nourish/modern/rounded/pattern/comfortable/English defaults."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        prefs, _ = UserPreferences.objects.get_or_create(user=request.user)
        return Response(UserPreferencesSerializer(prefs).data)

    def patch(self, request):
        prefs, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(prefs, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
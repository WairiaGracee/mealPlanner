from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "goal",
            "household",
            "diet_style",
            "allergies",
            "cooking_time",
            "budget",
            "weight_kg",
            "height_cm",
            "onboarding_completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
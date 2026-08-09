from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    daily_calorie_target = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = [
            "id",
            "height_cm",
            "weight_kg",
            "age",
            "sex",
            "activity_level",
            "goal",
            "allergies",
            "health_conditions",
            "dietary_preference",
            "daily_calorie_target",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "daily_calorie_target", "created_at", "updated_at"]
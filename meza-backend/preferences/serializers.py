from rest_framework import serializers

from .models import UserPreferences


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            "theme_preset",
            "color_mood",
            "typography",
            "card_style",
            "background_style",
            "density",
            "language",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    # False for brand-new users (no Profile row yet) and for anyone who
    # hasn't finished/skipped the onboarding wizard. Lets the frontend
    # decide login/dashboard redirects without a second API call.
    onboarding_completed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "auth_provider", "date_joined", "onboarding_completed"]
        read_only_fields = fields

    def get_onboarding_completed(self, obj):
        profile = getattr(obj, "profile", None)
        return bool(profile and profile.onboarding_completed)


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()
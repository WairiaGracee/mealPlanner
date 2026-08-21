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
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "auth_provider",
            "date_joined",
            "onboarding_completed",
            "avatar_url",
        ]
        read_only_fields = fields

    def get_onboarding_completed(self, obj):
        profile = getattr(obj, "profile", None)
        return bool(profile and profile.onboarding_completed)

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return None
        request = self.context.get("request")
        url = obj.avatar.url
        return request.build_absolute_uri(url) if request else url


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Used for PATCH /api/auth/me/ — deliberately narrower than
    UserSerializer's read-only field list above: only what the profile
    drawer actually lets someone change about their account itself
    (display name, avatar photo). Email/auth_provider changes aren't
    exposed here on purpose."""

    class Meta:
        model = User
        fields = ["full_name", "avatar"]
        extra_kwargs = {
            "full_name": {"required": False},
            "avatar": {"required": False},
        }


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()
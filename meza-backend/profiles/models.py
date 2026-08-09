from django.conf import settings
from django.db import models


class Profile(models.Model):
    """Mirrors the frontend's UserProfile type collected during onboarding.
    Keep these choices in sync with src/types/index.ts on the frontend."""

    class Sex(models.TextChoices):
        FEMALE = "female", "Female"
        MALE = "male", "Male"
        PREFER_NOT_TO_SAY = "prefer_not_to_say", "Prefer not to say"

    class ActivityLevel(models.TextChoices):
        SEDENTARY = "sedentary", "Sedentary"
        LIGHT = "light", "Lightly active"
        MODERATE = "moderate", "Moderately active"
        ACTIVE = "active", "Very active"

    class Goal(models.TextChoices):
        WEIGHT_LOSS = "weight_loss", "Lose weight"
        WEIGHT_GAIN = "weight_gain", "Gain weight"
        MAINTENANCE = "maintenance", "Maintain weight"
        MUSCLE_GAIN = "muscle_gain", "Build muscle"
        GENERAL_HEALTH = "general_health", "General health"

    class DietaryPreference(models.TextChoices):
        NONE = "none", "No restrictions"
        VEGETARIAN = "vegetarian", "Vegetarian"
        VEGAN = "vegan", "Vegan"
        HALAL = "halal", "Halal"
        LOW_SODIUM = "low_sodium", "Low sodium"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )

    height_cm = models.PositiveSmallIntegerField()
    weight_kg = models.PositiveSmallIntegerField()
    age = models.PositiveSmallIntegerField()
    sex = models.CharField(max_length=20, choices=Sex.choices)
    activity_level = models.CharField(max_length=20, choices=ActivityLevel.choices)
    goal = models.CharField(max_length=20, choices=Goal.choices)

    # Simple string lists for now (matches the frontend's string[] shape).
    # Worth revisiting as normalized lookup tables once the list of
    # allergies/conditions needs to be queried or managed independently.
    allergies = models.JSONField(default=list, blank=True)
    health_conditions = models.JSONField(default=list, blank=True)

    dietary_preference = models.CharField(
        max_length=20, choices=DietaryPreference.choices, default=DietaryPreference.NONE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile<{self.user.email}>"

    @property
    def daily_calorie_target(self):
        """Mifflin-St Jeor BMR, scaled by activity level and goal.
        Mirrors the same calculation used on the frontend dashboard so
        the numbers agree once both sides are wired together."""
        if self.sex == self.Sex.MALE:
            bmr = 10 * self.weight_kg + 6.25 * self.height_cm - 5 * self.age + 5
        elif self.sex == self.Sex.FEMALE:
            bmr = 10 * self.weight_kg + 6.25 * self.height_cm - 5 * self.age - 161
        else:
            bmr = 10 * self.weight_kg + 6.25 * self.height_cm - 5 * self.age - 78

        activity_multipliers = {
            self.ActivityLevel.SEDENTARY: 1.2,
            self.ActivityLevel.LIGHT: 1.375,
            self.ActivityLevel.MODERATE: 1.55,
            self.ActivityLevel.ACTIVE: 1.725,
        }
        tdee = bmr * activity_multipliers.get(self.activity_level, 1.2)

        goal_multipliers = {
            self.Goal.WEIGHT_LOSS: 0.8,
            self.Goal.WEIGHT_GAIN: 1.15,
            self.Goal.MUSCLE_GAIN: 1.15,
            self.Goal.MAINTENANCE: 1.0,
            self.Goal.GENERAL_HEALTH: 1.0,
        }
        target = tdee * goal_multipliers.get(self.goal, 1.0)
        return round(target / 10) * 10
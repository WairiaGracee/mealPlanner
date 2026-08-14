from django.conf import settings
from django.db import models


class Profile(models.Model):
    """Mirrors the frontend's OnboardingData type collected during
    onboarding. Keep these choices in sync with src/types/index.ts."""

    class Goal(models.TextChoices):
        LOSE_WEIGHT = "lose_weight", "Lose weight"
        EAT_HEALTHIER = "eat_healthier", "Eat healthier"
        MANAGE_CONDITION = "manage_condition", "Manage a health condition"
        GAIN_MUSCLE = "gain_muscle", "Gain muscle"
        SAVE_MONEY = "save_money", "Save money on groceries"

    class Household(models.TextChoices):
        SOLO = "solo", "Just me"
        COUPLE = "couple", "Couple"
        FAMILY_SMALL = "family_small", "Small family (3-4)"
        FAMILY_LARGE = "family_large", "Large family (5+)"

    class DietStyle(models.TextChoices):
        NO_RESTRICTIONS = "no_restrictions", "No restrictions"
        VEGETARIAN = "vegetarian", "Vegetarian"
        VEGAN = "vegan", "Vegan"
        HALAL = "halal", "Halal"
        LOW_CARB = "low_carb", "Low carb"

    class CookingTime(models.TextChoices):
        MIN_15_20 = "15_20", "15-20 minutes"
        MIN_30_45 = "30_45", "30-45 minutes"
        MIN_45_60 = "45_60", "45-60 minutes"
        MIN_60_PLUS = "60_plus", "60+ minutes"

    class Budget(models.TextChoices):
        BUDGET = "budget", "Budget-friendly"
        MODERATE = "moderate", "Moderate"
        FLEXIBLE = "flexible", "Flexible"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )

    goal = models.CharField(max_length=20, choices=Goal.choices, blank=True)
    household = models.CharField(max_length=20, choices=Household.choices, blank=True)
    diet_style = models.CharField(
        max_length=20, choices=DietStyle.choices, default=DietStyle.NO_RESTRICTIONS
    )
    allergies = models.JSONField(default=list, blank=True)
    cooking_time = models.CharField(max_length=10, choices=CookingTime.choices, blank=True)
    budget = models.CharField(max_length=10, choices=Budget.choices, blank=True)

    weight_kg = models.FloatField(null=True, blank=True)
    height_cm = models.FloatField(null=True, blank=True)

    # Set True once the onboarding wizard is finished (or explicitly
    # skipped) on the frontend, via PATCH /api/profile/me/. Drives the
    # login/dashboard redirect.
    onboarding_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile<{self.user.email}>"
from django.conf import settings
from django.db import models


class UserPreferences(models.Model):
    """Dashboard personalization + language choice. Deliberately separate
    axes rather than one bundled "theme" field: picking a named preset
    (see ThemePreset) sets all of them at once, but each can also be
    overridden independently from the personalization panel — at which
    point `theme_preset` is cleared to "" (custom) since it no longer
    matches any single preset."""

    class ThemePreset(models.TextChoices):
        NOURISH = "nourish", "Nourish"
        BLOOM = "bloom", "Bloom"
        FRESH = "fresh", "Fresh"
        HERITAGE = "heritage", "Heritage"
        MIDNIGHT = "midnight", "Midnight"

    class ColorMood(models.TextChoices):
        NOURISH = "nourish", "Nourish (green/cream)"
        BLOOM = "bloom", "Bloom (pink/cream)"
        FRESH = "fresh", "Fresh (teal/white)"
        HERITAGE = "heritage", "Heritage (terracotta/beige)"
        MIDNIGHT = "midnight", "Midnight (dark green/charcoal)"

    class Typography(models.TextChoices):
        MODERN = "modern", "Modern"
        FRIENDLY = "friendly", "Friendly"
        ELEGANT = "elegant", "Elegant"
        MINIMAL = "minimal", "Minimal"

    class CardStyle(models.TextChoices):
        SHARP = "sharp", "Sharp"
        ROUNDED = "rounded", "Rounded"
        SOFT = "soft", "Soft"

    class BackgroundStyle(models.TextChoices):
        PATTERN = "pattern", "Subtle pattern"
        WARM_PATTERN = "warm_pattern", "Warm pattern"
        PLAIN = "plain", "Plain"
        DARK = "dark", "Dark"

    class Density(models.TextChoices):
        COMPACT = "compact", "Compact"
        COMFORTABLE = "comfortable", "Comfortable"
        SPACIOUS = "spacious", "Spacious"

    class Language(models.TextChoices):
        ENGLISH = "en", "English"
        SWAHILI = "sw", "Kiswahili"
        KIKUYU = "ki", "Gikuyu"
        KAMBA = "kam", "Kikamba"
        EMBU = "ebu", "Kiembu"
        MERU = "mer", "Kimeru"
        ITESO = "teso", "Ateso"
        LUHYA = "luy", "Luluhya"
        LUO = "luo", "Dholuo"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preferences"
    )

    theme_preset = models.CharField(
        max_length=20, choices=ThemePreset.choices, default=ThemePreset.NOURISH, blank=True
    )
    color_mood = models.CharField(
        max_length=20, choices=ColorMood.choices, default=ColorMood.NOURISH
    )
    typography = models.CharField(
        max_length=20, choices=Typography.choices, default=Typography.MODERN
    )
    card_style = models.CharField(
        max_length=20, choices=CardStyle.choices, default=CardStyle.ROUNDED
    )
    background_style = models.CharField(
        max_length=20, choices=BackgroundStyle.choices, default=BackgroundStyle.PATTERN
    )
    density = models.CharField(
        max_length=20, choices=Density.choices, default=Density.COMFORTABLE
    )
    language = models.CharField(max_length=10, choices=Language.choices, default=Language.ENGLISH)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences<{self.user.email}>"

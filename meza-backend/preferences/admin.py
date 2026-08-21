from django.contrib import admin

from .models import UserPreferences


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ["user", "theme_preset", "language", "updated_at"]
    list_filter = ["theme_preset", "language"]
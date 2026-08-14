from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "goal", "household", "diet_style", "onboarding_completed"]
    list_filter = ["goal", "household", "diet_style", "onboarding_completed"]
    search_fields = ["user__email", "user__full_name"]
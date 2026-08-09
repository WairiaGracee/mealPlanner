from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "goal", "activity_level", "daily_calorie_target"]
    search_fields = ["user__email", "user__full_name"]
    list_filter = ["goal", "activity_level", "dietary_preference"]
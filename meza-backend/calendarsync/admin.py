from django.contrib import admin

from .models import GoogleCalendarConnection


@admin.register(GoogleCalendarConnection)
class GoogleCalendarConnectionAdmin(admin.ModelAdmin):
    list_display = ["user", "connected_at", "token_expiry"]
    search_fields = ["user__email"]
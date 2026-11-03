from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["name", "rating", "short_message", "location", "is_featured", "created_at"]
    list_editable = ["is_featured"]
    list_filter = ["is_featured", "rating"]
    search_fields = ["name", "message", "location"]
    readonly_fields = ["created_at"]

    @admin.display(description="Message")
    def short_message(self, obj):
        text = obj.message
        return text if len(text) <= 70 else text[:70] + "…"
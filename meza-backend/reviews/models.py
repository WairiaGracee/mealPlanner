import uuid

from django.conf import settings
from django.db import models


class Review(models.Model):
    """A review left on the landing page. Only reviews the owner marks as
    featured are shown publicly."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviews",
    )
    name = models.CharField(max_length=80)
    location = models.CharField(max_length=80, blank=True)
    rating = models.PositiveSmallIntegerField()
    message = models.TextField()
    is_featured = models.BooleanField(
        default=False, help_text="Tick to show this review on the landing page."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.rating} stars"
from rest_framework import serializers

from .models import Review


class ReviewCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=80)
    location = serializers.CharField(max_length=80, required=False, allow_blank=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    message = serializers.CharField(min_length=5, max_length=1000)

    class Meta:
        model = Review
        fields = ["name", "location", "rating", "message"]


class FeaturedReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "name", "location", "rating", "message"]
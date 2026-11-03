from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from .models import Review
from .serializers import FeaturedReviewSerializer, ReviewCreateSerializer


class ReviewThrottle(SimpleRateThrottle):
    """Stops one visitor from flooding the form: 5 reviews per hour."""

    scope = "review"
    rate = "5/hour"

    def get_cache_key(self, request, view):
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


class ReviewListCreateView(APIView):
    """GET  /api/reviews/ — the reviews the owner has featured (public).
    POST /api/reviews/ — leave a review (public, rate-limited)."""

    permission_classes = [permissions.AllowAny]

    def get_throttles(self):
        if self.request.method == "POST":
            return [ReviewThrottle()]
        return []

    def get(self, request):
        reviews = Review.objects.filter(is_featured=True)[:6]
        return Response(FeaturedReviewSerializer(reviews, many=True).data)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        serializer.save(user=user)
        return Response(
            {"detail": "Thank you! Your review has been received."}, status=201
        )
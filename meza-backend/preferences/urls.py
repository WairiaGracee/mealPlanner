from django.urls import path

from .views import MyPreferencesView

urlpatterns = [
    path("me/", MyPreferencesView.as_view(), name="preferences-me"),
]
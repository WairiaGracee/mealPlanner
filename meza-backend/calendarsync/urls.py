from django.urls import path

from .views import (
    GoogleCalendarCallbackView,
    GoogleCalendarConnectView,
    GoogleCalendarDisconnectView,
    GoogleCalendarStatusView,
    SyncMealPlanToCalendarView,
)

urlpatterns = [
    path("connect/", GoogleCalendarConnectView.as_view(), name="calendar-connect"),
    path("callback/", GoogleCalendarCallbackView.as_view(), name="calendar-callback"),
    path("status/", GoogleCalendarStatusView.as_view(), name="calendar-status"),
    path("disconnect/", GoogleCalendarDisconnectView.as_view(), name="calendar-disconnect"),
    path("sync/", SyncMealPlanToCalendarView.as_view(), name="calendar-sync"),
]
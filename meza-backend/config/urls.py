from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/profile/", include("profiles.urls")),
    path("api/mealplans/", include("mealplans.urls")),
    path("api/calendar/", include("calendarsync.urls")),
    path("api/preferences/", include("preferences.urls")),
]

if settings.DEBUG:
    # Serve uploaded avatars locally in dev. In production, media should
    # be served by real object storage / a proper static file server,
    # not Django itself.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
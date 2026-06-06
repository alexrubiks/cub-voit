from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import wca_login, wca_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path('api-auth/', include('rest_framework.urls')),
    path("auth/wca/login/", wca_login),
    path("auth/wca/callback/", wca_callback),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

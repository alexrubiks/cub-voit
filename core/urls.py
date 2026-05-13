from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from core.views import (
    CompetitionViewSet,
    TravelViewSet,
    UserViewSet,
    VehicleViewSet,
    login_view,
    search_competitions,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'travels', TravelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("competitions-search/", search_competitions),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
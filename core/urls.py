from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core.views import (
    CompetitionViewSet,
    TravelViewSet,
    UserViewSet,
    VehicleViewSet,
    UpdateAvatarView,
    search_competitions,
    sync_competitions,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'travels', TravelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("upload-avatar/", UpdateAvatarView.as_view()),
    path("competitions-search/", search_competitions),
    path("synchro/", sync_competitions), # A SUPPRIMER
]
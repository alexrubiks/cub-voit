from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UserViewSet, VehicleViewSet, CompetitionViewSet, TravelViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'travels', TravelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from rest_framework import viewsets
from core.models import User, Vehicle, Competition, Travel
from core.serializers import UserSerializer, VehicleSerializer, CompetitionSerializer, TravelSerializer

# DRF fournit automatiquement les actions :
#   list → GET /users/
#   retrieve → GET /users/<id>/
#   create → POST /users/
#   update / partial_update → PUT/PATCH
#   destroy → DELETE

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer
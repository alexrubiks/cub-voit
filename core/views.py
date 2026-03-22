from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Competition, Travel, User, Vehicle
from core.serializers import CompetitionSerializer, TravelSerializer, UserSerializer, VehicleSerializer
from .permissions import IsOwner, ReadOnly

# DRF fournit automatiquement les actions :
#   list → GET /users/
#   retrieve → GET /users/<id>/
#   create → POST /users/
#   update / partial_update → PUT/PATCH
#   destroy → DELETE


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)
    
    def create(self, request, *args, **kwargs):
        return Response({"detail": "Creation not allowed via this endpoint."}, status=405)


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Vehicle.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsAuthenticated, ReadOnly]


class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self): # Doit être adaptée à la whitelist plus tard
        return Travel.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
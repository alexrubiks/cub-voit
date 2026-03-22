from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Competition, Travel, User, Vehicle
from core.serializers import CompetitionSerializer, TravelSerializer, UserSerializer, VehicleSerializer
from .permissions import IsOwner, ReadOnly
from django.shortcuts import get_object_or_404

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
    
    # POST /users/<id>/add_to_whitelist/
    @action(detail=True, methods=['post'])
    def add_to_whitelist(self, request, pk=None):
        user_to_add = get_object_or_404(User, pk=pk) # redemander à fiableGPT
        request.user.allowed_users.add(user_to_add)
        return Response({"detail": f"{user_to_add.pseudo} added to whitelist"}, status=200)

    # POST /users/<id>/remove_from_whitelist/
    @action(detail=True, methods=['post'])
    def remove_from_whitelist(self, request, pk=None):
        user_to_remove = get_object_or_404(User, pk=pk) # redemander à fiableGPT
        request.user.allowed_users.remove(user_to_remove)
        return Response({"detail": f"{user_to_remove.pseudo} removed from whitelist"}, status=200)
    
    # GET /users/list_whitelist/
    @action(detail=False, methods=['get'])
    def list_whitelist(self, request):
        whitelist = request.user.allowed_users.all()
        serializer = self.get_serializer(whitelist, many=True)
        return Response(serializer.data)


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
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Competition, Travel, User, Vehicle
from core.serializers import (
    CompetitionSerializer,
    TravelSerializer,
    UserSerializer,
    VehicleSerializer,
)

from .pagination import SmallResultsPagination
from .permissions import IsOwner, IsOwnerOrAllowedOrSelfPassenger, IsSelf, ReadOnly


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [IsAuthenticated, IsSelf]

    filter_backends = [SearchFilter]
    search_fields = ["pseudo", "wca_id"]

    pagination_class = SmallResultsPagination

    def get_queryset(self):
        user = self.request.user

        if self.action == "list":
            search = self.request.query_params.get("search", "").strip()
            if search:
                return User.objects.filter(
                    Q(pseudo__icontains=search) | Q(wca_id__icontains=search)
                )
            return User.objects.none()

        return User.objects.filter(pk=user.pk)
    
    def create(self, request, *args, **kwargs):
        return Response({"detail": "Creation not allowed via this endpoint."}, status=405)
    
    # GET /users/me/
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    # POST /users/<id>/add_to_whitelist/
    @action(detail=True, methods=['post'])
    def add_to_whitelist(self, request, pk=None):
        user_to_add = get_object_or_404(User, pk=pk)

        if user_to_add == request.user:
            return Response({"detail": "Cannot add yourself to the whitelist"}, status=400)

        request.user.allowed_users.add(user_to_add)
        return Response({"detail": f"{user_to_add.pseudo} added to whitelist"}, status=200)

    # POST /users/<id>/remove_from_whitelist/
    @action(detail=True, methods=['post'])
    def remove_from_whitelist(self, request, pk=None):
        user_to_remove = get_object_or_404(User, pk=pk)

        if user_to_remove not in request.user.allowed_users.all():
            return Response({"detail": f"{user_to_remove.pseudo} is already not in the whitelist"}, status=400)
        
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
    filter_backends = [SearchFilter]
    search_fields = ["name", "location_name"]

    pagination_class = SmallResultsPagination


class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer

    permission_classes = [IsAuthenticated, IsOwnerOrAllowedOrSelfPassenger]

    def get_queryset(self):
        user = self.request.user

        return Travel.objects.filter(
            Q(owner=user) | 
            Q(owner__in=user.allowed_by.all())
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # POST /travels/<id>/add_passenger/
    @action(detail=True, methods=['post'])
    def add_passenger(self, request, pk=None):
        travel = self.get_object()
        user_to_add = get_object_or_404(User, pk=request.data.get("user_id")) # nom de "user_id" à modif au besoin
        
        if request.user != travel.owner and request.user != user_to_add:
            return Response({"detail": "Not allowed"}, status=403)

        print(user_to_add, travel.owner)
        if user_to_add == travel.owner:
            return Response({"detail": "Cannot add yourself as a passenger"}, status=400)

        if user_to_add in travel.passengers.all():
            return Response({"detail": f"{user_to_add.pseudo} already added"}, status=400)

        if travel.passengers.count() + 1 >= travel.vehicle.seats:
            return Response({"detail": "Cannot add passenger: vehicle is full"}, status=400)

        travel.passengers.add(user_to_add)
        return Response({"detail": f"{user_to_add.pseudo} added to passengers of {travel.name}"}, status=200)

    # POST /travels/<id>/remove_passenger/
    @action(detail=True, methods=['post'])
    def remove_passenger(self, request, pk=None):
        travel = self.get_object()
        user_to_remove = get_object_or_404(User, pk=request.data.get("user_id")) # nom de "user_id" à modif au besoin

        if request.user != travel.owner and request.user != user_to_remove:
            return Response({"detail": "Not allowed"}, status=403)

        if user_to_remove not in travel.passengers.all():
            return Response({"detail": f"{user_to_remove.pseudo} is not a passenger"}, status=400)

        travel.passengers.remove(user_to_remove)
        return Response({"detail": f"{user_to_remove.pseudo} removed from passengers of {travel.name}"}, status=200)
    
    # GET /travels/<id>/list_passengers/
    @action(detail=True, methods=['get'])
    def list_passengers(self, request, pk=None):
        travel = self.get_object()
        passengers = travel.passengers.all()
        serializer = UserSerializer(passengers, many=True)
        return Response(serializer.data)
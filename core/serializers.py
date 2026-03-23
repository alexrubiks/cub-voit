from .models import User, Vehicle, Competition, Travel
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "pseudo", "wca_id"]

class VehicleSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Vehicle
        fields = "__all__"

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = "__all__"

class TravelSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    passengers = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Travel
        fields = "__all__"
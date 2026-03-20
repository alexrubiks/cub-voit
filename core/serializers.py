from .models import User, Vehicle, Competition, Travel
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["wca_id", "name", "allowed_users"]

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["name", "owner", "seats"]

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = [
            "name",
            "first_day",
            "last_day",
            "location_name",
            "latitude",
            "longitude",
        ]

class TravelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Travel
        fields = [
            "name",
            "owner",
            "start_location_name",
            "start_latitude",
            "start_longitude",
            "end_location_name",
            "end_latitude",
            "end_longitude",
            "competition",
            "vehicle",
        ]
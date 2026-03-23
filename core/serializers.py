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
        fields = ["id", "name", "owner", "seats"]


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = [
            "id",
            "name",
            "first_day",
            "last_day",
            "location_name",
            "latitude",
            "longitude",
        ]


class TravelSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    passengers = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Travel
        fields = [
            "id",
            "name",
            "owner",
            "start_location_name",
            "start_latitude",
            "start_longitude",
            "end_location_name",
            "end_latitude",
            "end_longitude",
            "competition",
            "vehicle_id",
            "passengers",
        ]
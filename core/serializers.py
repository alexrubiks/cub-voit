from .models import User, Vehicle, Competition, Travel
from rest_framework import serializers


class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "pseudo", "wca_id"]


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "pseudo",
            "wca_id",
            "email",
            "location_name",
            "location_latitude",
            "location_longitude",
        ]


class VehicleSerializer(serializers.ModelSerializer):
    owner = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Vehicle
        fields = ["id", "name", "owner", "seats"]


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = [
            "id",
            "external_id",
            "name",
            "first_day",
            "last_day",
            "country",
            "location_name",
            "latitude",
            "longitude",
        ]


class TravelSerializer(serializers.ModelSerializer):
    owner = PublicUserSerializer(read_only=True)
    passengers = PublicUserSerializer(many=True, read_only=True)

    class Meta:
        model = Travel
        fields = [
            "id",
            "name",
            "owner",
            "date",
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
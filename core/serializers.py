from .models import User, Vehicle, Competition, Travel
from rest_framework import serializers


class PublicUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(use_url=True)

    class Meta:
        model = User
        fields = ["id", "pseudo", "wca_id", "avatar"]


class CurrentUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(use_url=True)
    wca_id = serializers.CharField(read_only=True)
    location_name = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "pseudo",
            "wca_id",
            "email",
            "location_name",
            "location_latitude",
            "location_longitude",
            "avatar",
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
    passengers_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="passengers",
        write_only=True,
        many=True,
        required=False,
    )
    vehicle = VehicleSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(),
        source="vehicle",
        write_only=True
    )
    competition = CompetitionSerializer(read_only=True)
    competition_id = serializers.PrimaryKeyRelatedField(
        queryset=Competition.objects.all(),
        source="competition",
        write_only=True
    )

    class Meta:
        model = Travel
        fields = [
            "id",
            "owner",
            "is_private",
            "date",
            "start_location_name",
            "start_latitude",
            "start_longitude",
            "end_location_name",
            "end_latitude",
            "end_longitude",
            "competition",
            "competition_id",
            "vehicle",
            "vehicle_id",
            "passengers",
            "passengers_ids",
        ]
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    wca_id = models.CharField(max_length=10, unique=True, blank=True, db_index=True)
    pseudo = models.CharField(max_length=25, db_index=True)

    location_name = models.CharField(max_length=100)
    location_latitude = models.FloatField()
    location_longitude = models.FloatField()

    allowed_users = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="allowed_by",
    )

    def __str__(self):
        return self.pseudo


class Vehicle(models.Model):
    name = models.CharField(max_length=25, db_index=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    seats = models.IntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return self.name


class Competition(models.Model):
    external_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, db_index=True)

    first_day = models.DateField()
    last_day = models.DateField()

    location_name = models.CharField(max_length=100)
    country = models.CharField(max_length=10)
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)

    def __str__(self):
        return self.name


class Travel(models.Model):
    name = models.CharField(max_length=50, db_index=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    date = models.DateField(null=False)
    start_location_name = models.CharField(max_length=100)
    start_latitude = models.FloatField(null=False)
    start_longitude = models.FloatField(null=False)

    end_location_name = models.CharField(max_length=100)
    end_latitude = models.FloatField(null=False)
    end_longitude = models.FloatField(null=False)

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    passengers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        symmetrical=False,
        related_name="is_passenger_of",
    )

    def __str__(self):
        return self.name

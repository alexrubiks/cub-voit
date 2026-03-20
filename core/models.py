from django.db import models
from django.core.validators import MinValueValidator


class User(models.Model):
    wca_id = models.CharField(max_length=10, unique=True, db_index=True)
    name = models.CharField(max_length=25, db_index=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    name = models.CharField(max_length=25, db_index=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    seats = models.IntegerField(validators=MinValueValidator(1))

    def __str__(self):
        return self.name


class Competition(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)

    first_day = models.DateField()
    last_day = models.DateField()

    location_name = models.CharField(max_length=100)
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)

    def __str__(self):
        return self.name


class Travel(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    start_location_name = models.CharField(max_length=100)
    start_latitude = models.FloatField(null=False)
    start_longitude = models.FloatField(null=False)

    end_location_name = models.CharField(max_length=100)
    end_latitude = models.FloatField(null=False)
    end_longitude = models.FloatField(null=False)

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

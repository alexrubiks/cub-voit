from django.db import models


class User(models.Model):
    wca_id = models.CharField(max_length=10)
    pseudo = models.CharField(max_length=25)


class Vehicle(models.Model):
    name = models.CharField(max_length=25)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    seats = models.IntegerField()


class Competition(models.Model):
    name = models.CharField(max_length=100)

    first_day = models.DateField()
    last_day = models.DateField()

    location_name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()


class Travel(models.Model):
    name = models.CharField(max_length=50)

    start_location_name = models.CharField(max_length=100)
    start_latitude = models.FloatField()
    start_longitude = models.FloatField()

    end_location_name = models.CharField(max_length=100)
    end_latitude = models.FloatField()
    end_longitude = models.FloatField()

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

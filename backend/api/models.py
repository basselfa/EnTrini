from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('gym_owner', 'Gym Owner'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    fitness_goals = models.TextField(blank=True)
    profile_image = models.URLField(blank=True)

class Gym(models.Model):
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_gyms')
    description = models.TextField(blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    amenities = models.JSONField(default=list)  # List of amenities
    hours = models.CharField(max_length=200, blank=True)
    image_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('active', 'Active'), ('suspended', 'Suspended')], default='pending')
    capacity = models.IntegerField(null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_type = models.CharField(max_length=20, choices=[('classic', 'Classic'), ('professional', 'Professional')])
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('expired', 'Expired'), ('cancelled', 'Cancelled')], default='active')
    total_visits = models.IntegerField()
    remaining_visits = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField()
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
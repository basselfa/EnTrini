from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Gym, Membership

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'status', 'featured', 'created_at')
    list_filter = ('status', 'featured', 'city')
    search_fields = ('name', 'owner__username', 'city')

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_type', 'status', 'remaining_visits', 'expiry_date')
    list_filter = ('plan_type', 'status', 'expiry_date')
    search_fields = ('user__username', 'user__email')

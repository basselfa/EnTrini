from rest_framework import serializers
from .models import User, Gym, Membership

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'address', 'city', 'birth_date', 'emergency_contact', 'emergency_phone', 'fitness_goals', 'profile_image']
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

class GymSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    
    class Meta:
        model = Gym
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Membership
        fields = '__all__'
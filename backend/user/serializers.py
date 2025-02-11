from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from datetime import datetime
from backend.utils import print_error



# Handles data validation for user registration
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if username already exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        
        return attrs

    def create(self, validated_data):
        # Remove password2 from the data as it's only used for validation
        validated_data.pop('password2', None)
        
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        return user

# Filters sensitive data from GET requests
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'display_name'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'display_name': {'required': False},
        }
    
    # def update(self, instance, validated_data):
    #     # Handle updating user information, including re-hashing the password if provided
    #     for attr, value in validated_data.items():
    #         if attr == 'password':
    #             instance.set_password(value)
    #         else:
    #             setattr(instance, attr, value)
    #     instance.save()
    #     return instance
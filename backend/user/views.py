import os
from datetime import timezone

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserRegisterSerializer, UserSerializer
from django.http import JsonResponse, HttpResponse, FileResponse
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.core.files.base import ContentFile
from io import BytesIO


# User registration API
# Should ONLY be called in registration page..!!
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Log the user in after registration
            return Response(
                {'message': 'User registered successfully!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User login API
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Serialize user profile data to load user context
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)


# User logout API
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.session.clear()
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    

# User delete API
class DeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        # Ensure user is fully saved
        user = request.user

        # Explicitly save user to ensure it has a primary key
        if not user.pk:
            user.save()

        user.saved_wraps.all().delete()
        user.delete()

        return Response({'message': f"User {user} deleted successfully"})
    

# Gets user profile information 
class ProfileView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

# Checks if user is authenticated
class AuthCheckView(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        try:
            if request.user.is_authenticated:
                return Response({'authenticated': True})
        except:
            pass
        return Response({'authenticated': False})

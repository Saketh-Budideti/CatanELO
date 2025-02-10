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
from .models import User, SavedWrap
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
        # Load data from session
        data = {
            **request.data,
            'access_token': request.session.get('access_token'),
            'refresh_token': request.session.get('refresh_token'),
            'last_refresh': request.session.get('last_refresh'),
            'spotify_id': request.session.get('spotify_id'),
            'spotify_profile_url': request.session.get('spotify_profile_url'),
            'profile_img': request.session.get('profile_img'),
            'display_name': request.session.get('display_name')
        }
        # Validate data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Customize headers
        headers = self.get_success_headers(serializer.data)

        return Response(
            {'message': 'User registered successfully!'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_wrap(request):
    """
    Saves a user's wrapper data as a stylish PDF with enhanced visual design.
    """
    # Register custom fonts (ensure you have these font files)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    pdfmetrics.registerFont(TTFont('Montserrat-Bold', os.path.join(BASE_DIR, 'fonts', 'Montserrat-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('Roboto-Regular', os.path.join(BASE_DIR, 'fonts', 'Roboto-Regular.ttf')))

    wrapper_data = request.data.get('wrapper_data')
    if not wrapper_data:
        return Response({'error': 'wrapper_data is required'}, status=status.HTTP_400_BAD_REQUEST)

    spotify_id = request.data.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(spotify_id=spotify_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Prepare PDF buffer
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)

    # Styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Title'],
        fontName='Montserrat-Bold',
        fontSize=20,
        textColor=colors.HexColor('#1DB954'),  # Spotify green
        spaceAfter=12
    )

    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontName='Montserrat-Bold',
        fontSize=14,
        textColor=colors.black,
        spaceAfter=6
    )

    item_style = ParagraphStyle(
        'ItemStyle',
        parent=styles['Normal'],
        fontName='Roboto-Regular',
        fontSize=10,
        textColor=colors.black
    )

    # Content for PDF
    content = []

    # Title
    content.append(Paragraph(f"{user.display_name}'s Spotify Wrap", title_style))
    content.append(Spacer(1, 12))

    # Genres Section
    content.append(Paragraph("Top Genres", section_style))
    genres_data = [[Paragraph(f"{idx}. {genre}", item_style)] for idx, genre in
                   enumerate(wrapper_data.get('genres', []), 1)]
    genres_table = Table(genres_data, colWidths=[450])
    genres_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    content.append(genres_table)
    content.append(Spacer(1, 12))

    # Artists Section
    content.append(Paragraph("Top Artists", section_style))
    artists_data = [[Paragraph(f"{idx}. {artist}", item_style)] for idx, artist in
                    enumerate(wrapper_data.get('artists', []), 1)]
    artists_table = Table(artists_data, colWidths=[450])
    artists_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.lavender),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    content.append(artists_table)
    content.append(Spacer(1, 12))

    # Songs Section
    content.append(Paragraph("Top Songs", section_style))
    songs_data = [[Paragraph(f"{idx}. {song['title']} - {song['artist']}", item_style)]
                  for idx, song in enumerate(wrapper_data.get('songs', []), 1)]
    songs_table = Table(songs_data, colWidths=[450])
    songs_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.lightblue),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    content.append(songs_table)

    # Build PDF
    doc.build(content)

    # Save the PDF
    pdf_buffer.seek(0)
    SavedWrap.objects.create(
        user=user,
        pdf_file=ContentFile(pdf_buffer.read(), name=f'{user.display_name}_spotify_wrap.pdf')
    )

    return Response(status=status.HTTP_201_CREATED)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_wraps(request):
    """
    Retrieves all saved wraps for a given user and returns PDF URLs
    """
    spotify_id = request.query_params.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(spotify_id=spotify_id)
        saved_wraps = SavedWrap.objects.filter(user=user).order_by('-created_at')

        # Transform queryset to include full PDF URL
        wrap_data = [{
            'id': wrap.id,
            'created_at': wrap.created_at,
            'pdf_file_url': request.build_absolute_uri(wrap.pdf_file.url)
        } for wrap in saved_wraps]

        return Response(wrap_data)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_wrap(request):
    """
    Deletes a specific saved wrap for a given user
    """

    spotify_id = request.query_params.get('spotify_id')
    wrap_id = request.query_params.get('wrap_id')


    # Validate required parameters
    if not spotify_id or not wrap_id:
        return Response({
            'error': 'spotify_id and wrap_id are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the user
        user = User.objects.get(spotify_id=spotify_id)
        print("current user: ", user)
        # Find and delete the specific wrap
        wrap = SavedWrap.objects.get(id=wrap_id, user=user)

        if user.pk:
            saved_wraps = user.saved_wraps.all()
            print(f"User {user.username} has {saved_wraps.count()} saved wraps.")
        else:
            print("User object does not have a primary key.")

        # Optional: Delete the associated PDF file from storage if needed
        if wrap.pdf_file:
            wrap.pdf_file.delete()

        # Delete the wrap from the database
        wrap.delete()

        return Response({
            'message': 'Wrap successfully deleted'
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

    except SavedWrap.DoesNotExist:
        return Response({
            'error': 'Wrap not found or does not belong to this user'
        }, status=status.HTTP_404_NOT_FOUND)
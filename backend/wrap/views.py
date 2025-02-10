from openai import OpenAIError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework import status
import requests
from user.models import User
from collections import Counter
from django.utils.timezone import now, timedelta
from dotenv import load_dotenv
import os
from openai import OpenAI


dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

SPOTIFY_API_URL = "https://api.spotify.com/v1"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_SCOPES = "user-top-read"

client = OpenAI()
OpenAI.api_key = os.getenv("OPENAI_API_KEY")


def fetch_spotify_data(endpoint, access_token, params=None, time_range="medium_term"):
    try:
        response = requests.get(
            f"{SPOTIFY_API_URL}/{endpoint}?time_range={time_range}",
            headers={"Authorization": f"Bearer {access_token}"},
            params=params,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return None


def get_valid_token(user):
    """
    Ensure the access token is valid and refresh it if expired.
    """
    access_token = user.access_token
    refresh_token = user.refresh_token
    last_refresh = user.last_refresh

    if not access_token or not refresh_token or not last_refresh:
        return None

    if now() >= last_refresh + timedelta(seconds=3600):
        try:
            response = requests.post(
                SPOTIFY_TOKEN_URL,
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    "client_id": settings.SPOTIFY_CLIENT_ID,
                    "client_secret": settings.SPOTIFY_SECRET,
                },
            )
            response.raise_for_status()
            token_info = response.json()
            access_token = token_info.get("access_token")
            user.access_token = access_token
            user.save()

            user.last_refresh = now()
        except Exception as e:
            return None

    return access_token

@api_view(['GET'])
@permission_classes([AllowAny])
def top_artists(request):
    # Retrieve the spotify_id from the request query parameters
    spotify_id = request.query_params.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch the user based on the spotify_id
    try:
        user = User.objects.get(spotify_id=spotify_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use the user's access token
    access_token = get_valid_token(user)
    if not access_token:
        return Response({'error': 'User does not have a valid access token'}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch Spotify data for top artists
    data = fetch_spotify_data("me/top/artists", access_token, params={"limit": 5})
    if not data:
        return Response({'error': 'Failed to retrieve top artists'}, status=status.HTTP_400_BAD_REQUEST)

    artists = [artist.get("name") for artist in data.get("items", [])]
    return Response(artists, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_genres(request):
    # Retrieve the spotify_id from the request query parameters
    spotify_id = request.query_params.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    time_range = request.query_params.get('time_range')
    if not time_range:
        time_range = "medium_term"

    # Fetch the user based on the spotify_id
    try:
        user = User.objects.get(spotify_id=spotify_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use the user's access token
    access_token = get_valid_token(user)
    if not access_token:
        return Response({'error': 'User does not have a valid access token'}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch Spotify data for top artists to extract genres
    data = fetch_spotify_data("me/top/artists", access_token, params={"limit": 50}, time_range=time_range)
    if not data:
        return Response({'error': 'Failed to retrieve top artists for genres'}, status=status.HTTP_400_BAD_REQUEST)

    genres = []
    for artist in data.get("items", []):
        genres.extend(artist.get("genres", []))

    genre_counts = Counter(genres)
    top_genres = [genre.capitalize() for genre, count in genre_counts.most_common(5)]
    return Response(top_genres, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def top_songs(request):
    spotify_id = request.query_params.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    time_range = request.query_params.get('time_range')
    if not time_range:
        time_range = "medium_term"

    try:
        user = User.objects.get(spotify_id=spotify_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    access_token = get_valid_token(user)
    if not access_token:
        return Response({'error': 'User does not have a valid access token'}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch Spotify data
    data = fetch_spotify_data("me/top/tracks", access_token, params={"limit": 5}, time_range=time_range)
    if not data:
        return Response({'error': 'Failed to retrieve top tracks'}, status=status.HTTP_400_BAD_REQUEST)


    # Prepare and return the response
    songs = [
        {"title": track.get("name"), "artist": ", ".join(artist["name"] for artist in track.get("artists", []))}
        for track in data.get("items", [])
    ]
    return Response(songs, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_summary(request):
    cur_language = request.query_params.get('cur_language')
    if not cur_language:
        cur_language = "en"

    spotify_id = request.query_params.get('spotify_id')
    if not spotify_id:
        return Response({'error': 'spotify_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    time_range = request.query_params.get('time_range')
    if not time_range:
        time_range = "medium_term"

    try:
        user = User.objects.get(spotify_id=spotify_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    access_token = get_valid_token(user)
    songs_data = fetch_spotify_data("me/top/tracks", access_token, params={"limit": 5})
    if not songs_data:
        return Response({'error': 'Failed to retrieve top tracks'}, status=status.HTTP_400_BAD_REQUEST)

    # Prepare the songs data
    songs = [
        {"title": track.get("name"), "artist": ", ".join(artist["name"] for artist in track.get("artists", []))}
        for track in songs_data.get("items", [])
    ]

    artists_data = fetch_spotify_data("me/top/artists", access_token, params={"limit": 5})
    if not artists_data:
        return Response({'error': 'Failed to retrieve top artists'}, status=status.HTTP_400_BAD_REQUEST)

    artists = [artist.get("name") for artist in artists_data.get("items", [])]

    genres_data = fetch_spotify_data("me/top/artists", access_token, params={"limit": 50})
    if not genres_data:
        return Response({'error': 'Failed to retrieve top artists for genres'}, status=status.HTTP_400_BAD_REQUEST)

    # Prepare genres data
    genres = []
    for artist in genres_data.get("items", []):
        genres.extend(artist.get("genres", []))

    genre_counts = Counter(genres)
    genres = [genre.capitalize() for genre, count in genre_counts.most_common(5)]

    # Generate the prompt for GPT-4-turbo-mini
    summary_prompt = (
        f"Based on a person's Spotify Wrapped, they listen to songs like {', '.join([song['title'] for song in songs])}, "
        f"from artists such as {', '.join(artists)}. They enjoy genres like {', '.join(genres)}. "
        "Write a paragraph summarizing how a person with this taste tends to act, think, and dress."
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system",
                 "content": f"Only output a summary based on the input data in the language {cur_language}. Do not include any additional information."},
                {"role": "user", "content": f"{summary_prompt}"}
            ]
        )

        # Extract and return the generated summary
        summary = completion.choices[0].message.content
        return Response(summary, status=status.HTTP_200_OK)
    except OpenAIError as e:
        return Response({'error': f'OpenAI API error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
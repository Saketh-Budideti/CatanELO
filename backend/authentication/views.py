from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import secrets
from django.conf import settings
from backend.utils import print_error
from rest_framework import status
from django.shortcuts import redirect
from django.utils import timezone
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
import base64
import requests
from user.models import User

# Generates Spotify auth link
@api_view(['GET'])
@permission_classes([AllowAny])
def auth_url(request):
    print("Request Data: ", request.query_params)

    # Generate a random string for OAuth state
    oauth_state = secrets.token_urlsafe(32)

    # Create response object
    response = Response({'message': 'Redirecting to Spotify login...'})

    # Store state securely in a cookie
    response.set_cookie(
        'spotify_auth_state',
        oauth_state,
        httponly=True,
        secure=True,
        samesite='None',  # Required for cross-site cookies
        max_age=300  # 5 minutes
    )

    # Create the authorization URL with the required scopes
    params = {
        'response_type': 'code',
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'scope': 'user-read-email user-top-read',  # Include user-top-read scope
        'redirect_uri': settings.SPOTIFY_REDIRECT_URI,
        'state': oauth_state
    }

    # Build the authorization URL
    auth_url = f'https://accounts.spotify.com/authorize?{urlencode(params)}'

    # Include the authorization URL in the response
    response.data = {'auth_url': auth_url}

    return response

# Handles Spotify authorization callback
@api_view(['GET'])
@permission_classes([AllowAny])
def auth_callback(request):
    error = request.query_params.get('error')
    code = request.query_params.get('code')
    state = request.query_params.get('state')

    if not state or (not error and not code):
        print_error(f'Error occurred in auth callback: Missing request fields!')
        return Response({'error': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)

    # If error exists, handle it
    if error:
        print_error(f'Error occurred in auth callback: {error}')
        return Response({'error': 'Error in auth callback'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if state matches state in cookies
    oauth_state = request.COOKIES.get('spotify_auth_state')

    if not (oauth_state and oauth_state == state):
        print_error(f'Error occurred in auth callback: OAuth states do not match!')
        return Response({'error': 'OAuth state invalid'}, status=status.HTTP_400_BAD_REQUEST)

    # Get access tokens using auth code (see https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.SPOTIFY_REDIRECT_URI
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode(
            f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_SECRET}".encode()).decode()
    }

    response = requests.post('https://accounts.spotify.com/api/token', data=payload, headers=headers)

    # Check if access token request failed
    if response.status_code != status.HTTP_200_OK:
        print_error(f'Error occurred in auth callback: token exchange failed:\n{response.text}')
        return Response({'error': 'Token exchange failed'}, status=status.HTTP_400_BAD_REQUEST)

    response = response.json()
    access_token = response.get('access_token')  # Store in session data for use in account creation
    refresh_token = response.get('refresh_token')  # Store in session data for use in account creation
    last_refresh = timezone.now()  # Store in session data for use in account creation

    # Retrieve user id for login/registration

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get('https://api.spotify.com/v1/me', headers=headers)

    if response.status_code != status.HTTP_200_OK:
        print_error(f'Error occurred in auth callback: failed to get user profile:\n{response.text}')
        return Response({'error': 'Failed to retrieve user'}, status=status.HTTP_400_BAD_REQUEST)

    response = response.json()
    spotify_id = response.get('id')  # Store in session data for use in account creation
    display_name = response.get('display_name')  # Store in URL Params (safe info)
    external_urls = response.get('external_urls')
    spotify_profile_url = external_urls['spotify']  # Store in URL Params (safe info)
    images = response.get('images')
    profile_img = images[0] if len(images) > 0 else None  # Store in URL Params (safe info)
    profile_img = profile_img['url'] if profile_img else None
    email = response.get('email')  # Store in URL Params (safe info)

    # If user exists, redirect to login page with user details
    try:
        user = User.objects.get(spotify_id=spotify_id)
        if user:
            username = user.username  # Store in URL Params (safe info)
            params = {
                'username': username,
                'display_name': display_name,
                'spotify_profile_url': spotify_profile_url,
                'profile_img': profile_img
            }
            return HttpResponseRedirect(f"{settings.FRONT_END_ORIGIN}/profile")
    # Else, direct users to the registration page (INCLUDE PRIVACY POLICY!)
    except User.DoesNotExist:
        pass

    # Store session data
    request.session.update({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'last_refresh': last_refresh.isoformat(),
        'spotify_id': spotify_id,
        'display_name': display_name,
        'spotify_profile_url': spotify_profile_url,
        'profile_img': profile_img
    })
    params = dict()
    # Create URL params and redirect to account creation
    params['display_name'] = display_name
    params['spotify_profile_url'] = spotify_profile_url
    params['email'] = email
    if profile_img:
        params['profile_img'] = profile_img

    return HttpResponseRedirect(f"{settings.FRONT_END_ORIGIN}/account?{urlencode(params)}")

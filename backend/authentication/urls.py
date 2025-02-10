from django.urls import path
from .views import auth_url, auth_callback

urlpatterns = [
    path('url/', auth_url, name='auth_url'),
    path('callback/', auth_callback, name='auth_callback'),
]
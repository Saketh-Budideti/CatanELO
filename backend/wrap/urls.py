from django.conf import settings
from django.urls import path, re_path
from django.views.static import serve
from .views import top_songs, top_artists, top_genres, get_summary


urlpatterns = [
    path("top-songs/", top_songs, name='top-songs'),
    path("top-artists/", top_artists, name='top-artists'),
    path("top-genres/", top_genres, name='top-genres'),
    path("summary/", get_summary, name='summary'),

]
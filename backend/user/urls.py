from django.conf import settings
from django.urls import path, re_path
from django.views.static import serve

from .views import RegisterView, LoginView, LogoutView, DeleteView, ProfileView, AuthCheckView, save_wrap, \
    get_saved_wraps, delete_wrap

urlpatterns = [
    path("register/", RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('delete-account/', DeleteView.as_view(), name='delete-account'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('is-auth/', AuthCheckView.as_view(), name='is-auth'),
    path('save-wrap/', save_wrap, name='save_wrap'),
    path('get-saved-wraps/', get_saved_wraps, name='get_saved_wraps'),
    path('delete-wrap/', delete_wrap, name='delete_wrap'),

]

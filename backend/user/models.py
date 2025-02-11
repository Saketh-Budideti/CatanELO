from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    # Required fields
    # username - automatically created
    # password - automatically created
    # email - automatically created

    # Auto generated fields
    # last_login: automatically handled by django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # New fields
    display_name = models.CharField(max_length=150, null=True, blank=True)
    spotify_id = None
    spotify_profile_url = None
    profile_img = None
    access_token = None
    refresh_token = None
    last_refresh = None

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f'{self.username} ({self.email})'

    def save(self, *args, **kwargs):
        # Set display_name to username if not provided
        if not self.display_name:
            self.display_name = self.username
        super().save(*args, **kwargs)
from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import User
from datetime import timedelta
from django.db.models import Q


# Deletes users inactive for more than a year and a half
class Command(BaseCommand):
    help = 'Deletes user accounts inactive for over a year and a half.'

    def handle(self, *args, **options):
        deadline = timezone.now() - timedelta(days=548)

        # Find users who haven't logged in for over a year or never logged in and joined over a year ago
        inactive_users = User.objects.filter(
            Q(last_login__lt=deadline) |
            Q(last_login__isnull=True, date_joined__lt=deadline)
        )
        
        count = inactive_users.count()
        inactive_users.delete()

        self.stdout.write(f'Successfully deleted {count} inactive user(s).')

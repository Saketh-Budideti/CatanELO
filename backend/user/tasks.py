from django.core.management import call_command
from celery import shared_task

@shared_task
def run_delete_inactive_users():
    call_command('delete_inactive_users')

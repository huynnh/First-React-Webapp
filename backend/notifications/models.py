from django.db import models
from django.contrib.auth import get_user_model
from tasks.models import Task
from events.models import Event
from django.db.models.signals import pre_delete
from django.dispatch import receiver

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('task', 'Task'),
        ('event', 'Event'),
    )

    PRIORITY_LEVELS = (
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    )

    STATUS_CHOICES = (
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('dismissed', 'Dismissed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='task')
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200, default='Notification')
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unread')
    created_at = models.DateTimeField(auto_now_add=True)
    remaining_time = models.DurationField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.title}"

    def mark_as_read(self):
        self.status = 'read'
        self.save()

    def dismiss(self):
        self.status = 'dismissed'
        self.is_active = False
        self.save()

@receiver(pre_delete, sender=Task)
def handle_task_deletion(sender, instance, **kwargs):
    # Delete all notifications related to this task
    Notification.objects.filter(task=instance).delete()

@receiver(pre_delete, sender=Event)
def handle_event_deletion(sender, instance, **kwargs):
    # Delete all notifications related to this event
    Notification.objects.filter(event=instance).delete()
    

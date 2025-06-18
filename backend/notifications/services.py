from datetime import timedelta
from django.utils import timezone
from .models import Notification

def create_notifications_for_task(task):
    """Create notifications for a task based on its priority"""
    now = timezone.now()
    
    # Delete any existing notifications for this task
    Notification.objects.filter(task=task).delete()
    
    if task.priority == 'high':
        # 2 days before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"High Priority Task: {task.task_name}",
            message=f"Your high priority task '{task.task_name}' is due in 2 days",
            priority='high',
            scheduled_for=task.end_time - timedelta(days=2)
        )
        # 1 day before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"High Priority Task: {task.task_name}",
            message=f"Your high priority task '{task.task_name}' is due tomorrow",
            priority='high',
            scheduled_for=task.end_time - timedelta(days=1)
        )
        # 3 hours before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"High Priority Task: {task.task_name}",
            message=f"Your high priority task '{task.task_name}' is due in 3 hours",
            priority='high',
            scheduled_for=task.end_time - timedelta(hours=3)
        )
    
    elif task.priority == 'medium':
        # 1 day before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"Medium Priority Task: {task.task_name}",
            message=f"Your medium priority task '{task.task_name}' is due tomorrow",
            priority='medium',
            scheduled_for=task.end_time - timedelta(days=1)
        )
        # 3 hours before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"Medium Priority Task: {task.task_name}",
            message=f"Your medium priority task '{task.task_name}' is due in 3 hours",
            priority='medium',
            scheduled_for=task.end_time - timedelta(hours=3)
        )
    
    else:  # low priority
        # 3 hours before
        Notification.objects.create(
            user=task.user,
            notification_type='task',
            task=task,
            title=f"Task: {task.task_name}",
            message=f"Your task '{task.task_name}' is due in 3 hours",
            priority='low',
            scheduled_for=task.end_time - timedelta(hours=3)
        )

def create_notifications_for_event(event):
    """Create notifications for an event based on its priority"""
    now = timezone.now()
    
    # Delete any existing notifications for this event
    Notification.objects.filter(event=event).delete()
    
    if event.priority == 'high':
        # 2 days before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"High Priority Event: {event.title}",
            message=f"Your high priority event '{event.title}' is in 2 days",
            priority='high',
            scheduled_for=event.start_time - timedelta(days=2)
        )
        # 1 day before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"High Priority Event: {event.title}",
            message=f"Your high priority event '{event.title}' is tomorrow",
            priority='high',
            scheduled_for=event.start_time - timedelta(days=1)
        )
        # 3 hours before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"High Priority Event: {event.title}",
            message=f"Your high priority event '{event.title}' is in 3 hours",
            priority='high',
            scheduled_for=event.start_time - timedelta(hours=3)
        )
    
    elif event.priority == 'medium':
        # 1 day before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"Medium Priority Event: {event.title}",
            message=f"Your medium priority event '{event.title}' is tomorrow",
            priority='medium',
            scheduled_for=event.start_time - timedelta(days=1)
        )
        # 3 hours before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"Medium Priority Event: {event.title}",
            message=f"Your medium priority event '{event.title}' is in 3 hours",
            priority='medium',
            scheduled_for=event.start_time - timedelta(hours=3)
        )
    
    else:  # low priority
        # 3 hours before
        Notification.objects.create(
            user=event.user,
            notification_type='event',
            event=event,
            title=f"Event: {event.title}",
            message=f"Your event '{event.title}' is in 3 hours",
            priority='low',
            scheduled_for=event.start_time - timedelta(hours=3)
        ) 
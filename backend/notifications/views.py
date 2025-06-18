from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Notification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .serializers import NotificationSerializer
from tasks.models import Task
from events.models import Event
import logging

logger = logging.getLogger(__name__)

# API views

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_task_notifications(request, task_id):
    """Create notifications for a task"""
    try:
        task = get_object_or_404(Task, id=task_id)
        remaining_time = task.end_time - timezone.now()
        print(remaining_time)
        
        # Create notification regardless of remaining time
        notification = Notification.objects.create(
            user_id=request.user.id,
            notification_type='task',
            task=task,
            title=f"Notification for task: {task.task_name}",
            message=f"Your task '{task.task_name}' is due in {remaining_time.days} days" if remaining_time.days > 0 else f"Your task '{task.task_name}' is due today",
            priority=task.priority,
            remaining_time=remaining_time,
            status='unread',
            is_active=True
        )
        return Response({'status': 'success', 'notification_id': notification.id})
    except Exception as e:
        logger.error(f"Error creating notification for task {task_id}: {str(e)}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_event_notifications(request, event):
    """Create notifications for a task"""
    event = get_object_or_404(Event, id=event.id)
    remaining_time = event.end_time - timezone.now()
    if remaining_time.days <=0 :
        return Response({'error': 'Task is due today or in the past'}, status=400)
    Notification.objects.create(
        user_id=request.user.id,
        notification_type='event',
        event = event,
        title=f"Notification for event: {event.title}",
        message=f"Your event '{event.title}' is due in {remaining_time.days} days",
        remaining_time=remaining_time,
        priority = 'medium',
        status='unread',
        is_active=True
    )
    return Response({'status': 'success'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(
        user=request.user,
        is_active=True,
        status='unread',
    )

    notification_lists = []
    for notification in notifications:
        title = getattr(notification.event, 'title', None) or getattr(notification.task, 'task_name', None)
        
        # Calculate actual remaining time based on the task/event end time
        if notification.task:
            remaining_time = notification.task.end_time - timezone.now()
        elif notification.event:
            remaining_time = notification.event.end_time - timezone.now()
        else:
            continue  # Skip if neither task nor event exists
            
        hours = remaining_time.total_seconds() / 3600
        
        if notification.priority == 'high':
            if remaining_time.days <= 2 and remaining_time.days > 1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event/task '{title}' is due in 2 days", 
                                           'priority': notification.priority})
            elif remaining_time.days <= 1 and hours > 5:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event/task '{title}' is due tomorrow", 
                                           'priority': notification.priority})
            elif hours <= 5 and hours > 1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {hours} hours", 
                                           'priority': notification.priority})
            elif hours <=1:
                notification_lists.append({'notification_id': notification.id, 
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {int(hours*60)} minutes", 
                                           'priority': notification.priority})        
        elif notification.priority == 'medium':
            if remaining_time.days <= 1 and hours > 5:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 
                                           'title': title, 'message': f"Your event/task '{title}' is due tomorrow", 
                                           'priority': notification.priority})
            elif hours <= 5 and hours > 1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {hours} hours", 
                                           'priority': notification.priority})
            elif hours <=1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {int(hours*60)} minutes", 
                                           'priority': notification.priority})
        elif notification.priority == 'low':
            if hours <= 5 and hours>1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {hours} hours", 
                                           'priority': notification.priority})
            elif hours <=1:
                notification_lists.append({'notification_id': notification.id,
                                           'status': 'success', 'title': title, 
                                           'message': f"Your event '{title}' is due in {int(hours*60)} minutes", 
                                           'priority': notification.priority})
    return Response(notification_lists)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.status = 'read'
        notification.save()
        return Response({'status': 'success'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dismiss_notification(request, pk):
    """Dismiss a notification"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.dismiss()  # This will set status to 'dismissed' and is_active to False
        return Response({'status': 'success'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    try:
        Notification.objects.filter(
            user=request.user,
            status='unread'
        ).update(status='read')
        return Response({'status': 'success'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Task
from .serializers import TaskSerializer
import logging

logger = logging.getLogger(__name__)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'completed'
        task.save()
        return Response({'status': 'task completed'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        task = self.get_object()
        task.status = 'cancelled'
        task.save()
        return Response({'status': 'task cancelled'})

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        tasks = self.get_queryset().filter(
            start_time__gte=timezone.now(),
            status='pending'
        ).order_by('start_time')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def completed(self, request):
        tasks = self.get_queryset().filter(status='completed')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def cancelled(self, request):
        tasks = self.get_queryset().filter(status='cancelled')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    def check_conflicts(self, task):
        """Check if a task conflicts with existing tasks"""
        overlapping_tasks = Task.objects.filter(
            user=task.user,
            start_time__lt=task.end_time,
            end_time__gt=task.start_time,
            status__in=['pending', 'in_progress']
        ).exclude(id=task.id)

        if overlapping_tasks.exists():
            task.is_conflict = True
            task.save()
            return True
        return False

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Creating task with data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            task = serializer.save(user=request.user)
            self.check_conflicts(task)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.error(f"Error creating task: {str(e)}")
            return Response(
                {'error': str(e), 'details': serializer.errors if 'serializer' in locals() else None},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            task = serializer.save()
            self.check_conflicts(task)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error updating task: {str(e)}")
            return Response(
                {'error': str(e), 'details': serializer.errors if 'serializer' in locals() else None},
                status=status.HTTP_400_BAD_REQUEST
            ) 
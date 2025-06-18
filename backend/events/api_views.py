from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def check_conflicts(self, event):
        overlapping_events = Event.objects.filter(
            user=event.user,
            start_time__lt=event.end_time,
            end_time__gt=event.start_time,
        ).exclude(id=event.id)
        if overlapping_events.exists():
            event.is_conflict = True
            event.save()
            return True
        return False

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(user=request.user)
        self.check_conflicts(event)
        headers = self.get_success_headers(serializer.data)
        return Response(self.get_serializer(event).data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        self.check_conflicts(event)
        return Response(self.get_serializer(event).data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        events = self.get_queryset().filter(
            start_time__gte=timezone.now()
        ).order_by('start_time')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def conflicted(self, request):
        events = self.get_queryset().filter(is_conflict=True)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data) 
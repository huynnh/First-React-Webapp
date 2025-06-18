from rest_framework import serializers
from .models import Task
from django.utils import timezone

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'description', 'priority', 'start_time', 'end_time', 'status', 'is_conflict']
        read_only_fields = ['id', 'is_conflict']

    def validate_task_name(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Task name cannot be empty")
        return value.strip()

    def validate_priority(self, value):
        valid_priorities = ['high', 'medium', 'low']
        if value not in valid_priorities:
            raise serializers.ValidationError(f"Priority must be one of: {', '.join(valid_priorities)}")
        return value

    def validate_status(self, value):
        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        return value

    def validate_start_time(self, value):
        # Remove strict check; handled in validate()
        return value

    def validate(self, data):
        """
        Check that start_time is before end_time and other validations.
        If status is 'completed', allow any start/end time.
        If status is not 'completed', end_time must not be in the past.
        """
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        status = data.get('status')
        now = timezone.now()

        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError("End time must be after start time")

        if status != 'completed' and end_time:
            if end_time < now:
                raise serializers.ValidationError("End time cannot be in the past unless status is completed")

        return data 
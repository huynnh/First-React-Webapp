from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'priority',
            'status',
            'created_at',
            'remaining_time',
            'is_active'
        ]
        read_only_fields = fields 
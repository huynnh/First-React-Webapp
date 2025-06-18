from rest_framework import serializers
from .models import Event
from django.utils.dateparse import parse_datetime

class EventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False, allow_blank=True)
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()
    external_id = serializers.CharField(required=False, allow_blank=True)
    external_provider = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'start',
            'end',
            'external_id',
            'external_provider',
            'location',
        ]

    def get_title(self, obj):
        return obj.title or ''

    def get_start(self, obj):
        return {
            'dateTime': obj.start_time.isoformat() if obj.start_time else None,
            'timeZone': 'UTC',
        }

    def get_end(self, obj):
        return {
            'dateTime': obj.end_time.isoformat() if obj.end_time else None,
            'timeZone': 'UTC',
        }

    def to_internal_value(self, data):
        # Accept both 'title' and 'summary' for compatibility, but only output 'title'
        if 'summary' in data and 'title' not in data:
            data['title'] = data['summary']
        internal = super().to_internal_value(data)
        start = data.get('start', {})
        end = data.get('end', {})
        if 'dateTime' in start:
            internal['start_time'] = parse_datetime(start['dateTime'])
        if 'dateTime' in end:
            internal['end_time'] = parse_datetime(end['dateTime'])
        if 'location' in data:
            internal['location'] = data['location']
        if 'external_id' in data:
            internal['external_id'] = data['external_id']
        if 'external_provider' in data:
            internal['external_provider'] = data['external_provider']
        return internal

    def create(self, validated_data):
        validated_data.pop('summary', None)
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('summary', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance 
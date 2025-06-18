from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_conflict = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    external_id = models.CharField(max_length=255, blank=True, null=True)
    external_provider = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'events'

    def __str__(self):
        return f"Event for {self.title} from {self.start_time} to {self.end_time}"
    
class EventSyncMetadata(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_sync_metadata')
    provider = models.CharField(max_length=50)  
    external_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('event', 'provider')
    
    def get_external_id(event, provider):
        meta = event.event_sync_metadata.filter(provider=provider).first()
        return meta.external_id if meta else None
    
    def set_external_id(event, provider, external_id):
        meta, created = EventSyncMetadata.objects.update_or_create(
            event=event,
            provider=provider,
            defaults={'external_id': external_id}
        )
        return meta




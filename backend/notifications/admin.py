from django.contrib import admin
from .models import Notification

# Register your models here.
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'message')


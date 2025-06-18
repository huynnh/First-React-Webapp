from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
# from .views import NotificationViewSet

app_name = 'notifications'

urlpatterns = [
    path('', views.notification_list, name='notification_list'),
    path('create/task/<int:task_id>/', views.create_task_notifications, name='create_task_notifications'),
    path('create/event/<int:event_id>/', views.create_event_notifications, name='create_event_notifications'),
    path('<int:pk>/mark-read/', views.mark_notification_read, name='mark_notification_read'),
    path('mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('<int:pk>/dismiss/', views.dismiss_notification, name='dismiss_notification'),
] 
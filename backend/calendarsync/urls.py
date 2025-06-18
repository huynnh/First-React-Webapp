from django.urls import path
from . import views

app_name = 'calendarsync'

urlpatterns = [
    path('', views.calendar_sync_list, name='sync_list'),
    path('create/', views.calendar_sync_create, name='sync_create'),
    path('<int:pk>/update/', views.calendar_sync_update, name='sync_update'),
    path('<int:pk>/delete/', views.calendar_sync_delete, name='sync_delete'),
    path('<int:pk>/sync/', views.sync_now, name='sync_now'),
    path('status/', views.check_sync_status, name='check_sync_status'),
    path('status/update/', views.update_sync_status, name='update_sync_status'),
    # API endpoints for Google Calendar
    path('google/connection/', views.check_google_connection, name='check_google_connection'),
    path('google/start/', views.google_start, name='google_start'),
    path('google/callback/', views.google_callback, name='google_callback'),
    path('google/sync/', views.google_sync, name='google_sync'),
    path('google/disconnect/', views.google_disconnect, name='google_disconnect'),
    # Task synchronization endpoints
    path('tasks/push/', views.push_tasks, name='push_tasks'),
    path('tasks/pull/', views.pull_tasks, name='pull_tasks'),
    # Event synchronization endpoints
    path('events/push/', views.push_events, name='push_events'),
    path('events/pull/', views.pull_events, name='pull_events'),
    # Outlook Calendar endpoints
    path('outlook/check/', views.check_outlook_connection, name='check_outlook_connection'),
    path('outlook/start/', views.outlook_start, name='outlook_start'),
    path('outlook/callback/', views.outlook_callback, name='outlook_callback'),
    path('outlook/sync/', views.outlook_sync, name='outlook_sync'),
    path('outlook/pull-events/', views.pull_outlook_events, name='pull_outlook_events'),
    path('outlook/pull-tasks/', views.pull_outlook_tasks, name='pull_outlook_tasks'),
    path('outlook/disconnect/', views.outlook_disconnect, name='outlook_disconnect'),
    # New Outlook push endpoints
    path('outlook/push-events/', views.push_outlook_events, name='push_outlook_events'),
    path('outlook/push-tasks/', views.push_outlook_tasks, name='push_outlook_tasks'),
] 
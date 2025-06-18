from django.urls import path
from . import views

urlpatterns = [
    path('', views.notification_list, name='notification_list'),
    path('<int:pk>/mark-read/', views.mark_notification_read, name='mark_notification_read'),
    path('<int:pk>/dismiss/', views.dismiss_notification, name='dismiss_notification'),
    path('mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
] 
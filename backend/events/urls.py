from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import EventViewSet
from . import views

app_name = 'events'

router = DefaultRouter()
router.register('api', EventViewSet, basename='event')

urlpatterns = [
    path('', views.event_list, name='event_list'),
    path('create/', views.event_create, name='event_create'),
    path('<int:pk>/update/', views.event_update, name='event_update'),
    path('<int:pk>/delete/', views.event_delete, name='event_delete'),
    path('', include(router.urls)),
] 
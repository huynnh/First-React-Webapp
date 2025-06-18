from django.urls import path
from . import views

app_name = 'aiassistant'

urlpatterns = [
    path('list/', views.ai_assistant_list, name='interaction_list'),
    path('create/', views.ai_assistant_create, name='interaction_create'),
    path('<int:pk>/', views.ai_assistant_detail, name='interaction_detail'),
    path('<int:pk>/delete/', views.ai_assistant_delete, name='interaction_delete'),
] 
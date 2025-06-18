from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.api_login, name='api_login'),
    path('register/', views.api_register, name='api_register'),
    path('reset-password/', views.api_reset_password, name='api_reset_password'),
    path('reset-password-confirm/', views.api_reset_password_confirm, name='api_reset_password_confirm'),
    path('verify-token/', views.api_verify_token, name='api_verify_token'),
] 
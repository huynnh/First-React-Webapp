"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints - must come before template-based views
    path('api/tasks/', include('tasks.api_urls')),  # API endpoints for tasks
    path('api/auth/', include('customusers.api_urls')),  # API auth endpoints
    path('api/notifications/', include('notifications.urls')),  # API notifications endpoints
    path('api/calendarsync/', include('calendarsync.urls')),  # API calendarsync endpoints
    path('api/events/', include('events.urls')),  # API events endpoints
    path('api/ai-assistant/', include('aiassistant.urls')),  # API aiassistant endpoints
    
    
    # Root redirect
    path('', RedirectView.as_view(url='/tasks/', permanent=False)),
]

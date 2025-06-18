from django.db import models
from django.contrib.auth.models import User

class AiAssistant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request_data = models.TextField()
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"AI Interaction {self.id} - {self.user.username}"

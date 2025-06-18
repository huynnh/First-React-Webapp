from django.contrib.auth.models import User
from django.db import models

class Customuser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customuser')
    PLAN_CHOICES = [
        ('Free', 'Free'),
        ('Pro', 'Pro'),
        ('Enterprise', 'Enterprise'),
    ]
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='Free')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'customuser'

    def __str__(self):
        return f"{self.user.username} - {self.plan}"
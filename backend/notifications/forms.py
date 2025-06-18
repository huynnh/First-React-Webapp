from django import forms
from .models import Notification
from tasks.models import Task

class NotificationForm(forms.ModelForm):
    class Meta:
        model = Notification
        fields = ['task', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 4, 'class': 'form-control'}),
            'task': forms.Select(attrs={'class': 'form-select'}),
        }

    def __init__(self, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['task'].queryset = Task.objects.filter(user=user) 
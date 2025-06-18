from django import forms
from .models import CalendarSync

class CalendarSyncForm(forms.ModelForm):
    class Meta:
        model = CalendarSync
        fields = ['calendar_name']
        widgets = {
            'calendar_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter calendar name'
            })
        }

    def __init__(self, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user 
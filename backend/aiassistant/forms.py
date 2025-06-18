from django import forms
from .models import AiAssistant

class AiAssistantForm(forms.ModelForm):
    request_data = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 4,
            'placeholder': 'Enter your request for the AI assistant...'
        })
    )

    class Meta:
        model = AiAssistant
        fields = ['request_data']
        exclude = ['ai_response', 'user']

    def __init__(self, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user 
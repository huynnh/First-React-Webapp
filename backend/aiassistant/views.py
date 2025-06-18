from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from .models import AiAssistant
from .forms import AiAssistantForm
from tasks.models import Task
from events.models import Event
import google.generativeai as genai
import json
import logging
from datetime import datetime, timedelta

# Set up logging
logger = logging.getLogger(__name__)

# Configure Gemini API
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    # List available models
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            logger.info(f"Available model: {m.name}")
except Exception as e:
    logger.error(f"Error configuring Gemini API: {str(e)}")

# Configure the model
generation_config = {
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 500,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

def get_user_data(user_id):
    """Get relevant user data from the database"""
    now = timezone.now()
    today = now.date()
    user_id = user_id -1
    
    # Calculate date range (3 days before and 3 days after today)
    start_date = today - timedelta(days=3)
    end_date = today + timedelta(days=3)
        
    # Get all tasks within the date range
    tasks = Task.objects.filter(
        user_id=user_id,
        start_time__gte=timezone.make_aware(datetime.combine(start_date, datetime.min.time())),
        start_time__lte=timezone.make_aware(datetime.combine(end_date + timedelta(days=1), datetime.min.time()))
    ).order_by('start_time')
    
    # Get all events within the date range
    events = Event.objects.filter(
        user_id=user_id,
        start_time__gte=timezone.make_aware(datetime.combine(start_date, datetime.min.time())),
        start_time__lte=timezone.make_aware(datetime.combine(end_date + timedelta(days=1), datetime.min.time()))
    ).order_by('start_time')
    
    # Organize data by date
    data = {}
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')
        next_date = current_date + timedelta(days=1)
        
        # Filter tasks for this date
        day_tasks = [
            task for task in tasks
            if task.start_time.date() <= current_date and task.end_time.date() >= current_date
        ]
        
        # Filter events for this date
        day_events = [
            event for event in events
            if event.start_time.date() <= current_date and event.end_time.date() >= current_date
        ]
        
        data[date_str] = {
            'tasks': [
                {
                    'name': task.task_name,
                    'description': task.description,
                    'priority': task.priority,
                    'start_time': task.start_time.strftime('%I:%M %p'),
                    'end_time': task.end_time.strftime('%I:%M %p'),
                    'status': task.status
                } for task in day_tasks
            ],
            'events': [
                {
                    'title': event.title,
                    'start_time': event.start_time.strftime('%I:%M %p'),
                    'end_time': event.end_time.strftime('%I:%M %p'),
                    'location': event.location
                } for event in day_events
            ]
        }
        
        current_date = next_date
    
    # Add date labels for better context
    data['date_labels'] = {
        'today': today.strftime('%Y-%m-%d'),
        'yesterday': (today - timedelta(days=1)).strftime('%Y-%m-%d'),
        'tomorrow': (today + timedelta(days=1)).strftime('%Y-%m-%d'),
        'start_date': start_date.strftime('%Y-%m-%d'),
        'end_date': end_date.strftime('%Y-%m-%d')
    }
    
    return data

def get_ai_response(prompt, user_id):
    try:
        # Get user's data
        user_data = get_user_data(user_id)
        
        # Create system message with context
        system_message = """You are a helpful AI assistant that helps users manage their tasks and events. 
        Your main responsibilities are:
        1. Analyze if the user's schedule is too busy by checking for:
           - Overlapping tasks/events
           - Too many tasks/events in a single day
           - Insufficient breaks between activities
           - Unrealistic time allocations
        
        2. If the schedule is too busy, provide specific suggestions for:
           - Rescheduling tasks to less busy times
           - Breaking down large tasks into smaller ones
           - Adding appropriate breaks
           - Prioritizing important tasks
        
        3. Format your response as a clear, readable text with these sections:
           - Analysis: Detailed explanation of schedule issues
           - Suggestions: Numbered list of specific schedule changes
           - Schedule Changes: List of proposed changes to tasks and events
        
        Always be helpful and concise in your responses."""
        
        # Format the data for the AI
        context = f"""User's Schedule Data:
        Date Labels: {json.dumps(user_data['date_labels'], indent=2)}
        Schedule Data: {json.dumps({k: v for k, v in user_data.items() if k != 'date_labels'}, indent=2)}
        
        User's Question: {prompt}"""
        
        # Initialize the model with configuration
        model = genai.GenerativeModel(
            model_name='gemini-2.0-flash',
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        # Create chat session
        chat = model.start_chat(history=[])
        
        # Send system message and context
        chat.send_message(system_message)
        
        # Generate response
        response = chat.send_message(context)
        
        if not response.text:
            logger.warning("Empty response received from Gemini API")
            return "I couldn't analyze your schedule at this time. Please try again later."
            
        # Return the response text directly
        return response.text
            
    except Exception as e:
        error_message = str(e)
        logger.error(f"Gemini API error: {error_message}")
        
        if "404" in error_message:
            return "The AI model is currently unavailable. Please try again later."
        elif "403" in error_message:
            return "Invalid API key or insufficient permissions."
        elif "429" in error_message:
            return "Rate limit exceeded. Please try again in a few moments."
        else:
            return f"Error processing request: {error_message}"

# Create your views here.

@login_required
@ensure_csrf_cookie
@require_http_methods(["GET"])
def ai_assistant_list(request):
    interactions = AiAssistant.objects.filter(user_id=request.user.id).order_by('-created_at')
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # API request
        data = [{
            'id': interaction.id,
            'request_data': interaction.request_data,
            'ai_response': interaction.ai_response,
            'created_at': interaction.created_at.isoformat()
        } for interaction in interactions]
        return JsonResponse(data, safe=False)
    # Regular request
    return render(request, 'aiassistant/interaction_list.html', {'interactions': interactions})

@login_required
@csrf_protect
@require_http_methods(["POST"])
def ai_assistant_create(request):
    # Check rate limiting
    cache_key = f"ai_request_count_{request.user.id}"
    request_count = cache.get(cache_key, 0)
    
    if request_count >= 10:  # Limit to 10 requests per minute
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Rate limit exceeded'}, status=429)
        messages.error(request, 'Rate limit exceeded. Please wait a minute before making more requests.')
        return redirect('aiassistant:interaction_list')
    
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # API request
            try:
                data = json.loads(request.body)
                request_data = data.get('request_data')
                if not request_data:
                    logger.error("No request_data provided in request body")
                    return JsonResponse({'error': 'No request data provided'}, status=400)
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in request body: {str(e)}")
                return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
        else:
            # Regular form submission
            form = AiAssistantForm(user=request.user, data=request.POST)
            if not form.is_valid():
                return JsonResponse({'error': form.errors}, status=400)
            request_data = form.cleaned_data['request_data']

        # Get AI response with user data
        try:
            ai_response = get_ai_response(request_data, request.user.id)
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            return JsonResponse({'error': 'Error getting AI response'}, status=500)
        
        # Save interaction
        try:
            interaction = AiAssistant.objects.create(
                user_id=request.user.id,
                request_data=request_data,
                ai_response=ai_response
            )
        except Exception as e:
            logger.error(f"Error saving interaction: {str(e)}")
            return JsonResponse({'error': 'Error saving interaction'}, status=500)
        
        # Update rate limiting
        cache.set(cache_key, request_count + 1, 60)  # Expires in 60 seconds
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'id': interaction.id,
                'request_data': interaction.request_data,
                'ai_response': interaction.ai_response,
                'created_at': interaction.created_at.isoformat()
            })
        
        messages.success(request, 'AI request processed successfully!')
        return redirect('aiassistant:interaction_list')
        
    except Exception as e:
        logger.error(f"Unexpected error in ai_assistant_create: {str(e)}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': str(e)}, status=500)
        messages.error(request, f'Error processing request: {str(e)}')
        return redirect('aiassistant:interaction_list')

@login_required
@ensure_csrf_cookie
@require_http_methods(["GET"])
def ai_assistant_detail(request, pk):
    interaction = get_object_or_404(AiAssistant, pk=pk, user_id=request.user.id)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'id': interaction.id,
            'request_data': interaction.request_data,
            'ai_response': interaction.ai_response,
            'created_at': interaction.created_at.isoformat()
        })
    return render(request, 'aiassistant/interaction_detail.html', {'interaction': interaction})

@login_required
@csrf_protect
@require_http_methods(["POST"])
def ai_assistant_delete(request, pk):
    interaction = get_object_or_404(AiAssistant, pk=pk, user_id=request.user.id)
    interaction.delete()
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'message': 'AI interaction deleted successfully!'})
    messages.success(request, 'AI interaction deleted successfully!')
    return redirect('aiassistant:interaction_list')

@login_required
@csrf_protect
@require_http_methods(["POST"])
def update_schedule(request):
    try:
        data = json.loads(request.body)
        new_schedule = data.get('new_schedule')
        
        if not new_schedule:
            return JsonResponse({'error': 'No schedule data provided'}, status=400)
        
        # Update tasks
        for task_data in new_schedule.get('tasks', []):
            task = Task.objects.get(id=task_data['id'], user_id=request.user.id)
            task.start_time = timezone.make_aware(datetime.strptime(task_data['start_time'], '%Y-%m-%d %H:%M:%S'))
            task.end_time = timezone.make_aware(datetime.strptime(task_data['end_time'], '%Y-%m-%d %H:%M:%S'))
            task.save()
        
        # Update events
        for event_data in new_schedule.get('events', []):
            event = Event.objects.get(id=event_data['id'], user_id=request.user.id)
            event.start_time = timezone.make_aware(datetime.strptime(event_data['start_time'], '%Y-%m-%d %H:%M:%S'))
            event.end_time = timezone.make_aware(datetime.strptime(event_data['end_time'], '%Y-%m-%d %H:%M:%S'))
            event.save()
        
        return JsonResponse({'message': 'Schedule updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

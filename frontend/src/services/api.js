import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    verifyToken: () => api.get('/auth/verify-token/'),
};

// Events API calls
export const eventsAPI = {
    getEvents: () =>  api.get('/events/api/'),
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/events/api/', eventData);
            await api.get(`/notifications/create/event/${response.data.id}/`);
            return response.data;
        } catch (error) {
            console.error("Error creating event and notification:", error);
            throw error;
        }
    },
    
    updateEvent: (id, eventData) => api.put(`/events/api/${id}/`, eventData),
    deleteEvent: (id) => api.delete(`/events/api/${id}/`),
};

// Notifications API calls
export const notificationsAPI = {
    getNotifications: () => api.get('/notifications/'),
    markAsRead: (id) => api.post(`/notifications/${id}/mark-read/`),
    dismiss: (id) => api.post(`/notifications/${id}/dismiss/`),
    markAllAsRead: () => api.post('/notifications/mark-all-read/'),
};

export default api; 
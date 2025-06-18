import axios from 'axios';

const API_URL = 'http://localhost:8000/api/ai-assistant';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor to get CSRF token
api.interceptors.request.use(config => {
  const csrfToken = document.cookie.split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export const aiService = {
  async getInteractions() {
    try {
      const response = await api.get('/list/');
      return response.data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      throw error;
    }
  },

  async createInteraction(message) {
    try {
      const response = await api.post('/create/', { request_data: message });
      return response.data;
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  },

  async updateSchedule(newSchedule) {
    try {
      const response = await api.post('/update-schedule/', newSchedule);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  deleteInteraction: async (id) => {
    try {
      const response = await api.delete(`/${id}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 
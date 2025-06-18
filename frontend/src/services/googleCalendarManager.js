import api from './api';

class GoogleCalendarManager {
    constructor() {
        this.isConnected = false;
        this.connectionCheckInterval = null;
    }

    async checkConnection() {
        try {
            const response = await api.get('/calendarsync/google/connection/');
            this.isConnected = response.data.connected;
            return response.data.connected;
        } catch (error) {
            console.error('Error checking Google Calendar connection:', error);
            return false;
        }
    }

    startConnectionCheck() {
        // Check connection every 5 minutes
        this.connectionCheckInterval = setInterval(() => {
            this.checkConnection();
        }, 300000);
    }

    stopConnectionCheck() {
        if (this.connectionCheckInterval) {
            clearInterval(this.connectionCheckInterval);
        }
    }

    async connect() {
        try {
            const response = await api.get('/calendarsync/google/start/');
            window.location.href = response.data.auth_url;
        } catch (error) {
            console.error('Error connecting to Google Calendar:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            const response = await api.post('/calendarsync/google/disconnect/');
            const data = response.data;
            
            if (data.status === 'success') {
                this.isConnected = false;
                return { success: true, message: data.message };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error disconnecting from Google Calendar:', error);
            throw error;
        }
    }

    async syncEvents() {
        try {
            // First pull events from Google Calendar
            await api.post('/calendarsync/events/pull/');
            // Then push local events to Google Calendar
            await api.post('/calendarsync/events/push/');
            // Finally get the latest events
            const response = await api.post('/calendarsync/google/sync/');
            return response.data;
        } catch (error) {
            console.error('Error syncing events:', error);
            throw error;
        }
    }

    async pullGoogleTasks() {
        try {
            const response = await api.post('/calendarsync/tasks/pull/');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error pulling Google Tasks:', error);
            throw error;
        }
    }

    async pushGoogleTasks() {
        try {
            const response = await api.post('/calendarsync/tasks/push/');
            return response.data;
        } catch (error) {
            console.error('Error pushing tasks to Google:', error);
            throw error;
        }
    }
}

export default new GoogleCalendarManager(); 
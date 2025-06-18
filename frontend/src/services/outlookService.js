import api from './api';

const outlookService = {
    checkConnection: async () => {
        const response = await api.get('/calendarsync/outlook/check/');
        return response.data;
    },

    startAuth: async () => {
        const response = await api.get('/calendarsync/outlook/start/');
        return response.data;
    },

    sync: async () => {
        const response = await api.post('/calendarsync/outlook/sync/');
        return response.data;
    },

    pullEvents: async () => {
        const response = await api.post('/calendarsync/outlook/pull-events/');
        return response.data;
    },

    pullTasks: async () => {
        const response = await api.post('/calendarsync/outlook/pull-tasks/');
        return response.data;
    },

    pushEvents: async () => {
        const response = await api.post('/calendarsync/outlook/push-events/');
        return response.data;
    },

    pushTasks: async () => {
        const response = await api.post('/calendarsync/outlook/push-tasks/');
        return response.data;
    },
    
    disconnect: async () => {
        const response = await api.post('/calendarsync/outlook/disconnect/');
        return response.data;
    }
};

export default outlookService; 
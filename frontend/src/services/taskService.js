import api from './api';

const taskService = {
    // Get all tasks
    getAllTasks: async () => {
        try {
            const response = await api.get('/tasks/');
            console.log('API Task Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error.response || error);
            throw error;
        }
    },

    // Get upcoming tasks
    getUpcomingTasks: async () => {
        try {
            const response = await api.get('/tasks/upcoming/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get completed tasks
    getCompletedTasks: async () => {
        try {
            const response = await api.get('/tasks/completed/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get cancelled tasks
    getCancelledTasks: async () => {
        try {
            const response = await api.get('/tasks/cancelled/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a new task
    createTask: async (taskData) => {
        try {
            console.log('Creating task with data:', taskData); // Debug log
            const response = await api.post('/tasks/', taskData);
            await api.get(`/notifications/create/task/${response.data.id}/`, taskData);
            console.log('Create task response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error.response || error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (taskId, taskData) => {
        try {
            const response = await api.put(`/tasks/${taskId}/`, taskData);
            console.log('Update task response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error.response || error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}/`);
        } catch (error) {
            console.error('Error deleting task:', error.response || error);
            throw error;
        }
    },

    // Complete a task
    completeTask: async (taskId) => {
        try {
            const response = await api.post(`/tasks/${taskId}/complete/`);
            return response.data;
        } catch (error) {
            console.error('Error completing task:', error.response || error);
            throw error;
        }
    },

    // Cancel a task
    cancelTask: async (taskId) => {
        try {
            const response = await api.post(`/tasks/${taskId}/cancel/`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling task:', error.response || error);
            throw error;
        }
    }
};

export default taskService; 
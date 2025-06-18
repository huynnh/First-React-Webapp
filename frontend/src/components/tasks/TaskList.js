import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';
import TaskForm from './TaskForm';
import taskService from '../../services/taskService';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            
            // Ensure we have an array of tasks
            const tasksArray = Array.isArray(response) ? response : [];
            
            setTasks(tasksArray);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err.response?.data?.message || 'Failed to fetch tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            setShowForm(false);
            await fetchTasks(); // Refresh the task list
        } catch (err) {
            console.error('Error creating task:', err);
            throw err; // Let the form handle the error
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            const response = await taskService.updateTask(taskId, taskData);
            setSelectedTask(null);
            await fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            throw err;
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            await fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again.');
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await taskService.completeTask(taskId);
            await fetchTasks();
        } catch (err) {
            console.error('Error completing task:', err);
            setError('Failed to complete task. Please try again.');
        }
    };

    const handleCancelTask = async (taskId) => {
        try {
            await taskService.cancelTask(taskId);
            await fetchTasks();
        } catch (err) {
            setError('Failed to cancel task. Please try again.');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    // Helper for priority background color
    const getPriorityBg = (priority) => {
        if (priority === 'high') return '#ffd6d6'; 
        if (priority === 'medium') return '#fffbe6'; 
        return '#fff'; // low
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'pending': return 'Đang chờ';
            case 'in_progress': return 'Đang thực hiện';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'cancelled': return 'default';
            case 'pending': return 'primary';
            case 'in_progress': return 'info';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Công việc</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowForm(true)}
                    >
                        Thêm công việc mới
                    </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {showForm && (
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {selectedTask && (
                <TaskForm
                    task={selectedTask}
                    onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
                    onCancel={() => setSelectedTask(null)}
                />
            )}

            <Paper>
                <List>
                    {tasks.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="Không có công việc"
                                secondary="Tạo công việc để bắt đầu"
                            />
                        </ListItem>
                    ) : (
                        tasks.map((task) => (
                            <ListItem
                                key={task.id}
                                divider
                                sx={{
                                    bgcolor: getPriorityBg(task.priority)
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {task.task_name}
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                color={getPriorityColor(task.priority)}
                                            />
                                            <Chip
                                                label={getStatusLabel(task.status)}
                                                size="small"
                                                color={getStatusColor(task.status)}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="textSecondary">
                                                {task.description}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(task.start_time).toLocaleString()} - {new Date(task.end_time).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => setSelectedTask(task)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDeleteTask(task.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {task.status === 'completed' && (
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleUpdateTask(task.id, { ...task, status: 'pending' })}
                                            sx={{ mr: 1 }}
                                        >
                                            <CheckCircleIcon color="disabled" />
                                            <Typography variant="caption" ml={0.5}>Đặt lại chờ</Typography>
                                        </IconButton>
                                    )}
                                    {(task.status === 'pending' || task.status === 'in_progress') && (
                                        <>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleCompleteTask(task.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                <CheckCircleIcon color="success" />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleCancelTask(task.id)}
                                            >
                                                <CancelIcon color="error" />
                                            </IconButton>
                                        </>
                                    )}
                                    {task.status === 'cancelled' && (
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleUpdateTask(task.id, { ...task, status: 'pending' })}
                                        >
                                            <RestoreIcon color="primary" />
                                            <Typography variant="caption" ml={0.5}>Khôi phục</Typography>
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default TaskList; 
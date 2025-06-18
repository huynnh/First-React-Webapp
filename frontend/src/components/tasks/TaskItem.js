import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

const TaskItem = ({ task, onEdit, onDelete, onComplete, onCancel }) => {
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
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

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString();
    };

    return (
        <Card sx={{ mb: 2, position: 'relative' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {task.task_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            {task.description}
                        </Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                                size="small"
                            />
                            <Chip
                                label={task.status}
                                color={getStatusColor(task.status)}
                                size="small"
                            />
                        </Stack>
                        <Typography variant="body2" color="textSecondary">
                            Start: {formatDateTime(task.start_time)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            End: {formatDateTime(task.end_time)}
                        </Typography>
                    </Box>
                    <Box>
                        {task.status === 'pending' && (
                            <>
                                <IconButton
                                    color="primary"
                                    onClick={onEdit}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="success"
                                    onClick={onComplete}
                                    size="small"
                                >
                                    <CheckCircleIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={onCancel}
                                    size="small"
                                >
                                    <CancelIcon />
                                </IconButton>
                            </>
                        )}
                        <IconButton
                            color="error"
                            onClick={onDelete}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskItem; 
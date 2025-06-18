import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Badge,
    Button,
    Paper,
    Divider,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { notificationsAPI } from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const NotificationPanel = ({ isMobile }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await notificationsAPI.getNotifications();
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => n.status === 'unread').length);
        } catch (error) {
            console.error('Error fetching notifications:', error.response || error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationsAPI.markAsRead(notificationId);
            setNotifications(notifications.map(notification =>
                notification.notification_id === notificationId
                    ? { ...notification, status: 'read' }
                    : notification
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error.response || error);
        }
    };

    const handleDismiss = async (notificationId) => {
        try {
            const response = await notificationsAPI.dismiss(notificationId);
            if (response.data.status === 'success') {
                setNotifications(notifications.filter(notification =>
                    notification.notification_id !== notificationId
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error dismissing notification:', error.response || error);
            // Optionally show an error message to the user
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(notifications.map(notification => ({
                ...notification,
                status: 'read'
            })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error.response || error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error.main';
            case 'medium':
                return 'warning.main';
            case 'low':
                return 'info.main';
            default:
                return 'text.primary';
        }
    };

    const formatDate = (dateString) => {
        try {
            return dayjs(dateString).fromNow();
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Notifications">
                <IconButton
                    color="inherit"
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{ position: 'relative' }}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* Mobile: Dialog */}
            {isMobile && (
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Notifications
                        <IconButton onClick={() => setIsOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{ p: 0 }}>
                        <Box sx={{ p: 2 }}>
                            {unreadCount > 0 && (
                                <Button
                                    startIcon={<DoneAllIcon />}
                                    onClick={handleMarkAllAsRead}
                                    size="small"
                                    sx={{ mb: 1 }}
                                    fullWidth
                                >
                                    Đánh dấu tất cả là đã đọc
                                </Button>
                            )}
                            <List>
                                {notifications.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="Không có thông báo" />
                                    </ListItem>
                                ) : (
                                    notifications.map((notification) => (
                                        <ListItem
                                            key={notification.notification_id}
                                            sx={{
                                                bgcolor: notification.status === 'unread' ? 'action.hover' : 'inherit',
                                                borderLeft: 4,
                                                borderColor: getPriorityColor(notification.priority),
                                            }}
                                        >
                                            <ListItemText
                                                primary={notification.title}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {notification.message}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="span" variant="caption" color="text.secondary">
                                                            {formatDate(notification.created_at)}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            <Box>
                                                {notification.status === 'unread' && (
                                                    <Tooltip title="Mark as read">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleMarkAsRead(notification.notification_id)}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Dismiss">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDismiss(notification.notification_id)}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Desktop: Dropdown Panel */}
            {!isMobile && isOpen && (
                <Paper
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        width: 350,
                        maxHeight: 500,
                        overflow: 'auto',
                        zIndex: 1000,
                        mt: 1,
                    }}
                >
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Notifications</Typography>
                        {unreadCount > 0 && (
                            <Button
                                startIcon={<DoneAllIcon />}
                                onClick={handleMarkAllAsRead}
                                size="small"
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Box>
                    <Divider />
                    <List>
                        {notifications.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="No notifications" />
                            </ListItem>
                        ) : (
                            notifications.map((notification) => (
                                <ListItem
                                    key={notification.notification_id}
                                    sx={{
                                        bgcolor: notification.status === 'unread' ? 'action.hover' : 'inherit',
                                        borderLeft: 4,
                                        borderColor: getPriorityColor(notification.priority),
                                    }}
                                >
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {notification.message}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="caption" color="text.secondary">
                                                    {formatDate(notification.created_at)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Box>
                                        {notification.status === 'unread' && (
                                            <Tooltip title="Mark as read">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleMarkAsRead(notification.notification_id)}
                                                >
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Dismiss">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDismiss(notification.notification_id)}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default NotificationPanel; 
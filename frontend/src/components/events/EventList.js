import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { eventsAPI } from '../../services/api';
import dayjs from 'dayjs';
import EventForm from './EventForm';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await eventsAPI.getEvents();
            setEvents(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách sự kiện.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async (eventData) => {
        try {
            await eventsAPI.createEvent(eventData);
            setShowForm(false);
            await fetchEvents();
        } catch (err) {
            throw err;
        }
    };

    const handleUpdateEvent = async (eventId, eventData) => {
        try {
            await eventsAPI.updateEvent(eventId, eventData);
            setSelectedEvent(null);
            await fetchEvents();
        } catch (err) {
            throw err;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await eventsAPI.deleteEvent(eventId);
            await fetchEvents();
        } catch (err) {
            setError('Không thể xóa sự kiện.');
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
                <Typography variant="h4">Sự kiện</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowForm(true)}
                >
                    Thêm sự kiện mới
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {showForm && (
                <EventForm
                    onSubmit={handleCreateEvent}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {selectedEvent && (
                <EventForm
                    event={selectedEvent}
                    onSubmit={(data) => handleUpdateEvent(selectedEvent.id, data)}
                    onCancel={() => setSelectedEvent(null)}
                />
            )}

            <List>
                {events.length === 0 && !loading && <ListItem><ListItemText primary="Không có sự kiện nào" /></ListItem>}
                {events.map(event => (
                    <React.Fragment key={event.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={event.title}
                                secondary={<>
                                    <Typography component="span" variant="body2" color="text.primary">{event.description}</Typography><br/>
                                    <Typography component="span" variant="caption" color="text.secondary">
                                        {event.start?.dateTime ? dayjs(event.start.dateTime).format('YYYY-MM-DD HH:mm') : ''} - {event.end?.dateTime ? dayjs(event.end.dateTime).format('YYYY-MM-DD HH:mm') : ''}
                                    </Typography>
                                    {event.location && (
                                        <><br/><Typography component="span" variant="caption" color="text.secondary">Địa điểm: {event.location}</Typography></>
                                    )}
                                </>}
                            />
                            {event.external_provider && <Chip label={event.external_provider} size="small" sx={{ ml: 1 }} />}
                            <ListItemSecondaryAction>
                                <IconButton edge="end" color="primary" onClick={() => setSelectedEvent(event)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleDeleteEvent(event.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default EventList; 
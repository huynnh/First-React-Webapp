import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import dayjs from 'dayjs';

function toLocalInputString(isoString) {
    return isoString ? dayjs(isoString).format('YYYY-MM-DDTHH:mm') : '';
}
function toLocalISOStringWithOffset(localString) {
    return dayjs(localString).format('YYYY-MM-DDTHH:mm:ssZ');
}

const EventForm = ({ onSubmit, onCancel, event }) => {
    const [formData, setFormData] = useState({
        summary: event?.summary || '',
        description: event?.description || '',
        location: event?.location || '',
        start: event?.start?.dateTime ? toLocalInputString(event.start.dateTime) : '',
        end: event?.end?.dateTime ? toLocalInputString(event.end.dateTime) : '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const start = dayjs(formData.start);
            const end = dayjs(formData.end);
            const now = dayjs();
            if (end.isBefore(now)) {
                setError('Thời gian kết thúc không được ở trong quá khứ.');
                setLoading(false);
                return;
            }
            const payload = {
                summary: formData.summary,
                description: formData.description,
                location: formData.location,
                start: { dateTime: toLocalISOStringWithOffset(formData.start), timeZone: 'UTC' },
                end: { dateTime: toLocalISOStringWithOffset(formData.end), timeZone: 'UTC' },
            };
            await onSubmit(payload);
            onCancel();
        } catch (err) {
            setError('Không thể lưu sự kiện.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>{event ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            required
                            fullWidth
                            label="Tên sự kiện"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Địa điểm"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Bắt đầu"
                            name="start"
                            type="datetime-local"
                            value={formData.start}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Kết thúc"
                            name="end"
                            type="datetime-local"
                            value={formData.end}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Đang lưu...' : (event ? 'Cập nhật' : 'Tạo mới')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EventForm; 
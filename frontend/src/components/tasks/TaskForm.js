import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Alert
} from '@mui/material';
import dayjs from 'dayjs';

// Utility functions for timezone handling
function toLocalInputString(isoString) {
    return isoString ? dayjs(isoString).format('YYYY-MM-DDTHH:mm') : '';
}
function toLocalISOStringWithOffset(localString) {
    return dayjs(localString).format('YYYY-MM-DDTHH:mm:ssZ');
}

const TaskForm = ({ onSubmit, onCancel, task }) => {
    const [formData, setFormData] = useState({
        task_name: task?.task_name || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        start_time: task?.start_time ? toLocalInputString(task.start_time) : '',
        end_time: task?.end_time ? toLocalInputString(task.end_time) : '',
        status: task?.status || 'pending'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validation logic
            const start = dayjs(formData.start_time);
            const end = dayjs(formData.end_time);
            const now = dayjs();
            if (formData.status !== 'completed' && end.isBefore(now)) {
                setError('Thời gian kết thúc không được ở trong quá khứ nếu chưa hoàn thành.');
                setLoading(false);
                return;
            }
            // Convert to ISO string with offset for backend
            const payload = {
                ...formData,
                start_time: toLocalISOStringWithOffset(formData.start_time),
                end_time: toLocalISOStringWithOffset(formData.end_time),
            };
            await onSubmit(payload);
            onCancel();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>
                {task ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            required
                            fullWidth
                            label="Tên công việc"
                            name="task_name"
                            value={formData.task_name}
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
                            required
                            fullWidth
                            select
                            label="Độ ưu tiên"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <MenuItem value="low">Thấp</MenuItem>
                            <MenuItem value="medium">Trung bình</MenuItem>
                            <MenuItem value="high">Cao</MenuItem>
                        </TextField>
                        <TextField
                            required
                            fullWidth
                            label="Thời gian bắt đầu"
                            name="start_time"
                            type="datetime-local"
                            value={formData.start_time}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Thời gian kết thúc"
                            name="end_time"
                            type="datetime-local"
                            value={formData.end_time}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            required
                            fullWidth
                            select
                            label="Trạng thái"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="pending">Đang chờ</MenuItem>
                            <MenuItem value="in_progress">Đang thực hiện</MenuItem>
                            <MenuItem value="completed">Đã hoàn thành</MenuItem>
                            <MenuItem value="cancelled">Đã hủy</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : (task ? 'Cập nhật' : 'Tạo')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskForm; 
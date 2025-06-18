import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    IconButton
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    CalendarToday as CalendarTodayIcon,
    SmartToy as SmartToyIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../notifications/NotificationPanel';

const drawerWidth = 240;

const Navigation = ({ activeTab, onTabChange, isMobile }) => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem
                    button
                    selected={activeTab === 'tasks'}
                    onClick={() => { onTabChange('tasks'); if (isMobile) setMobileOpen(false); }}
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Công việc" />
                </ListItem>
                <ListItem
                    button
                    selected={activeTab === 'calendar'}
                    onClick={() => { onTabChange('calendar'); if (isMobile) setMobileOpen(false); }}
                >
                    <ListItemIcon>
                        <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Lịch" />
                </ListItem>
                <ListItem
                    button
                    selected={activeTab === 'sync'}
                    onClick={() => { onTabChange('sync'); if (isMobile) setMobileOpen(false); }}
                >
                    <ListItemIcon>
                        <CalendarTodayIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Đồng bộ lịch" />
                </ListItem>
                <ListItem
                    button
                    selected={activeTab === 'ai'}
                    onClick={() => { onTabChange('ai'); if (isMobile) setMobileOpen(false); }}
                >
                    <ListItemIcon>
                        <SmartToyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trợ lý AI" />
                </ListItem>
                <ListItem
                    button
                    selected={activeTab === 'events'}
                    onClick={() => { onTabChange('events'); if (isMobile) setMobileOpen(false); }}
                >
                    <ListItemIcon>
                        <CalendarTodayIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Sự kiện" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={isMobile ? { minHeight: 56, px: 1, display: 'flex', justifyContent: 'space-between' } : {}}>
                    {isMobile ? (
                        <>
                            {/* Left: Hamburger */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 1 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                            {/* Center: Title */}
                            <Box sx={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ textAlign: 'center', width: '100%' }}
                                >
                                    Smart Scheduler
                                </Typography>
                            </Box>
                            {/* Right: Notification + Logout */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', gap: 1 }}>
                                <NotificationPanel isMobile={isMobile} />
                                <Button color="inherit" onClick={handleLogout} sx={{ minWidth: 0, px: 1 }}>
                                    Đăng xuất
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                Smart Scheduler
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <NotificationPanel isMobile={isMobile} />
                                <Typography variant="body1">
                                    Chào, {user?.email}
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <Toolbar />
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    open
                >
                    <Toolbar />
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default Navigation; 
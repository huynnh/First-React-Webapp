import NotificationPanel from './notifications/NotificationPanel';

<Box sx={{ display: 'flex', alignItems: 'center' }}>
    <NotificationPanel />
    <IconButton
        color="inherit"
        onClick={handleProfileMenuOpen}
        edge="end"
    >
        <AccountCircle />
    </IconButton>
</Box> 
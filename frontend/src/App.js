import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, Toolbar, useMediaQuery } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import TaskList from './components/tasks/TaskList';
import Calendar from './components/calendar/Calendar';
import Navigation from './components/common/Navigation';
import CalendarSync from './components/calendar/CalendarSync';
import EventList from './components/events/EventList';
import AIAssistant from './components/ai/AIAssistant';

// Create theme instance with mobile-first approach
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          '@media (max-width: 600px)': {
            padding: '6px 12px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      '@media (max-width: 600px)': {
        fontSize: '1.5rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      '@media (max-width: 600px)': {
        fontSize: '1.25rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      '@media (max-width: 600px)': {
        fontSize: '1.1rem',
      },
    },
  },
});

const MainApp = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isMobile={isMobile}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', sm: 'auto' },
          mt: { xs: isMobile ? '56px' : 0, sm: 0 }
        }}
      >
        <Toolbar />
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'sync' && <CalendarSync />}
        {activeTab === 'events' && <EventList />}
        {activeTab === 'ai' && <AIAssistant />}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
          />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

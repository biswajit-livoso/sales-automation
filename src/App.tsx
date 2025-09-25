import React, { useState, useEffect } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/authContext';
import LoginPage from './components/login/LoginPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import LeadsView from './components/views/LeadsView';
import VisitsView from './components/views/VisitsView';
import UserDetailView from './components/views/UserDetailView';
import UsersView from './components/views/UsersView';
import VendorsView from './components/views/VendorsView';
import { VisitProvider } from './context/visitContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Set default view based on user role when user is loaded
  useEffect(() => {
    if (user) {
      const defaultView = user.role === 'admin' ? 'admin-dashboard' : 'dashboard';
      setCurrentView(defaultView);
    }
  }, [user]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <UserDashboard onCreateVisit={() => setCurrentView('visits')} />;
      case 'admin-dashboard':
        return <AdminDashboard onViewUser={(userId) => { setSelectedUserId(userId); setCurrentView('user-detail'); }} />;
      case 'user-detail':
        return <UserDetailView userId={selectedUserId} />;
      case 'leads':
        return <LeadsView />;
      case 'visits':
        return <VisitsView />;
      case 'vendors':
        return <VendorsView />;
      case 'deals':
        return (
          <Box sx={{ p: 3 }}>
            <h2>Deals View</h2>
            <p>Deals management interface coming soon...</p>
          </Box>
        );
      case 'tasks':
        return (
          <Box sx={{ p: 3 }}>
            <h2>Tasks View</h2>
            <p>Task management interface coming soon...</p>
          </Box>
        );
      case 'users':
        return <UsersView />;
      case 'user':
        return <UsersView />;
      case 'analytics':
        return (
          <Box sx={{ p: 3 }}>
            <h2>Analytics</h2>
            <p>Advanced analytics interface coming soon...</p>
          </Box>
        );
      case 'settings':
      case 'system-settings':
        return (
          <Box sx={{ p: 3 }}>
            <h2>Settings</h2>
            <p>Settings interface coming soon...</p>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <h2>Welcome</h2>
            <p>Select a view from the sidebar.</p>
          </Box>
        );
    }
  };

  // If user is not logged in, show login page
  if (!user) return <LoginPage />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} onItemClick={handleViewChange} currentView={currentView} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarOpen ? 280 : 0}px)` },
          ml: { sm: sidebarOpen ? '10px' : 0 },
          transition: 'margin 0.3s',
          backgroundColor: 'background.default',
          minHeight: '100vh',
          p: 3,
          mt: 3,
        }}
      >
        {renderCurrentView()}
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <VisitProvider>
        <CssBaseline />
        <AppContent />
      </VisitProvider>
    </AuthProvider>
  );
};

export default App;

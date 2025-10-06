import React, { useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import LoginPage from './components/login/LoginPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import LeadsView from './components/views/LeadsView';
import VisitsView from './components/views/VisitsView';
import UserDetailPage from './components/views/UserDetailPage';
import UsersView from './components/views/UsersView';
import VendorsView from './components/views/VendorsView';
import ProductsView from './components/views/ProductsView';
import { AuthProvider, useAuth } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import AdminView from './components/views/AdminView';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { paths } from './paths';

const AppShell: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return <Navigate to={paths.login} replace />;
  }
console.log("user at app shell", user);
  const handleSidebarToggle = () => setSidebarOpen((p) => !p);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
        <Outlet />
      </Box>
    </Box>
  );
};

const RedirectHome: React.FC = () => {
  const { user } = useAuth();
  console.log("user at redirect home", user?.role);
  if (!user) return <Navigate to={paths.login} replace />;
  const target = user.role === 'ADMIN' ? paths.admin : paths.dashboard;
  return <Navigate to={target} replace />;
};

const App = () => {
  return (
    <AuthProvider>
          <CssBaseline />
          <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path={paths.login} element={<LoginPage />} />

              {/* Protected layout */}
              <Route element={<AppShell />}> 
                <Route index element={<RedirectHome />} />
                <Route path={paths.dashboard} element={<UserDashboard />} />
                <Route path={paths.admin} element={<AdminDashboard />} />
                <Route path={paths.visits} element={<VisitsView />} />
                <Route path={paths.leads || '/leads'} element={<LeadsView />} />
                <Route path={paths.adminVisits} element={<AdminView />} />
                <Route path={paths.users} element={<UsersView />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path={paths.vendors} element={<VendorsView />} />
                <Route path={paths.products} element={<ProductsView />} />
                <Route path={paths.analytics} element={<Box sx={{ p: 3 }}><h2>Analytics</h2><p>Advanced analytics interface coming soon...</p></Box>} />
                <Route path={paths.settings} element={<Box sx={{ p: 3 }}><h2>Settings</h2><p>Settings interface coming soon...</p></Box>} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to={paths.root} replace />} />
            </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

// src/components/Sidebar/Sidebar.tsx

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dashboard,
  Group,
  BarChart,
  Contacts,
  Settings,
  EventAvailable as VisitsIcon,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../context/authContext';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onItemClick: (view: string) => void;
  currentView: string;
  onClose?: () => void;
}

const getNavItems = (userRole: string) => {
  const baseItems = [
    { label: 'Dashboard', view: userRole === 'admin' ? 'admin-dashboard' : 'dashboard', icon: <Dashboard /> },
    { label: 'Leads', view: 'leads', icon: <Group /> },
    { label: 'Visits', view: 'visits', icon: <VisitsIcon /> },
    { label: 'User', view: 'user', icon: <Person /> },
    // { label: 'Deals', view: 'deals', icon: <CheckBox /> },
    { label: 'Analytics', view: 'analytics', icon: <BarChart /> },
    // { label: 'Performance', view: 'performance', icon: <TrendingUp /> },
    { label: 'Vendors', view: 'vendors', icon: <Contacts /> },
    // { label: 'Data', view: 'data', icon: <Storage /> },
    { label: 'Settings', view: 'settings', icon: <Settings /> },
  ];

  // Filter out visits for admin users
  if (userRole === 'admin') {
    return baseItems.filter(item => item.view !== 'visits');
  }
  if (userRole === 'user') {
    return baseItems.filter(item => item.view !== 'user');
  }
  

  return baseItems;
};

const Sidebar: React.FC<SidebarProps> = ({ open, onItemClick, currentView, onClose }) => {
  const { user } = useAuth();
  const navItems = getNavItems(user?.role || 'user');
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isSmall ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: isSmall ? false : true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: '#1e1e2f',
          color: '#fff',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          SalesPro
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List>
        {navItems.map(({ label, view, icon }) => (
          <ListItem key={view} disablePadding>
            <ListItemButton
              onClick={() => {
                onItemClick(view);
                if (isSmall && onClose) onClose();
              }}
              selected={currentView === view}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#333',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: '#2e2e45',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ccc' }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

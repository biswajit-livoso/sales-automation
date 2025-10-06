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
    Storefront,
  } from '@mui/icons-material';
import { useAuth } from '../../context/authContext';
import { NavLink } from 'react-router-dom';
import { paths } from '../../paths';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const getNavItems = (userRole: string) => {
  const baseItems = [
    { label: 'Dashboard', to: userRole === 'ADMIN' ? paths.admin : paths.dashboard, icon: <Dashboard /> },
    { label: 'Leads', to: '/leads', icon: <Group /> },
    { label: 'Visits', to: userRole === 'ADMIN' ? paths.adminVisits : paths.visits, icon: <VisitsIcon /> },
    { label: 'Users', to: paths.users, icon: <Person /> },
    // { label: 'Deals', view: 'deals', icon: <CheckBox /> },
    { label: 'Analytics', to: paths.analytics, icon: <BarChart /> },
    // { label: 'Performance', view: 'performance', icon: <TrendingUp /> },
    { label: 'Vendors', to: paths.vendors, icon: <Contacts /> },
    // Admin-only
    ...(userRole === 'ADMIN' ? ([{ label: 'Products', to: paths.products, icon: <Storefront /> }] as const) : ([] as const)),
    // { label: 'Data', view: 'data', icon: <Storage /> },
    { label: 'Settings', to: paths.settings, icon: <Settings /> },
  ];

  // Filter out visits for admin users
  // if (userRole === 'ADMIN') {
  //   return baseItems.filter(item => item.view !== 'visits');
  // }
  if (userRole === 'USER') {
    return baseItems.filter(item => item.to !== paths.users);
  }
  

  return baseItems;
};

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
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
        {navItems.map(({ label, to, icon }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              component={NavLink}
              to={to as string}
              onClick={() => { if (isSmall && onClose) onClose(); }}
              sx={{
                '&.active': {
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

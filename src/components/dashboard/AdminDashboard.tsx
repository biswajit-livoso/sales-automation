import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { People, TrendingUp, AttachMoney, Assignment, Visibility, Add } from '@mui/icons-material';
import { useVisits } from '../../context/visitContext';
import { useAuth } from '../../context/authContext';

interface AdminDashboardProps {
  onViewUser?: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewUser }) => {
  const systemMetrics = [
    { k: 'users' as const, title: 'Total Users', value: '142', icon: People, color: '#2196f3', change: '+5' },
    { k: 'revenue' as const, title: 'Total Revenue', value: '$234,560', icon: AttachMoney, color: '#4caf50', change: '+18%' },
    { k: 'deals' as const, title: 'Active Deals', value: '89', icon: Assignment, color: '#ff9800', change: '+12' },
    { k: 'conversion' as const, title: 'Conversion Rate', value: '24.1%', icon: TrendingUp, color: '#9c27b0', change: '+2.3%' },
  ];

  // reserved for future status chips

  // Timeframe state
  const [range, setRange] = React.useState<'monthly' | '15days' | 'daily'>('monthly');
  const handleRangeChange = (e: SelectChangeEvent<'monthly' | '15days' | 'daily'>) => {
    setRange(e.target.value as 'monthly' | '15days' | 'daily');
  };

  // Metric values and changes by timeframe
  const metricValues = {
    monthly: { users: '142', revenue: '$234,560', deals: '89', conversion: '24.1%' },
    '15days': { users: '71', revenue: '$117,280', deals: '44', conversion: '12.0%' },
    daily: { users: '5', revenue: '$7,800', deals: '3', conversion: '0.8%' },
  } as const;

  const metricChanges = {
    monthly: { users: '+5', revenue: '+18%', deals: '+12', conversion: '+2.3%' },
    '15days': { users: '+2', revenue: '+7%', deals: '+5', conversion: '+1.0%' },
    daily: { users: '+0.2', revenue: '+0.6%', deals: '+0.3', conversion: '+0.1%' },
  } as const;

  const compareLabelByRange = {
    monthly: 'vs last month',
    '15days': 'vs last 15 days',
    daily: 'vs yesterday',
  } as const;

  const { visits } = useVisits();
  const { users, getUserById } = useAuth();

  const userIdToStats = useMemo(() => {
    const map = new Map<string, { userName: string; totalVisits: number; closedVisits: number; totalOrderItems: number }>();
    users.forEach(u => map.set(u.id, { userName: u.name, totalVisits: 0, closedVisits: 0, totalOrderItems: 0 }));
    visits.forEach(v => {
      const entry = map.get(v.createdBy) || { userName: getUserById(v.createdBy)?.name || v.createdBy, totalVisits: 0, closedVisits: 0, totalOrderItems: 0 };
      entry.totalVisits += 1;
      if (v.status === 'closed') {
        entry.closedVisits += 1;
        if ((v as any).order && Array.isArray((v as any).order)) {
          entry.totalOrderItems += (v as any).order.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 0), 0);
        }
      }
      map.set(v.createdBy, entry);
    });
    return Array.from(map.entries()).map(([userId, data]) => ({ userId, ...data }));
  }, [users, visits, getUserById]);


  return (
    <Box sx={{ p: 3 }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Add User
          </Button>
        </Box>
      </Box>
      {/* System Metrics */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 ,gap: 2}}> <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="admin-timeframe-label">Timeframe</InputLabel>
        <Select
          labelId="admin-timeframe-label"
          label="Timeframe"
          value={range}
          onChange={handleRangeChange}
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="15days">15 Days</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
        </Select>
      </FormControl>
      <Button
            variant="contained"
            // startIcon={<Add />}
            color='success'
            sx={{ borderRadius: 2 }}
          >
           Export Data
          </Button>
      </Box>
      <Box sx={{ mb: 4, width: '100%', display: "grid", gridTemplateColumns: { md: "repeat(4, 1fr) ", xs: "repeat(1, 1fr)" }, gap: 2 }}>
        {systemMetrics.map((metric) => (
          // <Grid item xs={12} sm={6} md={3} key={index}>
          <div key={metric.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: metric.color,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <metric.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {metricValues[range][metric.k]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>
                    {metricChanges[range][metric.k]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {compareLabelByRange[range]}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
        {/* </Grid> */}
      </Box>

      {/* Users Table */}
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Users Overview
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Total Visits</TableCell>
                <TableCell>Closed Visits</TableCell>
                <TableCell>Total Order Items</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userIdToStats.map((row) => (
                <TableRow key={row.userId} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.userName}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.totalVisits}</TableCell>
                  <TableCell>{row.closedVisits}</TableCell>
                  <TableCell>{row.totalOrderItems}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => onViewUser && onViewUser(row.userId)}>
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {userIdToStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
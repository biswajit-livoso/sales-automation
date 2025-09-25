import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import {
    TrendingUp,
    People,
    Assignment,
    AttachMoney,
    Phone,
    Email,
} from '@mui/icons-material';

interface UserDashboardProps {
    onCreateVisit?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onCreateVisit }) => {
    const metrics = [
        { k: 'revenue' as const, title: 'as Revenue', value: '$45,890', icon: AttachMoney, color: '#4caf50', change: '+12%' },
        { k: 'leads' as const, title: 'Active Leads', value: '127', icon: People, color: '#2196f3', change: '+8%' },
        { k: 'deals' as const, title: 'Deals Closed', value: '23', icon: Assignment, color: '#ff9800', change: '+15%' },
        { k: 'conversion' as const, title: 'Conversion Rate', value: '18.2%', icon: TrendingUp, color: '#9c27b0', change: '+3%' },
    ];

    const recentLeads = [
        { id: 1, name: 'John Doe', company: 'Tech Corp', status: 'qualified', value: '$15,000', contact: 'phone' },
        { id: 2, name: 'Sarah Wilson', company: 'Innovation Labs', status: 'contacted', value: '$8,500', contact: 'email' },
        { id: 3, name: 'Mike Johnson', company: 'StartupXYZ', status: 'new', value: '$12,000', contact: 'phone' },
        { id: 4, name: 'Lisa Brown', company: 'Digital Solutions', status: 'proposal', value: '$22,000', contact: 'email' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'primary';
            case 'contacted': return 'warning';
            case 'qualified': return 'info';
            case 'proposal': return 'secondary';
            default: return 'default';
        }
    };

    // Timeframe state for controlling progress values
    const [range, setRange] = React.useState<'monthly' | '15days' | 'daily'>('daily');
    const handleRangeChange = (e: SelectChangeEvent<'monthly' | '15days' | 'daily'>) => {
        setRange(e.target.value as 'monthly' | '15days' | 'daily');
    };

    const progressMap = {
        monthly: { revenue: 76, leads: 85, deals: 92 },
        '15days': { revenue: 40, leads: 50, deals: 55 },
        daily: { revenue: 8, leads: 12, deals: 15 },
    } as const;
    const currentProgress = progressMap[range];

    // Metrics small cards values and changes by timeframe
    const metricValues = {
        monthly: {
            revenue: '$45,890',
            leads: '127',
            deals: '23',
            conversion: '18.2%',
        },
        '15days': {
            revenue: '$22,945',
            leads: '64',
            deals: '11',
            conversion: '9.1%',
        },
        daily: {
            revenue: '$1,530',
            leads: '5',
            deals: '1',
            conversion: '0.6%',
        },
    } as const;

    const metricChanges = {
        monthly: {
            revenue: '+12%',
            leads: '+8%',
            deals: '+15%',
            conversion: '+3%',
        },
        '15days': {
            revenue: '+5%',
            leads: '+3%',
            deals: '+7%',
            conversion: '+1%',
        },
        daily: {
            revenue: '+0.4%',
            leads: '+0.6%',
            deals: '+0.9%',
            conversion: '+0.2%',
        },
    } as const;

    const compareLabelByRange = {
        monthly: 'vs last month',
        '15days': 'vs last 15 days',
        daily: 'vs yesterday',
    } as const;

    return (
        <Box sx={{p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Sales Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   
                    <Button variant="contained" color="primary" onClick={() => onCreateVisit && onCreateVisit()}>
                        Create Visit
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 ,gap: 2}}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="timeframe-label">Timeframe</InputLabel>
                        <Select
                            labelId="timeframe-label"
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

            {/* Metrics Cards */}
            <Box  sx={{ mb: 4, display: "grid", width:'100%',
                gridTemplateColumns: {md: "repeat(4, 1fr) ", xs: "repeat(1, 1fr)"},
                gap: 2
             }}>
                {metrics.map((metric) => (
                        <Card key={metric.title} sx={{ height: '100%' }}>
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
                    

            
                ))}
            </Box>

            <  Box  sx={{ mb: 4, display: "flex", width:'100%',
                // gridTemplateColumns: {md: "repeat(2, 1fr) ", xs: "repeat(1, 1fr)"},
                gap: 2
             }}>
                {/* Sales Progress */}          
                {/* <Grid item xs={12} md={4}> */}
                    <Box sx={{ width: '30%'}}>
                    <Card sx={{ height: 'fit-content' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Monthly Target Progress
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Revenue Target</Typography>
                                    <Typography variant="body2">$45,890 / $60,000</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentProgress.revenue}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Leads Target</Typography>
                                    <Typography variant="body2">127 / 150</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentProgress.leads}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Deals Target</Typography>
                                    <Typography variant="body2">23 / 25</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentProgress.deals}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
        </Box>

                {/* </Grid> */}

                {/* Recent Leads */}
                {/* <Grid item xs={12} md={8}> */}
                    <Box sx={{ width: '70%'}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Recent Leads
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Value</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentLeads.map((lead) => (
                                            <TableRow key={lead.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {lead.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{lead.company}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={lead.status}
                                                        color={getStatusColor(lead.status) as any}
                                                        size="small"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>{lead.value}</TableCell>
                                                <TableCell>
                                                    {lead.contact === 'phone' ? (
                                                        <Phone color="primary" sx={{ cursor: 'pointer' }} />
                                                    ) : (
                                                        <Email color="primary" sx={{ cursor: 'pointer' }} />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
        </Box>

                {/* </Grid> */}
            </Box>
        </Box>
    );
};

export default UserDashboard;
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Phone,
  Email,
  Visibility,
} from '@mui/icons-material';

const LeadsView: React.FC = () => {
  const leads = [
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', company: 'Tech Corp', status: 'qualified', value: '$15,000', source: 'Website', assignedTo: 'You' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@innovationlabs.com', company: 'Innovation Labs', status: 'contacted', value: '$8,500', source: 'Referral', assignedTo: 'You' },
    { id: 3, name: 'Mike Johnson', email: 'mike@startupxyz.com', company: 'StartupXYZ', status: 'new', value: '$12,000', source: 'Cold Call', assignedTo: 'You' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@digitalsolutions.com', company: 'Digital Solutions', status: 'proposal', value: '$22,000', source: 'LinkedIn', assignedTo: 'You' },
    { id: 5, name: 'Tom Garcia', email: 'tom@futuretech.com', company: 'FutureTech', status: 'new', value: '$18,500', source: 'Website', assignedTo: 'You' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'contacted': return 'warning';
      case 'qualified': return 'info';
      case 'proposal': return 'secondary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Leads Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Add Lead
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search leads..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined">Filter</Button>
            <Button variant="outlined">Export</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {lead.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.email}
                        </Typography>
                      </Box>
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
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Phone />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Email />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeadsView;
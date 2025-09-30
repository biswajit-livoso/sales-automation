import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { useVisits } from '../../context/visitContext';
import { getUserId } from '../../services/axiosClient';
// import { useAuth } from '../../context/authContext';

interface UserDetailViewProps {
  userId: string;
  onBack?: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ userId }) => {
  const { visits, vendors } = useVisits() as any;
 
  const user = getUserId();

  const userVisits = useMemo(() => visits.filter((v: any) => v.createdBy === userId), [visits, userId]);

  const totalOrderItems = useMemo(
    () => userVisits.reduce((sum: number, v: any) => sum + (Array.isArray(v.order) ? v.order.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0) : 0), 0),
    [userVisits],
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {user || 'User'} — Details
      </Typography>
      <Box  sx={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between', gap: 2 }}>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1">Email: {user}</Typography>
          <Typography variant="body1">Role: {user}</Typography>
          <Typography variant="body1">Department: {user || '—'}</Typography>
          <Typography variant="body1">Total Visits: {userVisits.length}</Typography>
          <Typography variant="body1">Total Order Items: {totalOrderItems}</Typography>
        </CardContent>
      </Card>
      <Box sx={{background: 'none'}}><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.52297962956!2d85.82045315!3d20.300884149999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1758790907563!5m2!1sen!2sin"   loading="lazy"  ></iframe></Box>
      </Box>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Visits
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vendor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Opened</TableCell>
            <TableCell>Closed</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Discussion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userVisits.map((v: any) => (
            <TableRow key={v.id} hover>
              <TableCell>{vendors.find((vn: any) => vn.id === v.vendorId)?.name || v.vendorId}</TableCell>
              <TableCell>
                <Chip size="small" label={v.status} color={v.status === 'closed' ? 'success' : 'warning'} sx={{ textTransform: 'capitalize' }} />
              </TableCell>
              <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
              <TableCell>{v.closedAt ? new Date(v.closedAt).toLocaleString() : '—'}</TableCell>
              <TableCell>
                {Array.isArray(v.order) && v.order.length > 0 ? (
                  v.order.map((it: any, idx: number) => (
                    <Typography key={idx} variant="body2">
                      {it.product} — {it.quantity} {it.unit}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">—</Typography>
                )}
              </TableCell>
              <TableCell sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.discussionSummary}>
                {v.discussionSummary || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserDetailView;



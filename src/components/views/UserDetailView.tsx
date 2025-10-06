import React from 'react';
import { Box, Typography, Card, CardContent,  Chip, IconButton } from '@mui/material';
import type { Visit } from '../../types';
import GlobalTable from '../../reUsableComponents/globalTable/GlobalTable';
import { Edit } from '@mui/icons-material';

interface UserDetailViewProps {
  user: User;
  visits: Visit[];
}
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'ADMIN';
  avatar?: string;
  department?: string;
  joinDate?: string;
  // Optional personal details
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  aadhaar?: string;
  pan?: string;
  rc?: string;
  // Optional structured address
  address?: {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pinCode?: string;
  };
}
const UserDetailView: React.FC<UserDetailViewProps> = ({ user,visits }:UserDetailViewProps) => {
 
  const columns = [
    { label: "Sl No", key: "slNo" },
    { label: "Vendor", key: "vendor", render: (row: any) => row?.vendor?.name },
    { label: "Topic", key: "topic" },
    {
      label: "Start Time",
      key: "startTime",
      render: (row: any) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
    },
    {
      label: "End Time",
      key: "endTime",
      render: (row: any) =>
        row?.endTime ? new Date(row.endTime).toLocaleString() : "-",
    },
    {
      label: "Order",
      key: "order",
      render: (row: any) => {
        row?.order && row.order.length > 0 ? (
          <Box>
            {row.order.map((it: any, idx: any) => (
              <Typography key={idx} variant="body2">
                {it.product} — {it.quantity} {it.unit}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      },
    },
    {
      label: "Payment",
      key: "payment",
      render: (row: any) => {
        row?.payment ? (
          <Box>
            {row?.payment?.amount && (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ₹{row.payment.amount.toFixed(2)}
              </Typography>
            )}
            {row?.payment?.mode && (
              <Chip
                label={row.payment.mode}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5 }}
              />
            )}
            {row?.payment?.referenceId && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Ref: {row?.payment?.referenceId}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      },
    },
    { label: "Discussion Summary", key: "discussionSummary" },
    {
      label: "Actions",
      key: "actions",
      render: () => {
        return (
          <IconButton
            size="small"
            color="primary"
          >
            <Edit />
          </IconButton>
        );
      },
    },
  ];


 

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {user.firstName + " " + user.lastName || 'User'} — Details
      </Typography>
      <Box  sx={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between', gap: 2 }}>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Typography variant="body1">Role: {user.role}</Typography>
          <Typography variant="body1">Department: {user.department || '—'}</Typography>
          <Typography variant="body1">Total Visits: </Typography>
          <Typography variant="body1">Total Order Items: </Typography>
        </CardContent>
      </Card>
      <Box sx={{background: 'none'}}><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.52297962956!2d85.82045315!3d20.300884149999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1758790907563!5m2!1sen!2sin"   loading="lazy"  ></iframe></Box>
      </Box>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Visits
      </Typography>
      <GlobalTable columns={columns} rows={visits} />
    </Box>
  );
};

export default UserDetailView;



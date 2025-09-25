import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@mui/material';
import { useAuth } from '../../context/authContext';

const UsersView: React.FC = () => {
  const { users, addUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [department, setDepartment] = React.useState('');

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) return;
    addUser({ name: name.trim(), email: email.trim(), department: department.trim() || undefined, role: 'user' });
    setOpen(false);
    setName('');
    setEmail('');
    setDepartment('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add User</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Join Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell><Chip size="small" label={u.role} color={u.role === 'admin' ? 'secondary' : 'primary'} /></TableCell>
              <TableCell>{u.department || '—'}</TableCell>
              <TableCell>{u.joinDate || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!name.trim() || !email.trim()}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersView;



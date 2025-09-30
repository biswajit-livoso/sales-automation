import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Table, TableHead, TableRow, TableCell, TableBody, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useVisits } from '../../context/visitContext';
// import { useAuth } from '../../context/authContext';

const VendorsView: React.FC = () => {
  const { vendors, addVendor, updateVendor } = useVisits() as any;
  const  user  = localStorage.getItem('user');
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [eName, setEName] = React.useState('');
  const [eContactName, setEContactName] = React.useState('');
  const [ePhone, setEPhone] = React.useState('');
  const [eEmail, setEEmail] = React.useState('');
  const [eAddress, setEAddress] = React.useState('');

  const handleAdd = () => {
    if (user !== 'ADMIN') return;
    if (!name.trim()) return;
    addVendor({ name: name.trim(), contactName: contactName.trim() || undefined, phone: phone.trim() || undefined, email: email.trim() || undefined, address: address.trim() || undefined });
    setOpen(false);
    setName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const openEdit = (v: any) => {
    if (user !== 'admin') return;
    setEditingId(v.id);
    setEName(v.name || '');
    setEContactName(v.contactName || '');
    setEPhone(v.phone || '');
    setEEmail(v.email || '');
    setEAddress(v.address || '');
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (user !== 'admin' || !editingId) return;
    updateVendor(editingId, {
      name: eName.trim() || undefined,
      contactName: eContactName.trim() || undefined,
      phone: ePhone.trim() || undefined,
      email: eEmail.trim() || undefined,
      address: eAddress.trim() || undefined,
    });
    setEditOpen(false);
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Vendors</Typography>
        {user === 'admin' && (
          <Button variant="contained" onClick={() => setOpen(true)}>Add Vendor</Button>
        )}
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendors.map((v: any) => (
            <TableRow key={v.id} hover>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.contactName || '—'}</TableCell>
              <TableCell>{v.phone || '—'}</TableCell>
              <TableCell>{v.email || '—'}</TableCell>
              <TableCell>{v.address || '—'}</TableCell>
              {user === 'admin' && (
                <TableCell width={60} align="right">
                  <IconButton size="small" onClick={() => openEdit(v)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} fullWidth />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={user !== 'admin' || !name.trim()}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={eName} onChange={(e) => setEName(e.target.value)} fullWidth />
            <TextField label="Contact Name" value={eContactName} onChange={(e) => setEContactName(e.target.value)} fullWidth />
            <TextField label="Phone" value={ePhone} onChange={(e) => setEPhone(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={eEmail} onChange={(e) => setEEmail(e.target.value)} fullWidth />
            <TextField label="Address" value={eAddress} onChange={(e) => setEAddress(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={user !== 'admin' || !eName.trim()}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorsView;



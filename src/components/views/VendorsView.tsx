import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import {
  addVendor,
  deleteVendor,
  getAllVendors,
  updateVendor,
} from "../../services/services";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";

const VendorsView: React.FC = () => {
  const columns = [
    { label: "Sl No", key: "slNo" },
    { label: "Name", key: "name" },
    { label: "Contact Name", key: "contactName" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "GST", key: "gst" },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) =>
        user?.role === "ADMIN" && (
          <>
            <IconButton size="small" color="primary" onClick={() => openEdit(row)}>
              <Edit />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => openDelete(row)}>
              <Delete />
            </IconButton>
          </>
        ),
    },
  ];
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    gst: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (user?.role !== "ADMIN") return;
    const res = await addVendor(form);
    if (res.status === 201) {
      console.log(res.data);
      toast.success(res.data.message || "Vendor added successfully");
    }
    setOpen(false);
    setForm({
      name: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      gst: "",
    });
  };

  const openEdit = (v: any) => {
    if (user?.role !== "ADMIN") return;
    setEditingId(v._id);
    setForm({
      name: v.name || "",
      contactName: v.contactName || "",
      phone: v.phone || "",
      email: v.email || "",
      address: v.address || "",
      gst: v.gst || "",
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (user?.role !== "ADMIN" || !editingId) return;
    const res = await updateVendor(editingId, form);
    if (res.status === 200) {
      toast.success(res.data.message || "Vendor updated successfully");
    }
    setEditOpen(false);
    setEditingId(null);
  };

  const openDelete = async (v: any) => {
    if (user?.role !== "ADMIN") return;
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    const res = await deleteVendor(v._id);
    if (res.status === 200) {
      toast.success(res.data.message || "Vendor deleted successfully");
      getAllVendors().then((res) => {
        setVendors(res.data.result);
      });
    }
  };
  useEffect(() => {
    getAllVendors().then((res) => {
      setVendors(res.data.result);
      console.log(res.data.result);
    });
  }, [open, editOpen]);
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Vendors
        </Typography>
        {user?.role === "ADMIN" && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Vendor
          </Button>
        )}
      </Box>

      <GlobalTable columns={columns} rows={vendors} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Contact Name"
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              fullWidth
            />
            <TextField
              label="GST"
              value={form.gst}
              onChange={(e) => setForm({ ...form, gst: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={user?.role !== "ADMIN" || !form.name.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Contact Name"
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              fullWidth
            />
            <TextField
              label="GST"
              value={form.gst}
              onChange={(e) => setForm({ ...form, gst: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            // disabled={user?.role !== "ADMIN" || !form.name.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorsView;

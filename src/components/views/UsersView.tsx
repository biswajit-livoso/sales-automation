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
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
// import { useAuth } from "../../context/authContext";

import { allUsers, register } from "../../services/services";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { useAuth } from "../../context/authContext";
import { Delete, Edit } from "@mui/icons-material";

const UsersView: React.FC = () => {
    const { user } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    phone: "",
    dob: "",
    aadhaar: "",
    pan: "",
    rc: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pinCode: "",
    },
  });
  const columns = [
    { label: "Sl No", key: "slNo" },
    {
      label: "Name",
      key: "name",
      render: (row: any) => `${row.firstName} ${row.lastName}`,
    },
    { label: "Email", key: "email" },
    { label: "Role", key: "role", render: (row: any) => <Chip label={row.role} color={row.role === "ADMIN" ? "secondary" : "primary"} size="small" /> },
    { label: "Department", key: "department", render: (row: any) => row.department || "—" },
    { label: "Join Date", key: "joinDate", render: (row: any) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—" },
    { label: "Actions", key: "actions",render: () =>
      user?.role === "ADMIN" && (
        <>
          <IconButton size="small" color="primary" onClick={() => alert('Functionality not implemented')}>
            <Edit />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => alert('Functionality not implemented')}>
            <Delete />
          </IconButton>
        </>
      ), },
  ];
  const handleAddressChange = (
    key: keyof typeof form.address,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [key]: value },
    }));
  };

  const handleAdd = async () => {
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(form));

      const res = await register(fd); // ✅ Await the response
      console.log(res);

      toast.success("User added successfully");

      // Reset form and close modal AFTER success
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        phone: "",
        dob: "",
        aadhaar: "",
        pan: "",
        rc: "",
        address: {
          street: "",
          city: "",
          district: "",
          state: "",
          country: "",
          pinCode: "",
        },
      });

      setOpen(false); // ✅ Only close after successful add
    } catch (error: any) {
      console.log(error);

      // Show meaningful error message
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await allUsers();
        console.log(res.data.result);
        setUsers(res.data.result);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchMe(); // Call the async function
  }, [open]);

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
          Users
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add User
        </Button>
      </Box>
      <GlobalTable columns={columns} rows={users} />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name *"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Last Name *"
                value={form.lastName || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                fullWidth
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Department"
              value={form.department}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, department: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Phone"
              value={form.phone || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={form.dob || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dob: e.target.value }))
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Aadhaar"
              value={form.aadhaar || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, aadhaar: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="PAN"
              value={form.pan || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pan: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="RC"
              value={form.rc || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rc: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Street"
              value={form.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="City"
                value={form.address?.city || ""}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="District"
                value={form.address?.district || ""}
                onChange={(e) =>
                  handleAddressChange("district", e.target.value)
                }
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="State"
                value={form.address?.state || ""}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={form.address?.country || ""}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Pin Code"
              value={form.address?.pinCode || ""}
              onChange={(e) => handleAddressChange("pinCode", e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={
              !form.firstName?.trim() ||
              !form.lastName?.trim() ||
              !form.email.trim() ||
              !form.phone.trim() ||
              !form.dob.trim()
            }
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersView;

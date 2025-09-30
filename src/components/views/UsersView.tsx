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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
} from "@mui/material";
// import { useAuth } from "../../context/authContext";

import { allUsers,  register } from "../../services/services";
import { toast } from "react-toastify";

const UsersView: React.FC = () => {
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
        error?.response?.data?.message || error.message || "Something went wrong";
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
        {[...users].reverse().map((u: any) => (
          <TableRow key={u._id} hover>
            <TableCell>{`${u.firstName} ${u.lastName}`}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>
              <Chip
                size="small"
                label={u.role}
                color={u.role === "ADMIN" ? "secondary" : "primary"}
              />
            </TableCell>
            <TableCell>{u.department || "—"}</TableCell>
            <TableCell>
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

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

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
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { allUsers, register } from "../../services/services";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { useAuth } from "../../context/authContext";

const UsersView: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(false);
  const [loading, setLoading] = useState(false);
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
    aadhaarImage: null as File | null,
    panImage: null as File | null,
    rcImage: null as File | null,
  });

  const columns = [
    { label: "Sl No", key: "slNo" },
    {
      label: "Name",
      key: "name",
      render: (row: any) => `${row.firstName} ${row.lastName}`,
    },
    { label: "Email", key: "email" },
    {
      label: "Role",
      key: "role",
      render: (row: any) => (
        <Chip
          label={row.role}
          color={row.role === "ADMIN" ? "secondary" : "primary"}
          size="small"
        />
      ),
    },
    {
      label: "Department",
      key: "department",
      render: (row: any) => row.department || "—",
    },
    {
      label: "Join Date",
      key: "joinDate",
      render: (row: any) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
    },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) =>
        user?.role === "ADMIN" && (
          <>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(row)}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row._id)}
            >
              <Delete />
            </IconButton>
          </>
        ),
    },
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

  const handleFileChange = (
    key: "aadhaarImage" | "panImage" | "rcImage",
    file: File | null
  ) => {
    setForm((prev) => ({ ...prev, [key]: file }));
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(form));
      if (form.aadhaarImage) fd.append("aadhaar", form.aadhaarImage);
      if (form.panImage) fd.append("pan", form.panImage);
      if (form.rcImage) fd.append("rc", form.rcImage);
      const res = await register(fd);
      if (res?.data?.success) {
        setLoading(false);
        toast.success(res.data.message || "User added successfully");
      }

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
        aadhaarImage: null,
        panImage: null,
        rcImage: null,
      });

      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };
  const handleEdit = (userData: any) => {
    setEdit(true);
    setForm({
      ...form,
      ...userData,
      address: userData.address || {
        street: "",
        city: "",
        district: "",
        state: "",
        country: "",
        pinCode: "",
      },
      aadhaarImage: null,
      panImage: null,
      rcImage: null,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(form));
      if (form.aadhaarImage) fd.append("aadhaar", form.aadhaarImage);
      if (form.panImage) fd.append("pan", form.panImage);
      if (form.rcImage) fd.append("rc", form.rcImage);

      // const res = await updateUser(form._id, fd);
      // if (res?.data?.success) {
      //   toast.success(res.data.message || "User updated successfully");
      //   setOpen(false);
      //   setEdit(false);
      //   const refresh = await allUsers();
      //   setUsers(refresh.data.result);
      // }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id)
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      // const res = await deleteUser(id);
      // if (res?.data?.success) {
      //   toast.success("User deleted successfully");
      //   setUsers((prev) => prev.filter((u) => u._id !== id));
      // }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await allUsers();
        setUsers(res.data.result);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchMe();
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

      <GlobalTable columns={columns} rows={users} loading={loading} />

      <Dialog
        open={edit || open}
        onClose={() => {
          setOpen(false);
          setEdit(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle> {edit ? "Update" : "Add"} User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name *"
                value={form.firstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Last Name *"
                value={form.lastName}
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
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dob: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Aadhaar"
              value={form.aadhaar}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, aadhaar: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="PAN"
              value={form.pan}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pan: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="RC"
              value={form.rc}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rc: e.target.value }))
              }
              fullWidth
            />

            {/* ✅ Image Upload Section */}
            <Typography variant="subtitle1" fontWeight={600} mt={1}>
              Upload Documents
            </Typography>
            <Stack spacing={1}>
              <Button variant="outlined" component="label">
                Upload Aadhaar Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      "aadhaarImage",
                      e.target.files?.[0] || null
                    )
                  }
                />
              </Button>
              {form.aadhaarImage && (
                <Box sx={{ width: "100%" }}>
                  <a
                    href={URL.createObjectURL(form.aadhaarImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip label={form.aadhaarImage.name} color="success" />
                  </a>
                </Box>
              )}

              <Button variant="outlined" component="label">
                Upload PAN Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("panImage", e.target.files?.[0] || null)
                  }
                />
              </Button>
              {form.panImage && (
                <Box sx={{ width: "100%" }}>
                  <a
                    href={URL.createObjectURL(form.panImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip label={form.panImage.name} color="success" />
                  </a>
                </Box>
              )}

              <Button variant="outlined" component="label">
                Upload RC Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("rcImage", e.target.files?.[0] || null)
                  }
                />
              </Button>
              {form.rcImage && (
                <Box sx={{ width: "100%" }}>
                  <a
                    href={URL.createObjectURL(form.rcImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip label={form.rcImage.name} color="success" />
                  </a>
                </Box>
              )}
            </Stack>

            {/* ✅ Address */}
            <TextField
              label="Street"
              value={form.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="City"
                value={form.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="District"
                value={form.address.district}
                onChange={(e) =>
                  handleAddressChange("district", e.target.value)
                }
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="State"
                value={form.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={form.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Pin Code"
              value={form.address.pinCode}
              onChange={(e) => handleAddressChange("pinCode", e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={edit ? handleUpdate : handleAdd}
            variant="contained"
            disabled={
              !form.firstName?.trim() ||
              !form.lastName?.trim() ||
              !form.email.trim() ||
              !form.phone.trim() ||
              !form.dob.trim()
            }
          >
            {loading
              ? edit
                ? "Updating..."
                : "Adding..."
              : edit
              ? "Update User"
              : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersView;

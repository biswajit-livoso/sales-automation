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
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import {
  addParty,
  
  deleteParty,
  
  getAllParties,
  updateParty,
  
} from "../../services/services";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";

interface Vendor {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  pinCode: string;
  gst: string;
  noLimit: boolean;
  creditLimit: string;
  openingBalance: string;
  type: string;
}

const PartyView: React.FC = () => {
  const { user } = useAuth();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Supplier" | "Customer">(
    "Supplier"
  );

  const [form, setForm] = useState<Vendor>({
    name: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    pinCode: "",
    gst: "",
    creditLimit: "",
    openingBalance: "",
    noLimit: false,
    type: "",
  });

  /** TABLE COLUMNS */
  const columns = [
    { label: "Sl No", key: "slNo", width: "5%" },
    { label: "Name", key: "name", width: "15%" },
    { label: "Contact Name", key: "contactName" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address", width: "10%" },
    { label: "GST", key: "gst" },
    { label: "Credit Limit", key: "creditLimit" },
    { label: "Opening Balance", key: "openingBalance" },
    { label: "Party Type", key: "type" },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) =>
        user?.role === "ADMIN" && (
            <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => openEdit(row)}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <Delete />
            </IconButton>
          </Box>
        ),
    },
  ];

  /** LOAD DATA */
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getAllParties();
      if (res?.data?.result) {
        setVendors(res.data.result);
      } else {
        toast.warn("No vendor data found.");
      }
    } catch (err) {
      toast.error("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  /** OPEN DIALOG FOR ADD */
  const openAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      state: "",
      pinCode: "",
      address: "",
      gst: "",
      creditLimit: "",
      openingBalance: "",
      type: "",
      noLimit: false,
    });
    setDialogOpen(true);
  };

  /** OPEN DIALOG FOR EDIT */
  const openEdit = (vendor: Vendor) => {
    setIsEditMode(true);
    setEditingId(vendor._id || null);
    setForm({
      name: vendor.name || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      address: vendor.address || "",
      state: vendor.state || "",
      pinCode: vendor.pinCode || "",
      noLimit: vendor.noLimit || false,
      gst: vendor.gst || "",
      creditLimit: vendor.creditLimit || "",
      openingBalance: vendor.openingBalance || "",
      type: vendor.type || "",
    });
    setDialogOpen(true);
  };

  /** ADD OR UPDATE */
  const handleSubmit = async () => {
    if (user?.role !== "ADMIN") return;
    const payload = {
      ...form,
      type: activeTab === "Supplier" ? "SUPPLIER" : "CUSTOMER",
    };
      console.log(payload);
    try {
      if (isEditMode && editingId) {
        const res = await updateParty(editingId, payload);
        if (res.status === 200) {
          toast.success(res.data.message || "Vendor updated successfully");
        }
      } else {
        const res = await addParty(payload);
        if (res.status === 201) {
          toast.success(res.data.message || "Vendor added successfully");
        }
      }
      fetchVendors();
      handleCloseDialog();
    } catch {
      toast.error(`Failed to ${isEditMode ? "update" : "add"} vendor.`);
    }
  };

  /** DELETE VENDOR */
  const handleDelete = async (vendor: Vendor) => {
    if (user?.role !== "ADMIN") return;
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const res = await deleteParty(vendor._id || "");
      if (res.status === 200) {
        toast.success(res.data.message || "Vendor deleted successfully");
        fetchVendors();
      }
    } catch {
      toast.error("Failed to delete vendor.");
    }
  };

  /** FILTERED LIST */
  const filteredVendors = vendors.filter(
    (v) => v.type === activeTab.toUpperCase()
  );

  /** CLOSE DIALOG */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /** FORM INPUTS */
  const renderFormFields = () => {
    const fields = [
      "name",
      "phone",
      "email",
      "address",
      "state",
      "pinCode",
      "gst",
      "creditLimit",
      "openingBalance",
    ];

    return fields.map((field) => (
      <TextField
        key={field}
        label={field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())}
        type={
          ["creditLimit", "openingBalance", "phone", "pinCode"].includes(field)
            ? "number"
            : "text"
        }
        value={(form as any)[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        fullWidth
      />
    ));
  };

  /** UI */
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
          Party
        </Typography>

        {user?.role === "ADMIN" && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {["Supplier", "Customer"].map((tab) => (
              <Box
                key={tab}
                sx={{
                  border: "1px solid",
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === tab ? "primary.main" : "transparent",
                  color: activeTab === tab ? "white" : "inherit",
                  transition: "0.3s",
                }}
                onClick={() => setActiveTab(tab as "Supplier" | "Customer")}
              >
                {tab}
              </Box>
            ))}

            <Button variant="contained" onClick={openAdd}>
              Add {activeTab}
            </Button>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <GlobalTable
          columns={columns}
          rows={filteredVendors}
          loading={loading}
        />
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditMode ? "Edit Vendor" : `Add ${activeTab}`}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {renderFormFields()}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name.trim()}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartyView;

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  addPurchase,
  updatePurchase, // 👈 NEW
  getAllParties,
  getAllProducts,
} from "../../services/services";
import { toast } from "react-toastify";

interface Item {
  item: string;
  name: string;
  description?: string;
  mrp: string;
  size: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  taxInclusive?: boolean;
  discount: string;
  taxPercent: string;
  taxAmount: string;
  total: string;
  manufactureDate: string;
  expiryDate: string;
  product: string;
  price: string;
}

interface PurchasesViewProps {
  supplier: string;
  purchaseDate: string;
  image?: string;
  document?: string;
  items: Item[];
  totalPrice: string;
  additionalCharge?: string;
  roundOff: string;
  grTotal: string;
  paymentType: string;
  paidAmount: string;
  saveType: "DRAFT" | "FINAL";
  _id?: string; // 👈 for editing
}

interface CreatePurchasesProps {
  editData?: any; // 👈 optional prop
  onBack?: () => void; // optional callback after saving
}

const CreatePurchases: React.FC<CreatePurchasesProps> = ({ editData, onBack }) => {
  const [form, setForm] = useState<PurchasesViewProps>(
    editData || {
      supplier: "",
      purchaseDate: "",
      items: [
        {
          manufactureDate: "",
          expiryDate: "",
          product: "",
          quantity: "",
          price: "",
          total: "",
          item: "",
          name: "",
          description: "",
          mrp: "",
          size: "",
          unit: "",
          pricePerUnit: "",
          taxInclusive: false,
          discount: "",
          taxPercent: "",
          taxAmount: "",
        },
      ],
      totalPrice: "",
      additionalCharge: "",
      roundOff: "",
      grTotal: "",
      paymentType: "",
      paidAmount: "",
      saveType: "DRAFT",
    }
  );

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getAllParties().then((response) => setSuppliers(response.data.result || []));
    getAllProducts().then((response) => setProducts(response.data.result || []));
  }, []);

  useEffect(() => {
    if (editData) setForm(editData); // 👈 Prefill form if editing
  }, [editData]);

  const filteredSuppliers = suppliers.filter((sup: any) => sup.type === "SUPPLIER");

  const handleItemChange = <K extends keyof Item>(
    index: number,
    key: K,
    value: Item[K]
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index][key] = value;

    if (key === "product") {
      const selectedProduct = products.find((p) => p.name === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          item: selectedProduct._id,
          name: selectedProduct.name,
          description: selectedProduct.description || "",
          mrp: selectedProduct.mrp?.toString() || "",
          discount: selectedProduct.discount?.toString() || "",
          taxPercent: selectedProduct.tax?.toString() || "",
          pricePerUnit: selectedProduct.wholesalePrice?.toString() || "",
          taxInclusive: selectedProduct.taxInclusive || false,
        };
      }
    }

    // Auto-calculate totals
    const qty = Number(updatedItems[index].quantity) || 0;
    const price = Number(updatedItems[index].pricePerUnit) || 0;
    const discount = Number(updatedItems[index].discount) || 0;
    const taxPercent = Number(updatedItems[index].taxPercent) || 0;

    let total = qty * price;
    total -= (total * discount) / 100;
    const taxAmount = (total * taxPercent) / 100;
    total += taxAmount;

    updatedItems[index].taxAmount = taxAmount.toFixed(2);
    updatedItems[index].total = total.toFixed(2);

    setForm({ ...form, items: updatedItems });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.supplier) newErrors.supplier = "Supplier is required";
    if (!form.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("data", JSON.stringify(form));

    // const action = editData ? updatePurchase : addPurchase; // 👈 choose API

    (editData
      ? updatePurchase(editData._id, fd)
      : addPurchase(fd)
    )
      .then((response: any) => {
        toast.success(editData ? response.data.message || `Purchase updated! ` : response.data.message || `P0urchase added!`);
        if (onBack) onBack();
      })
      .catch(() => toast.error("Failed to save purchase"));
  };
 const addNewItem = () => { setForm({ ...form, items: [ ...form.items, { manufactureDate: "", expiryDate: "", product: "", quantity: "", price: "", total: "", item: "", name: "", description: "", mrp: "", size: "", unit: "", pricePerUnit: "", taxInclusive: false, discount: "", taxPercent: "", taxAmount: "", }, ], }); };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Purchases
        </Typography>
        <Button variant="contained" color="primary">
          New Purchase
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Supplier */}
        <Autocomplete
          value={filteredSuppliers.find((s) => s._id === form.supplier) || null}
          onChange={(_, newValue) => setForm({ ...form, supplier: newValue?._id || "" })}
          options={filteredSuppliers}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier"
              fullWidth
              error={!!errors.supplier}
              helperText={errors.supplier || ""}
            />
          )}
        />

        {/* Purchase Date */}
        <TextField
          label="Purchase Date"
          type="date"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.purchaseDate}
          helperText={errors.purchaseDate || ""}
        />

        {/* Items */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Items
        </Typography>
        {form.items.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 2,
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              mt: 1,
            }}
          >
            {/* Product */}
            <Autocomplete
              value={item.product}
              onChange={(_, newValue) => handleItemChange(index, "product", newValue || "")}
              options={products.map((p) => p.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  fullWidth
                  error={!!errors[`product-${index}`]}
                  helperText={errors[`product-${index}`] || ""}
                />
              )}
            />
            <TextField label="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
            <TextField label="MRP" type="number" value={item.mrp} onChange={(e) => handleItemChange(index, "mrp", e.target.value)} />
            <TextField
              label="Price Per Unit"
              type="number"
              value={item.pricePerUnit}
              error={!!errors[`price-${index}`]}
              helperText={errors[`price-${index}`] || ""}
              onChange={(e) => handleItemChange(index, "pricePerUnit", e.target.value)}
            />
            <TextField label="Discount (%)" type="number" value={item.discount} onChange={(e) => handleItemChange(index, "discount", e.target.value)} />
            <TextField label="Tax (%)" type="number" value={item.taxPercent} onChange={(e) => handleItemChange(index, "taxPercent", e.target.value)} />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              error={!!errors[`quantity-${index}`]}
              helperText={errors[`quantity-${index}`] || ""}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            />
            <TextField label="Tax Amount" type="number" value={item.taxAmount} InputProps={{ readOnly: true }} />
            <TextField label="Total" type="number" value={item.total} InputProps={{ readOnly: true }} />
            <TextField
            label="Manufacture Date"
            type="date"
            value={item.manufactureDate}
            onChange={(e) => handleItemChange(index, "manufactureDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Expiry Date"
            type="date"
            value={item.expiryDate}
            onChange={(e) => handleItemChange(index, "expiryDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="h6" sx={{ mt: 3 }}>
            unit {item.unit}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="payment-type-label">Size</InputLabel>
            <Select
              labelId="payment-type-label"
              value={item.size}
              label="Size"
              onChange={(e) => handleItemChange(index, "size", e.target.value)}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                const updatedItems = form.items.filter((_, i) => i !== index);
                setForm({ ...form, items: updatedItems });
              }}
            >
              Remove
            </Button>
          </Box>
        ))}

        <Button onClick={addNewItem} sx={{ mt: 1 }} variant="outlined">
          + Add Another Item
        </Button>

        {/* Totals */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField label="Total Price" value={form.totalPrice} type="number" fullWidth onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} />
          <TextField label="Additional Charge" value={form.additionalCharge} type="number" fullWidth onChange={(e) => setForm({ ...form, additionalCharge: e.target.value })} />
          <TextField label="Round Off" value={form.roundOff} type="number" fullWidth onChange={(e) => setForm({ ...form, roundOff: e.target.value })} />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField label="Grand Total" fullWidth value={form.grTotal} type="number" onChange={(e) => setForm({ ...form, grTotal: e.target.value })} />
          <TextField fullWidth label="Paid Amount" value={form.paidAmount} type="number" onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel id="payment-type-label">Payment Type</InputLabel>
            <Select
              labelId="payment-type-label"
              value={form.paymentType}
              label="Payment Type"
              onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit">Credit Card</MenuItem>
              <MenuItem value="debit">Debit Card</MenuItem>
            </Select>
          </FormControl>
          
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePurchases;
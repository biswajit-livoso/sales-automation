import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  addCategory,
} from "../../services/services";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { QUANTITY_OPTIONS } from "../../utils/ConstantDatas";

const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [unitSelection, setUnitSelection] = useState({
    baseUnit: "",
    secondaryUnit: "",
    conversionRate: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
  const [openAddUnitsDialog, setOpenAddUnitsDialog] = useState(false);
  const [productType, setProductType] = useState<"PRODUCT" | "SERVICE">(
    "PRODUCT"
  );

  // Liquor category and subcategory options
  const columns = [
    { label: "Sl No", key: "slNo" },
    { label: "Name", key: "name" },
    {
      label: "MRP",
      key: "mrp",
      render: (row: any) => (
        <span style={{ fontWeight: "bold" }}>₹{row.mrp}</span>
      ),
    },
    { label: "Stock", key: "stock" },
    { label: "Category", key: "category" },
    { label: "Sub Category", key: "subCategory" },
    {
      label: "Status",
      key: "status",
      render: (row: any) => (
        <>
          {" "}
          <Chip
            label={row.status === "active" ? "Active" : "Inactive"}
            color={row.status === "active" ? "success" : "default"}
            size="small"
            onClick={() => toggleStatus(row.id, row.status)}
            clickable
          />
        </>
      ),
    },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" onClick={() => openEdit(row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row._id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  type ProductForm = {
    name: string;
    stock: string;
    description: string;
    category: string;
    subCategory?: string;
    units: string[];
    status: string;
    hsnCode: string;
    mrp: string;
    discount: string;
    salePrice: string;
    wholesalePrice: string;
    purchasePrice: string;
    tax: string;
    taxInclusive: boolean;
    trackInventory: boolean;
    reorderLevel: string;
    type: string;
    baseUnit?: string;
    secondaryUnit?: string;
    conversionRate?: string;
    image?: string;
  };

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    type: productType,
    category: "",
    subCategory: "",
    image: "",
    units: [],
    status: "active",
    hsnCode: "",
    mrp: "",
    discount: "",
    salePrice: "",
    wholesalePrice: "",
    purchasePrice: "",
    tax: "",
    taxInclusive: false,
    trackInventory: false,
    reorderLevel: "",
    stock: "",
  });

  const canSubmit =
    form.name.trim().length > 0 && unitSelection.baseUnit.trim().length > 0;

  const handleOpenAdd = () => {
    setForm({
      name: "",
      description: "",
      type: productType,
      category: "",
      subCategory: "",
      units: [],
      status: "active",
      hsnCode: "",
      mrp: "",
      discount: "",
      salePrice: "",
      wholesalePrice: "",
      purchasePrice: "",
      tax: "",
      taxInclusive: false,
      trackInventory: false,
      reorderLevel: "",
      stock: "",
      image: "",
    });
    setIsEdit(false);
    setEditId(null);
    setOpenDialog(true);
  };
  const openEdit = (product: any) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      type: product.type || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      units: Array.isArray(product.units) ? product.units : [],
      status: product.status || "active",
      hsnCode: product.hsnCode || "",
      mrp: product.mrp || 0,
      discount: product.discount || 0,
      salePrice: product.salePrice || 0,
      wholesalePrice: product.wholesalePrice || 0,
      purchasePrice: product.purchasePrice || 0,
      tax: product.tax || 0,
      taxInclusive: product.taxInclusive || false,
      trackInventory: product.trackInventory || false,
      reorderLevel: product.reorderLevel || 0,
      stock: product.stock || "",
      image: product.image || "",
    });
    setIsEdit(true);
    setEditId(product._id);
    setOpenDialog(true);
  };

  const activeCount = useMemo(
    () => products.filter((p) => p.status === "active").length,
    [products]
  );

  const toggleStatus = async (id: string, currentStatus: string) => {
    const updatedStatus = currentStatus === "active" ? "inactive" : "active";
    await updateProduct(id, { status: updatedStatus });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: updatedStatus } : p))
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);

    const productData = {
      ...form,
      units: `1 ${unitSelection.baseUnit}=${unitSelection.conversionRate}  ${unitSelection.secondaryUnit}`,
    };
console.log(productData);
    try {
      let res;

      if (isEdit && editId) {
        const fd = new FormData();
        fd.append("data", JSON.stringify(productData));
        if (form.image) {
          fd.append("image", form.image);
        }
        res = await updateProduct(editId, fd);
        if (res.status === 200) {
          toast.success("Product updated successfully");
        }
      } else {
        const fd = new FormData();
        fd.append("data", JSON.stringify(productData));
        if (form.image) {
          fd.append("image", form.image);
        }
        res = await addProduct(fd);
        if (res.status === 201) {
          toast.success("Product added successfully");
        }
      }

      // Refresh list
      const productsRes = await getAllProducts();
      setProducts(productsRes.data.result);

      // Reset & close dialog
      setOpenDialog(false);
      setEditId(null);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const saved = await deleteProduct(id);
      if (saved.status === 200) {
        toast.success("Product deleted successfully");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddCategory = async () => {
    const res = await addCategory({ name: newCategory });
    try {
      if (res.status === 201) {
        toast.success("Category added successfully");
        setNewCategory("");
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data.result);
        setOpenAddCategoryDialog(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data.result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);
  const handleFileChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imageFile: file, image: url }));
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Products
      </Typography>
      <Button variant="contained" onClick={handleOpenAdd} sx={{ mb: 2 }}>
        Add Product
      </Button>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Add Product
          </Typography>

          <Stack spacing={2}>
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={productType}
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setProductType(newValue);
                  setForm((prevForm) => ({
                    ...prevForm,
                    type: newValue,
                  }));
                }
              }}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="PRODUCT">Product</ToggleButton>
              <ToggleButton value="SERVICE">Service</ToggleButton>
            </ToggleButtonGroup>

            {/* Row 1: Name, Description, HSN Code */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
              />
              {productType === "PRODUCT" && (
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  fullWidth
                />
              )}
              <TextField
                label="HSN Code"
                value={form.hsnCode}
                onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
                fullWidth
              />
            </Stack>
            {/* Row 5: Subcategory, Type */}
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <Autocomplete
                value={form.category}
                onChange={(_, newValue) => {
                  setForm({ ...form, category: newValue });
                }}
                options={[
                  ...categories.map((cat: any) => {
                    return cat.name;
                  }),
                  "__add_new__",
                ]}
                renderInput={(params) => (
                  <TextField {...params} label="Category" fullWidth />
                )}
                renderOption={(props, option) => {
                  if (option === "__add_new__") {
                    return (
                      <>
                        {/* <li {...props} key="add-new-option"> */}
                        <Box sx={{ width: "100%", textAlign: "center" }}>
                          <Button
                            fullWidth
                            color="primary"
                            size="small"
                            onClick={() => setOpenAddCategoryDialog(true)}
                          >
                            + Add New Category
                          </Button>
                        </Box>
                      </>
                    );
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
                fullWidth
                disableClearable
              />
              <Box>
                <Dialog
                  open={openAddCategoryDialog}
                  onClose={() => setOpenAddCategoryDialog(false)}
                >
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Category Name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      type="text"
                      fullWidth
                      variant="standard"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenAddCategoryDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleAddCategory()}>Add</Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => setOpenAddUnitsDialog(true)}
                >
                  Select Units
                </Button>
                {unitSelection.baseUnit && (
                  <Chip
                    label={`1 ${unitSelection.baseUnit}=${unitSelection.conversionRate}  ${unitSelection.secondaryUnit}`}
                  />
                )}
              </Box>
              <Dialog
                open={openAddUnitsDialog}
                onClose={() => setOpenAddUnitsDialog(false)}
              >
                <DialogTitle>Add Units</DialogTitle>
                <DialogContent>
                  <Stack
                    sx={{
                      m: 2,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      minWidth: 500,
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    {" "}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Base Unit
                      </InputLabel>
                      <Select
                        value={unitSelection.baseUnit}
                        onChange={(e) =>
                          setUnitSelection({
                            ...unitSelection,
                            baseUnit: e.target.value,
                          })
                        }
                        label="Base Unit"
                        // onChange={handleChange}
                      >
                        {QUANTITY_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Secondary Unit
                      </InputLabel>

                      <Select
                        value={unitSelection.secondaryUnit}
                        onChange={(e) =>
                          setUnitSelection({
                            ...unitSelection,
                            secondaryUnit: e.target.value,
                          })
                        }
                        label="Secondary Unit"
                      >
                        {QUANTITY_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  {unitSelection.baseUnit && unitSelection.secondaryUnit && (
                    <Stack>
                      <Typography variant="h6" gutterBottom>
                        Conversion Rate:
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>1 {unitSelection.baseUnit} =</Typography>
                        <TextField
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          value={unitSelection.conversionRate}
                          onChange={(e) =>
                            setUnitSelection({
                              ...unitSelection,
                              conversionRate: e.target.value,
                            })
                          }
                        />
                        <Typography>{unitSelection.secondaryUnit}</Typography>
                      </Box>
                    </Stack>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenAddUnitsDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setOpenAddUnitsDialog(false)}
                    disabled={
                      !unitSelection.conversionRate ||
                      !unitSelection.baseUnit ||
                      !unitSelection.secondaryUnit
                    }
                  >
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            {/* Row 2: MRP, Sale Price, Purchase Price */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="MRP"
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                fullWidth
              />
              {productType === "PRODUCT" && (
                <>
                  {" "}
                  <TextField
                    label="Purchase Price"
                    type="number"
                    value={form.purchasePrice}
                    onChange={(e) =>
                      setForm({ ...form, purchasePrice: e.target.value })
                    }
                    fullWidth
                  />
                  <TextField
                    label="Sale Price"
                    type="number"
                    value={form.salePrice}
                    onChange={(e) =>
                      setForm({ ...form, salePrice: e.target.value })
                    }
                    fullWidth
                  />
                </>
              )}
            </Stack>

            {/* Row 3: Wholesale Price, Discount, Tax */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Discount (%)"
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                fullWidth
              />
              {productType === "PRODUCT" && (
                <>
                  <TextField
                    label="Wholesale Price"
                    type="number"
                    value={form.wholesalePrice}
                    onChange={(e) =>
                      setForm({ ...form, wholesalePrice: e.target.value })
                    }
                    fullWidth
                  />

                  <TextField
                    label="Tax (%)"
                    type="number"
                    value={form.tax}
                    onChange={(e) => setForm({ ...form, tax: e.target.value })}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tax</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={form.taxInclusive.toString()}
                      label="Tax"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          taxInclusive: e.target.value === "true",
                        })
                      }
                    >
                      <MenuItem value="true">With Tax</MenuItem>
                      <MenuItem value="false">Without Tax</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </Stack>

            {/* Row 4: Stock, Reorder Level, Category */}
            {productType === "PRODUCT" ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                }}
              >
                <TextField
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Reorder Level"
                  type="number"
                  value={form.reorderLevel}
                  onChange={(e) =>
                    setForm({ ...form, reorderLevel: e.target.value })
                  }
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.trackInventory}
                      onChange={(e) =>
                        setForm({ ...form, trackInventory: e.target.checked })
                      }
                    />
                  }
                  label="Track Inventory"
                  sx={{ wordBreak: "keep-all" }}
                />
              </Box>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : isEdit ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {products.length} total • {activeCount} active
      </Typography>

      <GlobalTable columns={columns} rows={products} />
    </Box>
  );
};

export default ProductsView;

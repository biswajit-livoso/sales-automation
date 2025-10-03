import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  IconButton,
  ListItem,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../../services/services";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";

const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  // Liquor category and subcategory options
  const columns = [
    { label: "Sl No", key: "slNo" },
    { label: "Name", key: "name" },
    { label: "Category", key: "category" },
    {
      label: "Price",
      key: "price",
      render: (row: any) => (
        <span style={{ fontWeight: "bold" }}>₹{row.price}</span>
      ),
    },
    { label: "Stock", key: "stock" },
    { label: "Category", key: "category" },
    { label: "Sub Category", key: "subCategory" },
    { label: "Status", key: "status", render: (row: any) => <>  <Chip
      label={row.status === "active" ? "Active" : "Inactive"}
      color={row.status === "active" ? "success" : "default"}
      size="small"
      onClick={() => toggleStatus(row.id, row.status)}
      clickable
    />
    </> },
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
  const CATEGORY_OPTIONS = [
    "Whisky",
    "Rum",
    "Vodka",
    "Gin",
    "Brandy",
    "Wine",
    "Beer",
    "Tequila",
    "Liqueur",
  ];
  const SUBCATEGORY_MAP: Record<string, string[]> = {
    Whisky: ["Blended", "Single Malt"],
    Rum: ["Dark", "White", "Spiced"],
    Vodka: ["Plain", "Flavored"],
    Gin: ["London Dry", "Old Tom"],
    Brandy: ["Cognac", "Armagnac"],
    Wine: ["Red", "White", "Rosé", "Sparkling"],
    Beer: ["Lager", "Ale", "Stout", "IPA"],
    Tequila: ["Blanco", "Reposado", "Añejo"],
    Liqueur: ["Herbal", "Fruit", "Cream"],
  };
  type ProductForm = {
    name: string;
    price: string;
    stock: string;
    description: string;
    category: string;
    subCategory: string;
    units: string[];
    status: string;
  };
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: CATEGORY_OPTIONS[0],
    subCategory: SUBCATEGORY_MAP["Whisky"][0],
    units: [],
    status: "active",
  });

  const canSubmit = form.name.trim().length > 0 && form.units.length > 0;

  const handleAdd = async () => {
    if (!canSubmit) return;

    const newProduct = {
      name: form.name.trim(),
      price: form.price ? Number(form.price) : 0,
      stock: form.stock ? Number(form.stock) : 0,
      description: form.description.trim() || undefined,
      category: form.category.trim(),
      subCategory: form.subCategory.trim(),
      units: form.units,
      status: "active",
    };

    const saved = await addProduct(newProduct);
    if (saved.status === 201) {
      toast.success("Product added successfully");
    }
    // setProducts((prev) => [...prev, saved]);

    // Reset fields
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: CATEGORY_OPTIONS[0],
      subCategory: SUBCATEGORY_MAP[CATEGORY_OPTIONS[0]][0],
      units: [],
      status: "active",
    });
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

  const openEdit = (p: any) => {
    console.log(p._id);

    setEditId(p._id);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description || "",
      category:
        p.category && CATEGORY_OPTIONS.includes(p.category)
          ? p.category
          : CATEGORY_OPTIONS[0],
      subCategory:
        p.subCategory && SUBCATEGORY_MAP[p.category]?.includes(p.subCategory)
          ? p.subCategory
          : SUBCATEGORY_MAP[
              p.category && CATEGORY_OPTIONS.includes(p.category)
                ? p.category
                : CATEGORY_OPTIONS[0]
            ][0],
      units: Array.isArray(p.units) ? p.units : [],
      status: p.status || "active",
    });
    setEdit(true);
  };

  const submitEdit = async () => {
    console.log(editId, "1234213");
    if (!editId) return;

    const saved = await updateProduct(editId, {
      name: form.name.trim(),
      price: form.price ? Number(form.price) : 0,
      stock: form.stock ? Number(form.stock) : 0,
      description: form.description.trim() || undefined,
      category: form.category,
      subCategory: form.subCategory,
      units: form.units,
      status: form.status,
    });
    if (saved.status === 200) {
      toast.success("Product added successfully");
    }
    // refresh list and close
    const res = await getAllProducts();
    setProducts(res.data.result);
    setEdit(false);
    setEditId(null);
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data.result);
        console.log(res.data.result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Products
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Add Product
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row", lg: "row" }}
            alignItems={{ sm: "flex-end" }}
            flexWrap="wrap"
          >
            <ListItem>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  width: "100%",
                }}
              >
                {" "}
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  fullWidth
                />
              </Box>
            </ListItem>
            <ListItem>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  width: "100%",
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
                  select
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as string,
                      subCategory: SUBCATEGORY_MAP[e.target.value as string][0],
                    })
                  }
                  fullWidth
                >
                  {CATEGORY_OPTIONS.map((opt: string) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Sub Category"
                  value={form.subCategory}
                  onChange={(e) =>
                    setForm({ ...form, subCategory: e.target.value as string })
                  }
                  fullWidth
                >
                  {SUBCATEGORY_MAP[form.category]?.map((opt: string) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.units.includes("Box")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          units: e.target.checked
                            ? [...form.units, "Box"]
                            : form.units.filter((u) => u !== "Box"),
                        })
                      }
                    />
                  }
                  label="Box"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.units.includes("Pcs")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          units: e.target.checked
                            ? [...form.units, "Pcs"]
                            : form.units.filter((u) => u !== "Pcs"),
                        })
                      }
                    />
                  }
                  label="Pcs"
                />
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  disabled={!canSubmit}
                  fullWidth
                >
                  Add
                </Button>
              </Box>
            </ListItem>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {products.length} total • {activeCount} active
      </Typography>

      <GlobalTable columns={columns} rows={products} />

      <Dialog
        open={edit}
        onClose={() => setEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as string,
                  subCategory: SUBCATEGORY_MAP[e.target.value as string][0],
                })
              }
              fullWidth
            >
              {CATEGORY_OPTIONS.map((opt: string) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sub Category"
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value as string })
              }
              fullWidth
            >
              {SUBCATEGORY_MAP[form.category]?.map((opt: string) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.units.includes("Box")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        units: e.target.checked
                          ? [...form.units, "Box"]
                          : form.units.filter((u) => u !== "Box"),
                      })
                    }
                  />
                }
                label="Box"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.units.includes("Pcs")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        units: e.target.checked
                          ? [...form.units, "Pcs"]
                          : form.units.filter((u) => u !== "Pcs"),
                      })
                    }
                  />
                }
                label="Pcs"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(false)}>Cancel</Button>
          <Button
            onClick={submitEdit}
            variant="contained"
            disabled={!form.name.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsView;

import React, { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Chip, FormControlLabel, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useProducts } from '../../context/productContext';

const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [unitBox, setUnitBox] = useState(true);
  const [unitPcs, setUnitPcs] = useState(true);

  const canSubmit = name.trim().length > 0 && (unitBox || unitPcs);

  const handleAdd = () => {
    if (!canSubmit) return;
    const unitOptions: Array<'box' | 'pcs'> = [
      ...(unitBox ? ['box'] as const : []),
      ...(unitPcs ? ['pcs'] as const : []),
    ];
    addProduct({
      name: name.trim(),
      price: price ? Number(price) : undefined,
      unitOptions,
      active: true,
    });
    setName('');
    setPrice('');
    setUnitBox(true);
    setUnitPcs(true);
  };

  const activeCount = useMemo(() => products.filter(p => p.active).length, [products]);

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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Price (optional)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ minWidth: 180 }} />
            <FormControlLabel control={<Checkbox checked={unitBox} onChange={(e) => setUnitBox(e.target.checked)} />} label="Box" />
            <FormControlLabel control={<Checkbox checked={unitPcs} onChange={(e) => setUnitPcs(e.target.checked)} />} label="Pcs" />
            <Button variant="contained" onClick={handleAdd} disabled={!canSubmit}>
              Add
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {products.length} total • {activeCount} active
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price ? `₹${p.price.toFixed(2)}` : '—'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {p.unitOptions.map(u => (
                      <Chip key={u} label={u} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip label={p.active ? 'Active' : 'Inactive'} color={p.active ? 'success' : 'default'} size="small" onClick={() => updateProduct(p.id, { active: !p.active })} clickable />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => updateProduct(p.id, { active: !p.active })}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteProduct(p.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No products yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductsView;

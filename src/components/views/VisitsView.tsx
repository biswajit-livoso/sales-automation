import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Edit } from '@mui/icons-material';
import { useVisits } from '../../context/visitContext';
import type { PaymentMode, Visit, VisitOrderItem, OrderUnit } from '../../types';
import { useProducts } from '../../context/productContext';

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const paymentModes: PaymentMode[] = ['cash', 'card', 'upi', 'bank-transfer', 'cheque', 'other'];

const VisitsView: React.FC = () => {
  const { vendors, visits, createVisit, closeVisit, updateVisit } = useVisits();

  // Form state
  const [vendorId, setVendorId] = useState('');
  const [topic, setTopic] = useState('');

  // Complete dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [mode, setMode] = useState<PaymentMode | ''>('');
  const [referenceId, setReferenceId] = useState('');
  const [notes, setNotes] = useState('');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editDiscussionSummary, setEditDiscussionSummary] = useState('');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editMode, setEditMode] = useState<PaymentMode | ''>('');
  const [editReferenceId, setEditReferenceId] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editOrderItems, setEditOrderItems] = useState<VisitOrderItem[]>([]);
  const [editProduct, setEditProduct] = useState('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState<OrderUnit>('box');

  // Order capture state
  const [orderItems, setOrderItems] = useState<VisitOrderItem[]>([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<OrderUnit>('box');

  const { products } = useProducts();
  const liquorCatalog = useMemo(() => products.map(p => p.name), [products]);

  // Timer tick for open visits
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const openVisits = useMemo(() => visits.filter(v => v.status === 'open'), [visits, tick]);
  const closedVisits = useMemo(() => visits.filter(v => v.status === 'closed'), [visits]);

  const handleStartVisit = () => {
    if (!vendorId || !topic.trim()) return;
    createVisit(vendorId, topic.trim());
    setTopic('');
  };

  const handleOpenComplete = (v: Visit) => {
    setActiveVisit(v);
    setDiscussionSummary('');
    setAmount('');
    setMode('');
    setReferenceId('');
    setNotes('');
    setOrderItems([]);
    setProduct('');
    setQuantity('');
    setUnit('box');
    setDialogOpen(true);
  };

  const handleCloseVisit = () => {
    if (!activeVisit) return;
    const payload: any = { discussionSummary: discussionSummary.trim() };
    if (orderItems.length > 0) {
      payload.order = orderItems;
    }
    if (amount || mode || referenceId || notes) {
      payload.payment = {
        amount: amount ? Number(amount) : undefined,
        mode: mode || undefined,
        referenceId: referenceId || undefined,
        notes: notes || undefined,
      };
    }
    closeVisit(activeVisit.id, payload);
    setDialogOpen(false);
    setActiveVisit(null);
  };

  const handleAddItem = () => {
    const qty = Number(quantity);
    if (!product.trim() || !qty || qty <= 0) return;
    const newItem: VisitOrderItem = { product: product.trim(), quantity: qty, unit };
    setOrderItems(prev => [...prev, newItem]);
    setProduct('');
    setQuantity('');
    setUnit('box');
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
    setEditDiscussionSummary(visit.discussionSummary || '');
    setEditAmount(visit.payment?.amount?.toString() || '');
    setEditMode(visit.payment?.mode || '');
    setEditReferenceId(visit.payment?.referenceId || '');
    setEditNotes(visit.payment?.notes || '');
    setEditOrderItems(visit.order ? [...visit.order] : []);
    setEditProduct('');
    setEditQuantity('');
    setEditUnit('box');
    setEditDialogOpen(true);
  };

  const handleUpdateVisit = () => {
    if (!editingVisit) return;
    const payload: any = {};
    if (editDiscussionSummary.trim()) {
      payload.discussionSummary = editDiscussionSummary.trim();
    }
    if (editAmount || editMode || editReferenceId || editNotes) {
      payload.payment = {
        amount: editAmount ? Number(editAmount) : undefined,
        mode: editMode || undefined,
        referenceId: editReferenceId || undefined,
        notes: editNotes || undefined,
      };
    }
    if (editOrderItems.length > 0) {
      payload.order = editOrderItems;
    } else {
      payload.order = [];
    }
    updateVisit(editingVisit.id, payload);
    setEditDialogOpen(false);
    setEditingVisit(null);
  };

  const handleEditAddItem = () => {
    const qty = Number(editQuantity);
    if (!editProduct.trim() || !qty || qty <= 0) return;
    const newItem: VisitOrderItem = { product: editProduct.trim(), quantity: qty, unit: editUnit };
    setEditOrderItems(prev => [...prev, newItem]);
    setEditProduct('');
    setEditQuantity('');
    setEditUnit('box');
  };

  const handleEditRemoveItem = (index: number) => {
    setEditOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3 }} >
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Plan a Vendor Visit
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            fullWidth
            label="Vendor"
            value={vendorId}
            onChange={e => setVendorId(e.target.value)}
          >
            {vendors.map(v => (
              <MenuItem key={v.id} value={v.id}>
                {v.name} {v.contactName ? `— ${v.contactName}` : ''}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Topic / Discussion"
            placeholder="What will you discuss?"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleStartVisit}
            disabled={!vendorId || !topic.trim()}
          >
            Start Visit
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Active Visits
        </Typography>
        <Grid container spacing={2}>
          {openVisits.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">No active visits.</Typography>
            </Box>
          )}
          {openVisits.map(v => {
            const elapsed = Date.now() - new Date(v.startedAt).getTime();
            return (
              <div >
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vendor
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {vendors.find(vn => vn.id === v.vendorId)?.name || v.vendorId}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Topic
                    </Typography>
                    <Typography gutterBottom>{v.topic}</Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Started
                    </Typography>
                    <Typography gutterBottom>
                      {new Date(v.startedAt).toLocaleString()}
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ⏱ {formatDuration(elapsed)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button color='warning' onClick={() => handleOpenComplete(v)} variant="outlined">
                      Complete Visit
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recent Closed Visits
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Opened At</TableCell>
                <TableCell>Closed At</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Discussion Summary</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {closedVisits.slice(0, 10).map((visit) => (
                <TableRow key={visit.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vendors.find(vn => vn.id === visit.vendorId)?.name || visit.vendorId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{visit.topic}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {visit.createdAt ? new Date(visit.createdAt).toLocaleString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {visit.closedAt ? new Date(visit.closedAt).toLocaleString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {visit.order && visit.order.length > 0 ? (
                      <Box>
                        {visit.order.map((it, idx) => (
                          <Typography key={idx} variant="body2">
                            {it.product} — {it.quantity} {it.unit}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {visit.payment ? (
                      <Box>
                        {visit.payment.amount && (
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{visit.payment.amount.toFixed(2)}
                          </Typography>
                        )}
                        {visit.payment.mode && (
                          <Chip 
                            label={visit.payment.mode} 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                        {visit.payment.referenceId && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Ref: {visit.payment.referenceId}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={visit.discussionSummary}
                    >
                      {visit.discussionSummary || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEditVisit(visit)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {closedVisits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">No closed visits found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Complete Visit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>Order</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
              <TextField
                select
                fullWidth
                label="Product"
                value={product}
                onChange={e => setProduct(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select product</em>
                </MenuItem>
                {liquorCatalog.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Qty"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                sx={{ minWidth: 120 }}
              />
              <TextField
                select
                label="Unit"
                value={unit}
                onChange={e => setUnit(e.target.value as OrderUnit)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
              </TextField>
              <Button variant="outlined" onClick={handleAddItem} disabled={!product || !quantity}>Add</Button>
            </Stack>
            {/* Order Section */}
            {orderItems.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Items</Typography>
                <Stack spacing={1}>
                  {orderItems.map((it, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography>{it.product} — {it.quantity} {it.unit}</Typography>
                      <Button color="error" size="small" onClick={() => handleRemoveItem(idx)}>Remove</Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            <TextField
              label="Discussion Summary"
              multiline
              minRows={3}
              value={discussionSummary}
              onChange={e => setDiscussionSummary(e.target.value)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Payment Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={e => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={mode}
                onChange={e => setMode(e.target.value as PaymentMode)}
              >
                <MenuItem value="">None</MenuItem>
                {paymentModes.map(m => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Reference ID"
              placeholder="Txn/UPI Ref/Chq No."
              value={referenceId}
              onChange={e => setReferenceId(e.target.value)}
            />
            <TextField
              label="Notes"
              placeholder="Any additional information"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCloseVisit}
            variant="contained"
            color='error'
            disabled={!discussionSummary.trim()}
          >
            Close Visit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Visit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Visit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>Order</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
              <TextField
                select
                fullWidth
                label="Product"
                value={editProduct}
                onChange={e => setEditProduct(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select product</em>
                </MenuItem>
                {liquorCatalog.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Qty"
                type="number"
                value={editQuantity}
                onChange={e => setEditQuantity(e.target.value)}
                sx={{ minWidth: 120 }}
              />
              <TextField
                select
                label="Unit"
                value={editUnit}
                onChange={e => setEditUnit(e.target.value as OrderUnit)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
              </TextField>
              <Button variant="outlined" onClick={handleEditAddItem} disabled={!editProduct || !editQuantity}>Add</Button>
            </Stack>
            {editOrderItems.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Items</Typography>
                <Stack spacing={1}>
                  {editOrderItems.map((it, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography>{it.product} — {it.quantity} {it.unit}</Typography>
                      <Button color="error" size="small" onClick={() => handleEditRemoveItem(idx)}>Remove</Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            <TextField
              label="Discussion Summary"
              multiline
              minRows={3}
              value={editDiscussionSummary}
              onChange={e => setEditDiscussionSummary(e.target.value)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Payment Amount"
                type="number"
                fullWidth
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={editMode}
                onChange={e => setEditMode(e.target.value as PaymentMode)}
              >
                <MenuItem value="">None</MenuItem>
                {paymentModes.map(m => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Reference ID"
              placeholder="Txn/UPI Ref/Chq No."
              value={editReferenceId}
              onChange={e => setEditReferenceId(e.target.value)}
            />
            <TextField
              label="Notes"
              placeholder="Any additional information"
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateVisit}
            variant="contained"
            color="primary"
          >
            Update Visit
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default VisitsView;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RemoveRedEye } from "@mui/icons-material";
import { paths } from "../../paths";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { allPurchase } from "../../services/services";
import CreatePurchases from "./CreatePurchases";

interface PurchaseData {
  _id: string;
  purchaseDate: string;
  supplier: {
    _id: string;
    name: string;
    type: string;
    phone: string;
    email: string;
    address?: string;
  };
  items: {
    name: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  totalPrice: number;
  additionalCharge: number;
  grTotal: number;
  roundOff: number;
  paidAmount: number;
  paymentType: string;
  saveType: string;
  clear: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    memberId: string;
    email?: string;
  };
}

const PurchaseDetails: React.FC<{
  data: PurchaseData;
  onBack: () => void;
  onEdit: (data: PurchaseData) => void;
}> = ({ data, onBack, onEdit }) => {
  console.log("Purchase Details Data:", data);
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Purchase Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<RemoveRedEye />}
          color="primary"
          onClick={() => onEdit(data)} // 👈 call parent edit handler
        >
          Edit Purchase
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          Back to List
        </Button>
      </Box>

      {/* Supplier & Purchase Info */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ flexWrap: "wrap" }}
      >
        <Card sx={{ flex: 1, minWidth: 280 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Supplier Information
            </Typography>
            <Typography>Name: {data.supplier.name}</Typography>
            <Typography>Type: {data.supplier.type}</Typography>
            <Typography>Phone: {data.supplier.phone}</Typography>
            <Typography>Email: {data.supplier.email}</Typography>
            {data.supplier.address && (
              <Typography>Address: {data.supplier.address}</Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 280 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Purchase Info
            </Typography>
            <Typography>
              Purchase ID: <strong>{data._id}</strong>
            </Typography>
            <Typography>
              Date: {new Date(data.purchaseDate).toLocaleDateString()}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Status:
              <Chip
                label={data.saveType}
                color={data.saveType === "FINAL" ? "success" : "warning"}
                size="small"
              />
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Payment Type:
              <Chip label={data.paymentType} color="primary" size="small" />
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Items Table */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Purchased Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Payment Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={0.5}>
            <Typography>Total Price: ₹{data.totalPrice.toFixed(2)}</Typography>
            <Typography>
              Additional Charges: ₹{data.additionalCharge.toFixed(2)}
            </Typography>
            <Typography fontWeight={600}>
              Grand Total: ₹{data.grTotal.toFixed(2)}
            </Typography>
            <Typography>Round Off: ₹{data.roundOff.toFixed(2)}</Typography>
            <Typography>Paid Amount: ₹{data.paidAmount.toFixed(2)}</Typography>
            <Typography>
              Remaining Balance: ₹{(data.grTotal - data.paidAmount).toFixed(2)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Created Info */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Created Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            Created By: {data.createdBy.firstName} {data.createdBy.lastName} (
            {data.createdBy.memberId})
          </Typography>
          {data.createdBy.email && (
            <Typography>Email: {data.createdBy.email}</Typography>
          )}
          <Typography>
            Created On: {new Date(data.createdAt).toLocaleString()}
          </Typography>
          <Typography>
            Last Updated: {new Date(data.updatedAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const PurchasesView: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(
    null
  );
  const [editPurchase, setEditPurchase] = useState<PurchaseData | null>(null);
  const columns = [
    // { key: "slNo", label: "S.No", render: (_: any, i: number) => i + 1 },
    {
      key: "supplier",
      label: "Supplier",
      render: (row: any) => row?.supplier?.name || "",
    },
    { key: "totalPrice", label: "Total Amount" },
    { key: "additionalCharge", label: "Additional Charge" },
    { key: "grTotal", label: "Grand Total" },
    { key: "paidAmount", label: "Paid Amount" },
    {
      key: "purchaseDate",
      label: "Date",
      render: (row: any) => new Date(row.purchaseDate).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "View",
      render: (row: any) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setSelectedPurchase(row)}
        >
          <RemoveRedEye />
        </Button>
      ),
    },
  ];
  useEffect(() => {
    allPurchase().then((res) => setPurchases(res.data.result || []));
  }, []);

  if (editPurchase)
    return (
      <CreatePurchases
        editData={editPurchase}
        onBack={() => setEditPurchase(null)}
      />
    );

  if (selectedPurchase)
    return (
      <PurchaseDetails
        data={selectedPurchase}
        onBack={() => setSelectedPurchase(null)}
        onEdit={(data) => setEditPurchase(data)} // 👈 switch to edit
      />
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Purchases</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(paths.createPurchase)}
        >
          New Purchase
        </Button>
      </Box>
      <GlobalTable columns={columns} rows={purchases} />
    </Box>
  );
};

export default PurchasesView;

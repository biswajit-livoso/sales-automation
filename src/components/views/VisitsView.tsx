// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   InputAdornment,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   IconButton,
//   Chip,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import { Edit } from "@mui/icons-material";
// import { useVisits } from "../../context/visitContext";
// import type {
//   PaymentMode,
//   Visit,
//   VisitOrderItem,
//   OrderUnit,
// } from "../../types";
// import {
//   closeVisit,
//   createVisit,
//   currentVisit,
//   getAllProducts,
//   getAllVendors,
//   myVisits,
// } from "../../services/services";
// import VisitTimer from "./VisitTimer";
// import { toast } from "react-toastify";
// import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
// interface EndVisit {
//   endTime: Date;
//   products: VisitOrderItem[];
//   summary: string;
//   note: string;
//   paid: number;
//   paymentMode: PaymentMode | "";
//   referenceId: string;
// }
// const paymentModes: PaymentMode[] = [
//   "cash",
//   "card",
//   "upi",
//   "bank-transfer",
//   "cheque",
//   "other",
// ];

// const VisitsView: React.FC = () => {
//   const [vendors, setVendors] = useState([""]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   // Form state
//   const [startVisit, setStartVisit] = useState({
//     vendorId: "",
//     topic: "",
//     startTime: new Date(),
//     location: {
//       latitude: 0,
//       longitude: 0,
//       address: "",
//     },
//   });
//   const [endVisit, setEndVisit] = useState<EndVisit>({
//     endTime: new Date(),
//     products: [],
//     summary: "",
//     note: "",
//     paid: 0,
//     paymentMode: "",
//     referenceId: "",
//   });
//   // Complete dialog state
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const [allVisits, setAllVisits] = useState<Visit[]>([]);
//   const [currentVisits, setCurrentVisits] = useState<Visit[]>([]);
//   const [ongoingVisitId, setOngoingVisitId] = useState<Visit | null>(null);
//   // Edit dialog state
//   // const [editDialogOpen, setEditDialogOpen] = useState(false);
//   // const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
//   // const [editDiscussionSummary, setEditDiscussionSummary] = useState("");
//   // const [editAmount, setEditAmount] = useState<string>("");
//   // const [editMode, setEditMode] = useState<PaymentMode | "">("");
//   // const [editReferenceId, setEditReferenceId] = useState("");
//   // const [editNotes, setEditNotes] = useState("");
//   // const [editOrderItems, setEditOrderItems] = useState<VisitOrderItem[]>([]);
//   // const [editProduct, setEditProduct] = useState("");
//   // const [editQuantity, setEditQuantity] = useState<string>("");
//   // const [editUnit, setEditUnit] = useState<OrderUnit>("box");

//   const [mode, setMode] = useState("complete");
//   const [editData, setEditData] = useState<Visit | null>(null);

//   // Order capture state
//   const [orderItems, setOrderItems] = useState<VisitOrderItem[]>([]);
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState<string>("");
//   const [unit, setUnit] = useState<OrderUnit>("box");
//   const [products, setProducts] = useState([]);
//   const columns = [
//     { label: "Sl No", key: "slNo" },
//     { label: "Vendor", key: "vendor", render: (row: any) => row?.vendor?.name },
//     { label: "Topic", key: "topic" },
//     {
//       label: "Start Time",
//       key: "startTime",
//       render: (row: any) =>
//         row?.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
//     },
//     {
//       label: "End Time",
//       key: "endTime",
//       render: (row: any) =>
//         row?.endTime ? new Date(row.endTime).toLocaleString() : "-",
//     },
//     {
//       label: "Order",
//       key: "order",
//       render: (row: any) => {
//         row?.order && row.order.length > 0 ? (
//           <Box>
//             {row.order.map((it: any, idx: any) => (
//               <Typography key={idx} variant="body2">
//                 {it.product} — {it.quantity} {it.unit}
//               </Typography>
//             ))}
//           </Box>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             —
//           </Typography>
//         );
//       },
//     },
//     {
//       label: "Payment",
//       key: "payment",
//       render: (row: any) => {
//         row?.payment ? (
//           <Box>
//             {row?.payment?.amount && (
//               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                 ₹{row.payment.amount.toFixed(2)}
//               </Typography>
//             )}
//             {row?.payment?.mode && (
//               <Chip
//                 label={row.payment.mode}
//                 size="small"
//                 variant="outlined"
//                 sx={{ mt: 0.5 }}
//               />
//             )}
//             {row?.payment?.referenceId && (
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 display="block"
//               >
//                 Ref: {row?.payment?.referenceId}
//               </Typography>
//             )}
//           </Box>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             —
//           </Typography>
//         );
//       },
//     },
//     { label: "Discussion Summary", key: "discussionSummary" },
//     {
//       label: "Actions",
//       key: "actions",
//       render: (row: any) => {
//         return (
//           <IconButton
//             size="small"
//             color="primary"
//             onClick={() => handleEditVisit(row)}
//           >
//             <Edit />
//           </IconButton>
//         );
//       },
//     },
//   ];
//   // Timer tick for open visits
//   const refreshVisits = () => {
//     getLatestVisit();
//     getMyVisits();
//   };
  
//   const getLatestVisit = () => {
//     currentVisit().then((res) => {
//       console.log("latest visit", res);
//       setCurrentVisits(res.data.result);
//     });
//   };
//   const getMyVisits = () => {
//     myVisits().then((res) => {
//       console.log(res.data);
//       setAllVisits(res.data.result);
//     });
//   };
//   useEffect(() => {
//     getAllVendors().then((res) => {
//       console.log(res.data);
//       setVendors(res.data.result);
//     });
//     currentVisit().then((res) => {
//       console.log(res.data);
//       setCurrentVisits(res.data.result);
//     });
//     getAllProducts().then((res) => {
//       setProducts(res.data.result);
//     });
//     myVisits().then((res) => {
//       console.log(res.data);
//       setAllVisits(res.data.result);
//     });
//   }, []);
//   const handleStartVisit = async () => {
//     if (!startVisit.vendorId || !startVisit.topic.trim()) return;

//     setLoading(true);
//     setError(null);

//     try {
//       // Get current position
//       const position = await new Promise<GeolocationPosition>(
//         (resolve, reject) =>
//           navigator.geolocation.getCurrentPosition(resolve, reject)
//       );

//       const { latitude, longitude } = position.coords;

//       // Reverse geocode using OpenStreetMap (Nominatim)
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//       );

//       const data = await res.json();
//       const address = data.display_name || "Unknown location";

//       // Create the visit
//       const response = await createVisit({
//         topic: startVisit.topic.trim(),
//         vendor: startVisit.vendorId,
//         startTime: new Date(),
//         location: {
//           latitude,
//           longitude,
//           address,
//         },
//       });
//       if (response.status === 201) {
//         toast.success("Visit started successfully");
//         getLatestVisit();
//         getMyVisits();
//       }
//       setStartVisit({
//         vendorId: "",
//         topic: "",
//         startTime: new Date(),
//         location: {
//           latitude: 0,
//           longitude: 0,
//           address: "",
//         },
//       });
//     } catch (err) {
//       console.error("Failed to get location or address:", err);
//       setError("Failed to get your location. Please enable location access.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenComplete = (v: Visit) => {
//     setMode("complete");
//     setEditData(null);
//     setOngoingVisitId(v);
//     setEndVisit({
//       endTime: new Date(),
//       products: [],
//       summary: "",
//       note: "",
//       paid: 0,
//       paymentMode: "",
//       referenceId: "",
//     });
//     setOrderItems([]);
//     setProduct("");
//     setQuantity("");
//     setUnit("box");
//     setDialogOpen(true);
//   };

//   const handleSubmitVisit = async () => {
//     const payload: any = {
//       discussionSummary: endVisit.summary.trim(),
//       order: orderItems,
//     };
  
//     if (
//       endVisit.paid ||
//       endVisit.paymentMode ||
//       endVisit.referenceId ||
//       endVisit.note
//     ) {
//       payload.payment = {
//         amount: endVisit.paid ? Number(endVisit.paid) : undefined,
//         mode: endVisit.paymentMode || undefined,
//         referenceId: endVisit.referenceId || undefined,
//         note: endVisit.note || undefined,
//       };
//     }
  
//     try {
//       if (mode === "complete" && ongoingVisitId) {
//         const res = await closeVisit(ongoingVisitId._id, {
//           ...endVisit,
//           products: orderItems,
//         });
//         if (res?.status === 200) {
//           toast.success("Visit closed successfully");
//           refreshVisits();
//           setDialogOpen(false);
//           setOngoingVisitId(null);
//         }
//       } else if (mode === "edit" && editData) {
//         const res: any = await updateVisit(editData._id, payload);
//         if (res?.status === 200) {
//           toast.success("Visit updated successfully");
//           refreshVisits();
//           setDialogOpen(false);
//           setEditData(null);
//         }
//       }
//     } catch (err: any) {
//       console.error("Failed to submit visit:", err);
//       toast.error(err?.response?.data?.message || "Failed to submit visit");
//       refreshVisits();
//     }
//   };
  

//   const handleAddItem = () => {
//     const qty = Number(quantity);
//     if (!product.trim() || !qty || qty <= 0) return;
//     const newItem: VisitOrderItem = {
//       product: product.trim(),
//       quantity: qty,
//       unit,
//     };
//     setOrderItems((prev) => [...prev, newItem]);
//     setProduct("");
//     setQuantity("");
//     setUnit("box");
//   };

//   const handleRemoveItem = (index: number) => {
//     setOrderItems((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleEditVisit = (visit: Visit) => {
//     setMode("edit");
//     setEditData(visit);
//     setOngoingVisitId(null);
  
//     // Set order items from visit
//     setOrderItems(visit.order ? [...visit.order] : []);
  
//     // Clear current product entry (new entry input)
//     setProduct("");
//     setQuantity("");
//     setUnit("box");
  
//     // Set all endVisit fields from visit
//     setEndVisit({
//       endTime: new Date(),
//       products: visit.order ? [...visit.order] : [],
//       summary: visit.discussionSummary || "",
//       paid: visit.payment?.amount || 0,
//       paymentMode: (visit.payment?.mode as PaymentMode) || "",
//       referenceId: visit.payment?.referenceId || "",
//       note: (visit.payment?.note || visit.payment?.note || "") as string, // fallback
//     });
  
//     setDialogOpen(true);
//   };
  

//   // Removed legacy edit item handlers in favor of unified order editing via orderItems
//   const activeVisits = currentVisits.filter((v: any) => v.endTime == null);
//   const closedVisits = allVisits.filter((v: any) => v.endTime != null);
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box>
//         <Typography variant="h5" fontWeight={700} gutterBottom>
//           Plan a Vendor Visit
//         </Typography>

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             select
//             fullWidth
//             label="Vendor"
//             value={startVisit.vendorId}
//             onChange={(e) =>
//               setStartVisit({ ...startVisit, vendorId: e.target.value })
//             }
//           >
//             {vendors
//               ? vendors.map((v: any) => (
//                   <MenuItem key={v._id} value={v._id}>
//                     {v.name} {v.contactName ? `— ${v.contactName}` : ""}
//                   </MenuItem>
//                 ))
//               : null}
//           </TextField>
//           <TextField
//             fullWidth
//             label="Topic / Discussion"
//             placeholder="What will you discuss?"
//             value={startVisit.topic}
//             onChange={(e) =>
//               setStartVisit({ ...startVisit, topic: e.target.value })
//             }
//           />

//           <Button
//             variant="contained"
//             onClick={handleStartVisit}
//             disabled={
//               loading || !startVisit.vendorId || !startVisit.topic.trim()
//             }
//           >
//             {loading ? "Starting Visit..." : "Start Visit"}
//           </Button>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//         </Stack>
//       </Box>

//       <Box>
//         <Typography variant="h6" fontWeight={700} gutterBottom>
//           Active Visits
//         </Typography>
//         <Grid container spacing={2}>
//           {activeVisits.length === 0 ? (
//             <Box sx={{ p: 2 }}>
//               <Typography color="text.secondary">No active visits.</Typography>
//             </Box>
//           ) : (
//             activeVisits.map((v: any) => (
//               <div key={v._id}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Vendor
//                     </Typography>
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight={600}
//                       gutterBottom
//                     >
//                       {v?.vendor?.name}
//                     </Typography>

//                     <Typography variant="subtitle2" color="text.secondary">
//                       Topic
//                     </Typography>
//                     <Typography gutterBottom>{v?.topic}</Typography>

//                     <Typography variant="subtitle2" color="text.secondary">
//                       Started
//                     </Typography>
//                     <Typography gutterBottom>
//                       {new Date(v?.startTime).toLocaleString()}
//                     </Typography>

//                     <Typography variant="h6" sx={{ mt: 1 }}>
//                       <VisitTimer startTime={v?.startTime} />
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       color="warning"
//                       onClick={() => handleOpenComplete(v)}
//                       variant="outlined"
//                     >
//                       Complete Visit
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </div>
//             ))
//           )}
//         </Grid>
//       </Box>

//       <Box>
//         <Typography variant="h6" fontWeight={700} gutterBottom>
//           Recent Closed Visits
//         </Typography>
//         <GlobalTable columns={columns} rows={closedVisits} />
//       </Box>

//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {" "}
//           {mode === "complete" ? "Complete Visit" : "Edit Visit"}
//         </DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} sx={{ mt: 1 }}>
//             <Typography variant="subtitle1" fontWeight={600}>
//               Order
//             </Typography>
//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={2}
//               alignItems={{ sm: "flex-end" }}
//             >
//               <TextField
//                 select
//                 fullWidth
//                 label="Product"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//               >
//                 {products.map((p: any) => (
//                   <MenuItem key={p.id} value={p.name}>
//                     {p.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 label="Qty"
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 sx={{ minWidth: 120 }}
//               />
//               <TextField
//                 select
//                 label="Unit"
//                 value={unit}
//                 onChange={(e) => setUnit(e.target.value as OrderUnit)}
//                 sx={{ minWidth: 140 }}
//               >
//                 <MenuItem value="box">Box</MenuItem>
//                 <MenuItem value="pcs">Pcs</MenuItem>
//               </TextField>
//               <Button
//                 variant="outlined"
//                 onClick={handleAddItem}
//                 disabled={!product || !quantity}
//               >
//                 Add
//               </Button>
//             </Stack>
//             {/* Order Section */}
//             {orderItems.length > 0 && (
//               <Box>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ mb: 1 }}
//                 >
//                   Items
//                 </Typography>
//                 <Stack spacing={1}>
//                   {orderItems.map((it, idx) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         p: 1,
//                         border: "1px solid",
//                         borderColor: "divider",
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography>
//                         {it.product} — {it.quantity} {it.unit}
//                       </Typography>
//                       <Button
//                         color="error"
//                         size="small"
//                         onClick={() => handleRemoveItem(idx)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Box>
//             )}
//             <TextField
//               label="Discussion Summary"
//               multiline
//               minRows={3}
//               value={endVisit.summary}
//               onChange={(e) =>
//                 setEndVisit((prev) => ({ ...prev, summary: e.target.value }))
//               }
//             />
//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="Payment Amount"
//                 type="number"
//                 fullWidth
//                 value={endVisit.paid || ""}
//                 onChange={(e) =>
//                   setEndVisit((prev) => ({
//                     ...prev,
//                     paid: Number(e.target.value),
//                   }))
//                 }
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">₹</InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 select
//                 fullWidth
//                 label="Payment Mode"
//                 value={endVisit.paymentMode}
//                 onChange={(e) =>
//                   setEndVisit((prev) => ({
//                     ...prev,
//                     paymentMode: e.target.value as PaymentMode,
//                   }))
//                 }
//               >
//                 <MenuItem value="">None</MenuItem>
//                 {paymentModes.map((m) => (
//                   <MenuItem key={m} value={m}>
//                     {m}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Stack>
//             <TextField
//               label="Reference ID"
//               placeholder="Txn/UPI Ref/Chq No."
//               value={endVisit.referenceId}
//               onChange={(e) =>
//                 setEndVisit((prev) => ({
//                   ...prev,
//                   referenceId: e.target.value,
//                 }))
//               }
//             />
//             <TextField
//               label="Notes"
//               placeholder="Any additional information"
//               value={endVisit.note}
//               onChange={(e) =>
//                 setEndVisit((prev) => ({ ...prev, note: e.target.value }))
//               }
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={handleSubmitVisit}
//             variant="contained"
//             color={mode === "complete" ? "error" : "primary"}
//             disabled={!endVisit.summary.trim()}
//           >
//             {mode === "complete" ? "Close Visit" : "Save Changes"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default VisitsView;










import React, { useEffect, useState } from "react";
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
  IconButton,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Edit } from "@mui/icons-material";
import type {
  PaymentMode,
  Visit,
  VisitOrderItem,
  OrderUnit,
} from "../../types";
import {
  closeVisit,
  createVisit,
  currentVisit,
  getAllProducts,
  getAllVendors,
  myVisits,
  updateVisit,
} from "../../services/services";
import VisitTimer from "./VisitTimer";
import { toast } from "react-toastify";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
interface EndVisit {
  endTime: Date;
  products: VisitOrderItem[];
  summary: string;
  note: string;
  paid: number;
  paymentMode: PaymentMode | "";
  referenceId: string;
}
const paymentModes: PaymentMode[] = [
  "cash",
  "card",
  "upi",
  "bank-transfer",
  "cheque",
  "other",
];

const VisitsView: React.FC = () => {
  const [vendors, setVendors] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Form state
  const [startVisit, setStartVisit] = useState({
    vendorId: "",
    topic: "",
    startTime: new Date(),
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
    },
  });
  const [endVisit, setEndVisit] = useState<EndVisit>({
    endTime: new Date(),
    products: [],
    summary: "",
    note: "",
    paid: 0,
    paymentMode: "",
    referenceId: "",
  });
  // Complete dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [allVisits, setAllVisits] = useState<Visit[]>([]);
  const [currentVisits, setCurrentVisits] = useState<Visit[]>([]);
  const [ongoingVisitId, setOngoingVisitId] = useState<Visit | null>(null);
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editDiscussionSummary, setEditDiscussionSummary] = useState("");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editMode, setEditMode] = useState<PaymentMode | "">("");
  const [editReferenceId, setEditReferenceId] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editOrderItems, setEditOrderItems] = useState<VisitOrderItem[]>([]);
  const [editProduct, setEditProduct] = useState("");
  const [editQuantity, setEditQuantity] = useState<string>("");
  const [editUnit, setEditUnit] = useState<OrderUnit>("box");

  // Order capture state
  const [orderItems, setOrderItems] = useState<VisitOrderItem[]>([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<OrderUnit>("box");
  const [products, setProducts] = useState([]);
  const columns = [
    { label: "Sl No", key: "slNo" },
    { label: "Vendor", key: "vendor", render: (row: any) => row?.vendor?.name },
    { label: "Topic", key: "topic" },
    {
      label: "Start Time",
      key: "startTime",
      render: (row: any) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
    },
    {
      label: "End Time",
      key: "endTime",
      render: (row: any) =>
        row?.endTime ? new Date(row.endTime).toLocaleString() : "-",
    },
    {
      label: "Order",
      key: "order",
      render: (row: any) => {
        row?.order && row.order.length > 0 ? (
          <Box>
            {row.order.map((it: any, idx: any) => (
              <Typography key={idx} variant="body2">
                {it.product} — {it.quantity} {it.unit}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      },
    },
    {
      label: "Payment",
      key: "payment",
      render: (row: any) => {
        row?.payment ? (
          <Box>
            {row?.payment?.amount && (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ₹{row.payment.amount.toFixed(2)}
              </Typography>
            )}
            {row?.payment?.mode && (
              <Chip
                label={row.payment.mode}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5 }}
              />
            )}
            {row?.payment?.referenceId && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Ref: {row?.payment?.referenceId}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      },
    },
    { label: "Discussion Summary", key: "discussionSummary" },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) => {
        return (
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditVisit(row)}
          >
            <Edit />
          </IconButton>
        );
      },
    },
  ];
  // Timer tick for open visits

  const getLatestVisit = () => {
    currentVisit().then((res) => {
      console.log("latest visit", res);
      setCurrentVisits(res.data.result);
    });
  };
  const getMyVisits = () => {
    myVisits().then((res) => {
      console.log(res.data);
      setAllVisits(res.data.result);
    });
  };
  useEffect(() => {
    getAllVendors().then((res) => {
      console.log(res.data);
      setVendors(res.data.result);
    });
    currentVisit().then((res) => {
      console.log(res.data);
      setCurrentVisits(res.data.result);
    });
    getAllProducts().then((res) => {
      setProducts(res.data.result);
    });
    myVisits().then((res) => {
      console.log(res.data);
      setAllVisits(res.data.result);
    });
  }, []);
  const handleStartVisit = async () => {
    if (!startVisit.vendorId || !startVisit.topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocode using OpenStreetMap (Nominatim)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const data = await res.json();
      const address = data.display_name || "Unknown location";

      // Create the visit
      const response = await createVisit({
        topic: startVisit.topic.trim(),
        vendor: startVisit.vendorId,
        startTime: new Date(),
        location: {
          latitude,
          longitude,
          address,
        },
      });
      if (response.status === 201) {
        toast.success("Visit started successfully");
        getLatestVisit();
        getMyVisits();
      }
      setStartVisit({
        vendorId: "",
        topic: "",
        startTime: new Date(),
        location: {
          latitude: 0,
          longitude: 0,
          address: "",
        },
      });
    } catch (err) {
      console.error("Failed to get location or address:", err);
      setError("Failed to get your location. Please enable location access.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComplete = (v: Visit) => {
    setOngoingVisitId(v);
    setEndVisit({
      endTime: new Date(),
      products: [],
      summary: "",
      note: "",
      paid: 0,
      paymentMode: "",
      referenceId: "",
    });
    setOrderItems([]);
    setProduct("");
    setQuantity("");
    setUnit("box");
    setDialogOpen(true);
  };

  const handleCloseVisit = async () => {
    if (!ongoingVisitId) return;
    // const payload: any = { discussionSummary: endVisit.summary.trim() };
    // if (orderItems.length > 0) {
    //   payload.order = orderItems;
    // }
    // if (
    //   endVisit.paid ||
    //   endVisit.paymentMode ||
    //   endVisit.referenceId ||
    //   endVisit.note
    // ) {
    //   payload.payment = {
    //     amount: endVisit.paid ? Number(endVisit.paid) : undefined,
    //     mode: endVisit.paymentMode || undefined,
    //     referenceId: endVisit.referenceId || undefined,
    //     note: endVisit.note || undefined,
    //   };
    // }
    try {
      const res = await closeVisit(ongoingVisitId._id, endVisit);
      if (res.status === 200) {
        toast.success("Visit closed successfully");
        getLatestVisit();
        getMyVisits();
        setDialogOpen(false);
        setOngoingVisitId(null);
      }
    } catch (err: any) {
      console.error("Failed to close visit:", err);
      toast.error(err.response.data.message || "Failed to close visit");
      getLatestVisit();
      getMyVisits();
    }
  };

  const handleAddItem = () => {
    const qty = Number(quantity);
    if (!product.trim() || !qty || qty <= 0) return;
    const newItem: VisitOrderItem = {
      product: product.trim(),
      quantity: qty,
      unit,
    };
    setOrderItems((prev) => [...prev, newItem]);
    setProduct("");
    setQuantity("");
    setUnit("box");
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
    setEditDiscussionSummary(visit.discussionSummary || "");
    setEditAmount(visit.payment?.amount?.toString() || "");
    setEditMode(visit.payment?.mode || "");
    setEditReferenceId(visit.payment?.referenceId || "");
    setEditNotes(visit.payment?.notes || "");
    setEditOrderItems(visit.order ? [...visit.order] : []);
    setEditProduct("");
    setEditQuantity("");
    setEditUnit("box");
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
    updateVisit(editingVisit._id, payload);
    setEditDialogOpen(false);
    setEditingVisit(null);
  };

  const handleEditAddItem = () => {
    const qty = Number(editQuantity);
    if (!editProduct.trim() || !qty || qty <= 0) return;
    const newItem: VisitOrderItem = {
      product: editProduct.trim(),
      quantity: qty,
      unit: editUnit,
    };
    setEditOrderItems((prev) => [...prev, newItem]);
    setEditProduct("");
    setEditQuantity("");
    setEditUnit("box");
  };

  const handleEditRemoveItem = (index: number) => {
    setEditOrderItems((prev) => prev.filter((_, i) => i !== index));
  };
  const activeVisits = currentVisits.filter((v: any) => v.endTime == null);
  const closedVisits = allVisits.filter((v: any) => v.endTime != null);
  return (
    <Box sx={{ p: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Plan a Vendor Visit
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            fullWidth
            label="Vendor"
            value={startVisit.vendorId}
            onChange={(e) =>
              setStartVisit({ ...startVisit, vendorId: e.target.value })
            }
          >
            {vendors
              ? vendors.map((v: any) => (
                  <MenuItem key={v._id} value={v._id}>
                    {v.name} {v.contactName ? `— ${v.contactName}` : ""}
                  </MenuItem>
                ))
              : null}
          </TextField>
          <TextField
            fullWidth
            label="Topic / Discussion"
            placeholder="What will you discuss?"
            value={startVisit.topic}
            onChange={(e) =>
              setStartVisit({ ...startVisit, topic: e.target.value })
            }
          />

          <Button
            variant="contained"
            onClick={handleStartVisit}
            disabled={
              loading || !startVisit.vendorId || !startVisit.topic.trim()
            }
          >
            {loading ? "Starting Visit..." : "Start Visit"}
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Active Visits
        </Typography>
        <Grid container spacing={2}>
          {activeVisits.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">No active visits.</Typography>
            </Box>
          ) : (
            activeVisits.map((v: any) => (
              <div key={v._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vendor
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      {v?.vendor?.name}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Topic
                    </Typography>
                    <Typography gutterBottom>{v?.topic}</Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Started
                    </Typography>
                    <Typography gutterBottom>
                      {new Date(v?.startTime).toLocaleString()}
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 1 }}>
                      <VisitTimer startTime={v?.startTime} />
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      color="warning"
                      onClick={() => handleOpenComplete(v)}
                      variant="outlined"
                    >
                      Complete Visit
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))
          )}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recent Closed Visits
        </Typography>
        <GlobalTable columns={columns} rows={closedVisits} />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Complete Visit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Order
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "flex-end" }}
            >
              <TextField
                select
                fullWidth
                label="Product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                {products.map((p: any) => (
                  <MenuItem key={p.id} value={p.name}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ minWidth: 120 }}
              />
              <TextField
                select
                label="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as OrderUnit)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
              </TextField>
              <Button
                variant="outlined"
                onClick={handleAddItem}
                disabled={!product || !quantity}
              >
                Add
              </Button>
            </Stack>
            {/* Order Section */}
            {orderItems.length > 0 && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Items
                </Typography>
                <Stack spacing={1}>
                  {orderItems.map((it, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography>
                        {it.product} — {it.quantity} {it.unit}
                      </Typography>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            <TextField
              label="Discussion Summary"
              multiline
              minRows={3}
              value={endVisit.summary}
              onChange={(e) =>
                setEndVisit((prev) => ({ ...prev, summary: e.target.value }))
              }
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Payment Amount"
                type="number"
                fullWidth
                value={endVisit.paid || ""}
                onChange={(e) =>
                  setEndVisit((prev) => ({
                    ...prev,
                    paid: Number(e.target.value),
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={endVisit.paymentMode}
                onChange={(e) =>
                  setEndVisit((prev) => ({
                    ...prev,
                    paymentMode: e.target.value as PaymentMode,
                  }))
                }
              >
                <MenuItem value="">None</MenuItem>
                {paymentModes.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Reference ID"
              placeholder="Txn/UPI Ref/Chq No."
              value={endVisit.referenceId}
              onChange={(e) =>
                setEndVisit((prev) => ({
                  ...prev,
                  referenceId: e.target.value,
                }))
              }
            />
            <TextField
              label="Notes"
              placeholder="Any additional information"
              value={endVisit.note}
              onChange={(e) =>
                setEndVisit((prev) => ({ ...prev, note: e.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCloseVisit}
            variant="contained"
            color="error"
            disabled={!endVisit.summary.trim()}
          >
            Close Visit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Visit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Visit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Order
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "flex-end" }}
            >
              <TextField
                select
                fullWidth
                label="Product"
                value={editProduct}
                onChange={(e) => setEditProduct(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select product</em>
                </MenuItem>
                {products.map((p: any) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Qty"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                sx={{ minWidth: 120 }}
              />
              <TextField
                select
                label="Unit"
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value as OrderUnit)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
              </TextField>
              <Button
                variant="outlined"
                onClick={handleEditAddItem}
                disabled={!editProduct || !editQuantity}
              >
                Add
              </Button>
            </Stack>
            {editOrderItems.length > 0 && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Items
                </Typography>
                <Stack spacing={1}>
                  {editOrderItems.map((it, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography>
                        {it.product} — {it.quantity} {it.unit}
                      </Typography>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleEditRemoveItem(idx)}
                      >
                        Remove
                      </Button>
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
              onChange={(e) => setEditDiscussionSummary(e.target.value)}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Payment Amount"
                type="number"
                fullWidth
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={editMode}
                onChange={(e) => setEditMode(e.target.value as PaymentMode)}
              >
                <MenuItem value="">None</MenuItem>
                {paymentModes.map((m) => (
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
              onChange={(e) => setEditReferenceId(e.target.value)}
            />
            <TextField
              label="Notes"
              placeholder="Any additional information"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
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
    </Box>
  );
};

export default VisitsView;

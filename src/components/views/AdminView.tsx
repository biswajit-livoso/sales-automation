import { Box, Chip, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { getAllVisits } from "../../services/services";
import {  RemoveRedEye } from "@mui/icons-material";

const AdminView: React.FC = () => {
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
          render: () => {
            return (
              <IconButton
                size="small"
                color="primary"
                // onClick={() => handleEditVisit(row)}
              >
                <RemoveRedEye />
              </IconButton>
            );
          },
        },
      ];
      const [closedVisits, setClosedVisits] = useState([]);
      useEffect(() => {
        getAllVisits().then((res) => {
          console.log(res.data);
          setClosedVisits(res.data.result);
        });
      }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        All Visits
      </Typography>
      <Box>
        <GlobalTable columns={columns} rows={closedVisits} />
      </Box>
    </Box>
  );
};

export default AdminView;

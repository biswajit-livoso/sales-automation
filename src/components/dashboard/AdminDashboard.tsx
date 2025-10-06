import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  People,
  TrendingUp,
  AttachMoney,
  Assignment,
  Add,
  RemoveRedEye,
} from "@mui/icons-material";
import GlobalTable from "../../reUsableComponents/globalTable/GlobalTable";
import { getVisitsToday } from "../../services/services";
import { useNavigate } from "react-router-dom";
import { paths } from "../../paths";

interface AdminDashboardProps {
  onViewUser?: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const systemMetrics = [
    {
      k: "users" as const,
      title: "Total Users",
      value: "142",
      icon: People,
      color: "#2196f3",
      change: "+5",
    },
    {
      k: "revenue" as const,
      title: "Total Revenue",
      value: "$234,560",
      icon: AttachMoney,
      color: "#4caf50",
      change: "+18%",
    },
    {
      k: "deals" as const,
      title: "Active Deals",
      value: "89",
      icon: Assignment,
      color: "#ff9800",
      change: "+12",
    },
    {
      k: "conversion" as const,
      title: "Conversion Rate",
      value: "24.1%",
      icon: TrendingUp,
      color: "#9c27b0",
      change: "+2.3%",
    },
  ];
  const [visitsToday, setVisitsToday] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { label: "Sl No", key: "slNo" },
    {
      label: "Name",
      key: "name",
      render: (row: any) => row?.user.firstName + " " + row?.user.lastName,
    },
    {
      label: "Open Visits",
      key: "openVisits",
      render: (row: any) => row?.openVisits.length,
    },
    {
      label: "Closed Visits",
      key: "closedVisits",
      render: (row: any) => row?.closedVisits.length,
    },
    {label:"Action",key:"action",render:(row:any)=>(
      <Box>
        <IconButton
          onClick={() => onViewUser(row)}
          aria-label="View user detail"
        >
          <RemoveRedEye />
        </IconButton>
      </Box>
    )}
  ];
  const onViewUser = (row: any) => {
    const user = row?.user;
    const userId = user?.id || user?._id || "unknown";
    // Combine visits if API provided open/closed arrays per user
    const visits = [
      ...(Array.isArray(row?.openVisits) ? row.openVisits : []),
      ...(Array.isArray(row?.closedVisits) ? row.closedVisits : []),
    ];
    navigate(paths.userDetail(userId), { state: { user, visits } });
  };
  // reserved for future status chips

  // Timeframe state
  const [range, setRange] = React.useState<"monthly" | "15days" | "daily">(
    "monthly"
  );
  const handleRangeChange = (
    e: SelectChangeEvent<"monthly" | "15days" | "daily">
  ) => {
    setRange(e.target.value as "monthly" | "15days" | "daily");
  };

  // Metric values and changes by timeframe
  const metricValues = {
    monthly: {
      users: "142",
      revenue: "$234,560",
      deals: "89",
      conversion: "24.1%",
    },
    "15days": {
      users: "71",
      revenue: "$117,280",
      deals: "44",
      conversion: "12.0%",
    },
    daily: { users: "5", revenue: "$7,800", deals: "3", conversion: "0.8%" },
  } as const;

  const metricChanges = {
    monthly: {
      users: "+5",
      revenue: "+18%",
      deals: "+12",
      conversion: "+2.3%",
    },
    "15days": { users: "+2", revenue: "+7%", deals: "+5", conversion: "+1.0%" },
    daily: {
      users: "+0.2",
      revenue: "+0.6%",
      deals: "+0.3",
      conversion: "+0.1%",
    },
  } as const;

  // const compareLabelByRange = {
  //   '15days': 'vs last 15 days',
  //   daily: 'vs yesterday',
  // } as const;

  // const { visits } = useVisits();
  // Load users list from localStorage (mirrors the key used in the commented auth context)
  useEffect(() => {
    getVisitsToday().then((res) => {
      console.log(res.data.result, "res.data.result");
      setVisitsToday(res.data.result);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
            onClick={() => navigate(paths.users)}
          >
            Add User
          </Button>
        </Box>
      </Box>
      {/* System Metrics */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        {" "}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="admin-timeframe-label">Timeframe</InputLabel>
          <Select
            labelId="admin-timeframe-label"
            label="Timeframe"
            value={range}
            onChange={handleRangeChange}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="15days">15 Days</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          // startIcon={<Add />}
          color="success"
          sx={{ borderRadius: 2 }}
        >
          Export Data
        </Button>
      </Box>
      <Box
        sx={{
          mb: 4,
          width: "100%",
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr) ", xs: "repeat(1, 1fr)" },
          gap: 2,
        }}
      >
        {systemMetrics.map((metric) => (
          // <Grid item xs={12} sm={6} md={3} key={index}>
          <div key={metric.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: metric.color,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <metric.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {metricValues[range][metric.k]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ mr: 1 }}
                  >
                    {metricChanges[range][metric.k]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    'vs last month'
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
        {/* </Grid> */}
      </Box>

      {/* Users Table */}
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Users Overview
        </Typography>
        <GlobalTable columns={columns} rows={visitsToday} />
      </Box>
    </Box>
  );
};

export default AdminDashboard;

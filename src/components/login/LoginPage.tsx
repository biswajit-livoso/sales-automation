import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { LoginOutlined } from "@mui/icons-material";
import { login } from "../../services/services";
import { useAuth } from "../../context/authContext";
import { setCurrentAccessToken } from "../../services/axiosClient";
import { Navigate, useNavigate } from "react-router-dom";
import { paths } from "../../paths";
// import { useAuth } from '../../context/authContext';

const LoginPage: React.FC = () => {
  const { loginAuth, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const { login, isLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  if (user) {
    const target = user.role === "ADMIN" ? paths.admin : paths.dashboard;
    return <Navigate to={target} replace />;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const response = await login({ email: email, password: password });
      if (response) {
        setIsLoading(false);
        console.log("response", response.data.token);
        console.log("response", response.data.result);
        const token = response.data.token;
        const user = response.data.result;
        loginAuth(user,token);
        setCurrentAccessToken(token);
        const target = user.role === "ADMIN" ? paths.admin : paths.dashboard;
navigate(target, { replace: true });
      } else {
        setIsLoading(false);
        setError("Invalid email or password");
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      setError("An error occurred during login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "50%",
                  p: 2,
                  mb: 2,
                }}
              >
                <LoginOutlined sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Sales Automation
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Sign in to access your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Demo Accounts:</strong>
                  <br />
                  User: user@example.com / password
                  <br />
                  Admin: admin@example.com / password
                </Typography>
              </Alert>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;

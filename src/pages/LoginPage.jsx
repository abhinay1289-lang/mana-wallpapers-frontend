import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await login(data);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Paper elevation={3} className="p-8">
        <Box className="text-center mb-6">
          <Typography variant="h4" className="font-bold text-indigo-600 mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your Mana Wallpapers account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="py-3 mt-6"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Box className="text-center mt-6">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <MuiLink component={Link} to="/register" className="font-semibold">
              Sign up
            </MuiLink>
          </Typography>
        </Box>

        {/* Demo credentials */}
        <Box className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Typography style={{ color: "#000" }} className="font-semibold mb-2">
            Demo Credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@mana.test / Admin@123
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Buyer: buyer@mana.test / Buyer@123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

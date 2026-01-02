import { useEffect, useRef, useState } from "react";
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
import toast from "react-hot-toast";
import { useLoginMutation } from "../store/apis/authApi";
import ThreeDBackground from "../components/common/ThreeDBackground";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const heroRef = useRef(null);
  const [login, { data, isSuccess }] = useLoginMutation();
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
    } catch (err) {
      const errorMessage = err?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isSuccess && data?.data?.accessToken) {
      localStorage.setItem("user", JSON.stringify(data?.data));
      localStorage.setItem("token", data?.data?.accessToken);
      navigate(from, { replace: true });
    }
  }, [isSuccess, data]);

  return (
    <Container maxWidth="sm" className="py-8 sm:py-16">
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
          transition: "transform 0.2s ease-out",
        }}
        ref={heroRef}
      >
        <ThreeDBackground />
      </Box>
      <Paper
        elevation={3}
        className="p-4 sm:p-8"
        sx={{
          backgroundColor: "#2a2a2a",
          borderRadius: "1rem",
          boxShadow: "1px 1px 23px 6px #717578",
        }}
      >
        <Box className="text-center mb-6">
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "#0d1b2a !important" }}
            className="font-bold text-indigo-600 mb-2"
          >
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
            sx={{ backgroundColor: "#1b3b6f" }}
            className="py-3 mt-4 sm:mt-6"
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
          <Typography variant="body2" color="#302e2eff">
            Admin: admin@mana.test / Admin@123
          </Typography>
          <Typography variant="body2" color="#302e2eff">
            Buyer: buyer@mana.test / Buyer@123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

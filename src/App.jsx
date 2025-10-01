import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SearchPage from "./pages/SearchPage";
import UserProfile from "./pages/UserProfile";
import Wishlist from "./pages/Wishlist";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import UploadWallpaper from "./pages/UploadWallpaper";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WallpaperManagement from "./pages/WallpaperManagement";

import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
    },
    background: {
      default: "#1a1a1a",
      paper: "#2a2a2a",
    },
    text: {
      primary: "#f0f0f0",
      secondary: "#c0c0c0",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#2a2a2a",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1f1f1f",
        },
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-primary-color text-text-color">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/wallpaper/:id" element={<ProductPage />} />
                    <Route path="/search/:searchTerm" element={<SearchPage />} />

                    {/* Buyer Routes */}
                    <Route
                      path="/buyer/cart"
                      element={
                        <ProtectedRoute requiredRole="BUYER">
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/checkout"
                      element={
                        <ProtectedRoute requiredRole="BUYER">
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/dashboard"
                      element={
                        <ProtectedRoute requiredRole="BUYER">
                          <BuyerDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/profile"
                      element={
                        <ProtectedRoute requiredRole="BUYER">
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/wishlist"
                      element={
                        <ProtectedRoute requiredRole="BUYER">
                          <Wishlist />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/upload-wallpaper"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <UploadWallpaper />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/wallpapers"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <WallpaperManagement />
                        </ProtectedRoute>
                      }
                    />
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import "./styles/globals.css";

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
import BuyerProfile from "./pages/BuyerProfile";
import Wishlist from "./pages/Wishlist";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import UploadWallpaper from "./pages/UploadWallpaper";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WallpaperManagement from "./pages/WallpaperManagement";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import LicenseInfo from "./pages/LicenseInfo";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import DMCA from "./pages/DMCA";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/category/:slug", element: <CategoryPage /> },
      { path: "/wallpaper/:id", element: <ProductPage /> },
      { path: "/search/:searchTerm", element: <SearchPage /> },
      { path: "/help-center", element: <HelpCenter /> },
      { path: "/contact-us", element: <ContactUs /> },
      { path: "/license-info", element: <LicenseInfo /> },
      { path: "/refund-policy", element: <RefundPolicy /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/cookie-policy", element: <CookiePolicy /> },
      { path: "/dmca", element: <DMCA /> },
      {
        path: "/buyer/cart",
        element: (
          <ProtectedRoute requiredRole="BUYER">
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer/checkout",
        element: (
          <ProtectedRoute requiredRole="BUYER">
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer/dashboard",
        element: (
          <ProtectedRoute requiredRole="BUYER">
            <BuyerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer/profile",
        element: (
          <ProtectedRoute requiredRole="BUYER">
            <BuyerProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer/wishlist",
        element: (
          <ProtectedRoute requiredRole="BUYER">
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/upload-wallpaper",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <UploadWallpaper />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/analytics",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/reports",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/settings",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/wallpapers",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <WallpaperManagement />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
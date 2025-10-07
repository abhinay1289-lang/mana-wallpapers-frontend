
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      } else if (status === 403) {
        toast.error("Access forbidden");
      } else if (status === 404) {
        toast.error("Resource not found");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("An error occurred");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => api.post("/auth/register", userData);
export const logout = () => api.post("/auth/logout");
export const getUser = () => api.get("/auth/me");

// Wallpapers
export const getWallpapers = (filters) => api.get("/wallpapers", { params: filters });
export const getWallpaperById = (id) => api.get(`/wallpapers/${id}`);
export const uploadWallpaper = (wallpaperData) => api.post("/wallpapers", wallpaperData);
export const updateWallpaper = (id, data) => api.put(`/wallpapers/${id}`, data);
export const deleteWallpaper = (id) => api.delete(`/wallpapers/${id}`);

// Cart
export const getCart = () => api.get("/cart");
export const addToCart = (item) => api.post("/cart", item);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete("/cart");

// Reports
export const getReports = () => api.get("/reports");

// Users
export const getUsers = () => api.get("/users");
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;

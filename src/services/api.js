import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  // "https://mana-wallpapers-backend.onrender.com/api";
  "http://localhost:8080/api";

// Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export const axiosClient = axios.create({
  // baseURL: "https://mana-wallpapers-backend.onrender.com/api",
  baseURL: "http://localhost:8080/api",
});

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401 && window.location.pathname !== "/") {
//       redirectToLogin();
//       return;
//     }
//     return Promise.reject(error);
//   }
// );

export function redirectToLogin() {
  setTimeout(() => {
    localStorage.clear();
    window.location.href = `/login`;
  }, 500);
}

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
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
axiosClient.interceptors.response.use(
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

export default axiosClient;

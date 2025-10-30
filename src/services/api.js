import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
      const { status, data } = result.error;

      if (status === 401) {
        setTimeout(() => {
          localStorage.clear();
          window.location.href = `/login`;
        }, 500);
        toast.error("Session expired. Please login again.");
      } else if (status === 403) {
        toast.error("Access forbidden");
      } else if (status === 404) {
        toast.error("Resource not found");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(data?.message || "An error occurred");
      }
    }
    return result;
  } catch (error) {
    toast.error("Network error. Please check your connection.");
    return { error };
  }
};
export default baseQueryWithErrorHandling;

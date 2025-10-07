import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../services/api";

export const login = createAsyncThunk(
  "login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while sending a productslist request."
      );
    }
  }
);

export const register = createAsyncThunk(
  "register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/register", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while sending a productslist request."
      );
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosClient } from "../../services/api";
import axios from "axios";

export const getAllcategoriesStructure = createAsyncThunk(
  "get-all-categories-structure",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallpapers/all-category");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while sending a productslist request."
      );
    }
  }
);

export const getWallpapers = createAsyncThunk(
  "get-wallpapers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallpapers");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while sending a productslist request."
      );
    }
  }
);

export const uploadWallpaper = createAsyncThunk(
  "upload-wallpaper",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallpapers", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while sending a productslist request."
      );
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/api";

export const getUserDownloads = createAsyncThunk(
  "downloads/getUserDownloads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/users/me/downloads");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateDownloadUrl = createAsyncThunk(
  "downloads/generateDownloadUrl",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/v1/downloads/${token}/generate-url`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

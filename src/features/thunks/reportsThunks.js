
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../utils/api";

export const getReports = createAsyncThunk(
  "reports/getReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

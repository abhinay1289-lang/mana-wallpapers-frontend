
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../utils/api";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.verifyPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

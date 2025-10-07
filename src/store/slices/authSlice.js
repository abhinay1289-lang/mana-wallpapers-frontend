import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "../thunks/authThunk";

const initialState = {
  isLoading: false,
  dashboardCampaigns: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.setItem("user", JSON.stringify(action.data));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error("Something went wrong!");
      }),
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          message.error("Something went wrong!");
        });
  },
});

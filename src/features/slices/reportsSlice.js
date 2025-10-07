
import { createSlice } from "@reduxjs/toolkit";
import { getReports } from "../thunks/reportsThunks";

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;

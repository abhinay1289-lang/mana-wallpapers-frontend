import { createSlice } from "@reduxjs/toolkit";
import { login, registerUser } from "../thunks/authThunk";

const persistedUser = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  isLoading: false,
  isAuthenticated: !!persistedUser,
  error: null,
  userType: persistedUser ? persistedUser.role : null,
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
        state.isAuthenticated = action.payload.success;
        state.userType = action.payload.data?.role;
        localStorage.setItem("token", action.payload.data?.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error("Something went wrong!");
      }),
      builder
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          message.error("Something went wrong!");
        });
  },
});

export default authSlice.reducer;

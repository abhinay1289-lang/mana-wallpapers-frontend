
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/slices/authSlice";
import wallpapersReducer from "../features/slices/wallpapersSlice";
import cartReducer from "../features/slices/cartSlice";
import reportsReducer from "../features/slices/reportsSlice";
import usersReducer from "../features/slices/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallpapers: wallpapersReducer,
    cart: cartReducer,
    reports: reportsReducer,
    users: usersReducer,
  },
});

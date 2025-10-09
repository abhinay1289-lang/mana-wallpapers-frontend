import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wallpaperReducer from "./slices/wallpaperSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallpaper: wallpaperReducer,
  },
});

export default store;

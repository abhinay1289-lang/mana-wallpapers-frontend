import { createSlice } from "@reduxjs/toolkit";
import {
  getAllcategoriesStructure,
  uploadWallpaper,
} from "../thunks/wallpaperThunk";

const initialState = {
  isLoading: false,
  error: null,
  categories: [],
};

export const wallpaperSlice = createSlice({
  name: "wallpaper",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllcategoriesStructure.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllcategoriesStructure.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
      })
      .addCase(getAllcategoriesStructure.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error("Something went wrong!");
      }),
      builder
        .addCase(uploadWallpaper.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(uploadWallpaper.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(uploadWallpaper.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          message.error("Something went wrong!");
        });
  },
});

export default wallpaperSlice.reducer;

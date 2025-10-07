import { createSlice } from '@reduxjs/toolkit';
import {
  fetchWallpapers,
  fetchWallpaperById,
  createWallpaper,
  updateWallpaper,
  deleteWallpaper,
  uploadWallpaper,
  searchWallpapers,
} from '../thunks/wallpapersThunks';

const wallpapersSlice = createSlice({
  name: 'wallpapers',
  initialState: {
    items: [],
    selectedWallpaper: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallpapers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWallpapers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWallpapers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchWallpaperById.fulfilled, (state, action) => {
        state.selectedWallpaper = action.payload;
      })
      .addCase(createWallpaper.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateWallpaper.fulfilled, (state, action) => {
        const index = state.items.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteWallpaper.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w._id !== action.payload);
      })
      .addCase(uploadWallpaper.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(searchWallpapers.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wallpapersSlice.reducer;

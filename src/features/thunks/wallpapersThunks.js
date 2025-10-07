
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../utils/api";

export const fetchWallpapers = createAsyncThunk(
  "wallpapers/fetchWallpapers",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.getWallpapers(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchWallpaperById = createAsyncThunk(
  "wallpapers/fetchWallpaperById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getWallpaperById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadWallpaper = createAsyncThunk(
  "wallpapers/uploadWallpaper",
  async (wallpaperData, { rejectWithValue }) => {
    try {
      const response = await api.uploadWallpaper(wallpaperData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateWallpaper = createAsyncThunk(
  "wallpapers/updateWallpaper",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateWallpaper(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWallpaper = createAsyncThunk(
  "wallpapers/deleteWallpaper",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteWallpaper(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

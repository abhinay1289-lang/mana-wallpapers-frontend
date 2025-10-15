import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandling from "../../services/api";

export const wallpaperApi = createApi({
  reducerPath: "wallpaper",
  baseQuery: baseQueryWithErrorHandling,
  // for cache invalidation
  tagTypes: ["wallpapers","all-categories"],
  endpoints: (builder) => ({
    uploadWallpaper: builder.mutation({
      query: (payload) => ({
        url: "/wallpapers",
        method: "POST",
        body: payload,
      }),
      // Auto refetch
      invalidatesTags: ["wallpapers"],
    }),
    getWallpapers: builder.query({
      query: () => "/wallpapers",
      providesTags: ["wallpapers"],
    }),
    getAllcategoriesStructure: builder.query({
      query: () => "/wallpapers/all-category",
      providesTags: ["all-categories"],
    }),
  }),
});

export const { useUploadWallpaperMutation, useGetAllcategoriesStructureQuery,useGetWallpapersQuery } =
  wallpaperApi;

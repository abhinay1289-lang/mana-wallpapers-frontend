import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wallpaperApi = createApi({
  reducerPath: "wallpaper",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  // for cache invalidation
  tagTypes: ["wallpapers"],
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
    getAllcategoriesStructure: builder.query({
      query: () => "/wallpapers/all-category",
      providesTags: ["all-categories"],
    }),
  }),
});

export const { useUploadWallpaperMutation, useGetAllcategoriesStructureQuery } =
  wallpaperApi;

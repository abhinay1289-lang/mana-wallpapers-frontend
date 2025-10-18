import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandling from "../../services/api";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithErrorHandling,
  // for cache invalidation
  tagTypes: ["user"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      // Auto refetch
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

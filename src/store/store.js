import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { wallpaperApi } from "./apis/wallpaperApi";
import { setupListeners } from "@reduxjs/toolkit/query";


const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [wallpaperApi.reducerPath] : wallpaperApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(wallpaperApi.middleware)
});

setupListeners(store.dispatch)

export default store;

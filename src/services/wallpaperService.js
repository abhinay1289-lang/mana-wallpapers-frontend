import api from "./api";
import { dummyWallpapers } from "../data/dummyWallpapers";

export const wallpaperService = {
  getAllWallpapers: async () => {
    // const response = await api.get("/all-category");
    // return response.data;
  },

  getWallpaperById: async (id) => {
    // const response = await api.get(`/wallpapers/${id}`);
    // return response.data;
    return new Promise((resolve) =>
      setTimeout(() => resolve(dummyWallpapers.find((w) => w._id === id)), 500)
    );
  },

  createWallpaper: async (wallpaperData) => {
    const response = await api.post("/wallpapers", wallpaperData);
    return response.data;
    // return new Promise(resolve => setTimeout(() => {
    //   const newWallpaper = { ...wallpaperData, _id: String(dummyWallpapers.length + 1) };
    //   dummyWallpapers.push(newWallpaper);
    //   resolve(newWallpaper);
    // }, 500));
  },

  updateWallpaper: async (id, wallpaperData) => {
    // const response = await api.put(`/wallpapers/${id}`, wallpaperData);
    // return response.data;
    return new Promise((resolve) =>
      setTimeout(() => {
        const index = dummyWallpapers.findIndex((w) => w._id === id);
        if (index !== -1) {
          dummyWallpapers[index] = {
            ...dummyWallpapers[index],
            ...wallpaperData,
          };
          resolve(dummyWallpapers[index]);
        } else {
          resolve(null);
        }
      }, 500)
    );
  },

  deleteWallpaper: async (id) => {
    // const response = await api.delete(`/wallpapers/${id}`);
    // return response.data;
    return new Promise((resolve) =>
      setTimeout(() => {
        const index = dummyWallpapers.findIndex((w) => w._id === id);
        if (index !== -1) {
          dummyWallpapers.splice(index, 1);
          resolve({ message: "Wallpaper deleted successfully" });
        } else {
          resolve(null);
        }
      }, 500)
    );
  },

  generateUploadUrl: async (filename, contentType) => {
    const response = await api.post("/wallpapers/upload-url", null, {
      params: { filename, contentType },
    });
    return response.data;
  },

  uploadFile: async (presignedUrl, file) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return response;
  },
};

export const uploadWallpaper = async (formData) => {
  const response = await fetch("/api/wallpapers", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload wallpaper");
  }
  return await response.json();
};

export const searchWallpapers = async (searchTerm) => {
  const response = await api.get("/wallpapers");
  const allWallpapers = response.data.wallpapers;

  const filteredWallpapers = allWallpapers.filter((wallpaper) =>
    wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filteredWallpapers;
};

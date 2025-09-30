import api from "./api";

export const wallpaperService = {
  getAllWallpapers: async (params = {}) => {
    const response = await api.get("/wallpapers", { params });
    return response.data;
  },

  getWallpaperById: async (id) => {
    const response = await api.get(`/wallpapers/${id}`);
    return response.data;
  },

  createWallpaper: async (wallpaperData) => {
    const response = await api.post("/wallpapers", wallpaperData);
    return response.data;
  },

  updateWallpaper: async (id, wallpaperData) => {
    const response = await api.put(`/wallpapers/${id}`, wallpaperData);
    return response.data;
  },

  deleteWallpaper: async (id) => {
    const response = await api.delete(`/wallpapers/${id}`);
    return response.data;
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

export const searchWallpapers = async (searchTerm) => {
  const response = await api.get("/wallpapers");
  const allWallpapers = response.data.wallpapers;

  const filteredWallpapers = allWallpapers.filter((wallpaper) =>
    wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filteredWallpapers;
};

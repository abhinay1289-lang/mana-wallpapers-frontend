import api from "./api";

export const downloadService = {
  generateDownloadUrl: async (token) => {
    const response = await api.get(`/download/${token}`);
    return response.data;
  },

  createFreeDownload: async (wallpaperId) => {
    const response = await api.post(`/download/free/${wallpaperId}`);
    return response.data;
  },

  getUserDownloads: async () => {
    const response = await api.get("/downloads");
    return response.data;
  },
};

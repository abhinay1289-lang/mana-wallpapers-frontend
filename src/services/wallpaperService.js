import api from "./api";
import { dummyWallpapers } from '../data/dummyWallpapers';

export const wallpaperService = {
  getAllWallpapers: async (params = {}) => {
    // const response = await api.get("/wallpapers", { params });
    // return response.data;
    return new Promise(resolve => setTimeout(() => resolve(dummyWallpapers), 500));
  },

  getWallpaperById: async (id) => {
    // const response = await api.get(`/wallpapers/${id}`);
    // return response.data;
    return new Promise(resolve => setTimeout(() => resolve(dummyWallpapers.find(w => w._id === id)), 500));
  },

  createWallpaper: async (wallpaperData) => {
    // const response = await api.post("/wallpapers", wallpaperData);
    // return response.data;
    return new Promise(resolve => setTimeout(() => {
      const newWallpaper = { ...wallpaperData, _id: String(dummyWallpapers.length + 1) };
      dummyWallpapers.push(newWallpaper);
      resolve(newWallpaper);
    }, 500));
  },

  updateWallpaper: async (id, wallpaperData) => {
    // const response = await api.put(`/wallpapers/${id}`, wallpaperData);
    // return response.data;
    return new Promise(resolve => setTimeout(() => {
      const index = dummyWallpapers.findIndex(w => w._id === id);
      if (index !== -1) {
        dummyWallpapers[index] = { ...dummyWallpapers[index], ...wallpaperData };
        resolve(dummyWallpapers[index]);
      } else {
        resolve(null);
      }
    }, 500));
  },

  deleteWallpaper: async (id) => {
    // const response = await api.delete(`/wallpapers/${id}`);
    // return response.data;
    return new Promise(resolve => setTimeout(() => {
      const index = dummyWallpapers.findIndex(w => w._id === id);
      if (index !== -1) {
        dummyWallpapers.splice(index, 1);
        resolve({ message: 'Wallpaper deleted successfully' });
      } else {
        resolve(null);
      }
    }, 500));
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
    const imageFile = formData.get('image');
    if (!imageFile) {
        throw new Error('Image file is missing');
    }

    // 1. Get a presigned URL for upload
    const { url: presignedUrl, key } = await wallpaperService.generateUploadUrl(imageFile.name, imageFile.type);

    // 2. Upload the file to the presigned URL
    await wallpaperService.uploadFile(presignedUrl, imageFile);

    // 3. Create the wallpaper metadata in the database
    const wallpaperData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()),
        imageUrl: key
    };

    return await wallpaperService.createWallpaper(wallpaperData);
};


export const searchWallpapers = async (searchTerm) => {
  const response = await api.get("/wallpapers");
  const allWallpapers = response.data.wallpapers;

  const filteredWallpapers = allWallpapers.filter((wallpaper) =>
    wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filteredWallpapers;
};

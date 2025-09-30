import { wallpaperService } from "./wallpaperService";

export const uploadService = {
  uploadWallpaper: async (file, metadata) => {
    try {
      // Step 1: Get presigned URL
      const uploadUrlResponse = await wallpaperService.generateUploadUrl(
        file.name,
        file.type
      );

      const presignedUrl = uploadUrlResponse.data;

      // Extract S3 key from presigned URL
      const url = new URL(presignedUrl);
      const fileKey = url.pathname.substring(1); // Remove leading slash

      // Step 2: Upload file directly to S3
      await wallpaperService.uploadFile(presignedUrl, file);

      // Step 3: Create wallpaper record
      const wallpaperData = {
        ...metadata,
        fileKey: fileKey,
        format: file.type.split("/")[1]?.toUpperCase() || "UNKNOWN",
      };

      const wallpaperResponse = await wallpaperService.createWallpaper(
        wallpaperData
      );

      return wallpaperResponse;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  },

  uploadThumbnail: async (file) => {
    try {
      const uploadUrlResponse = await wallpaperService.generateUploadUrl(
        `thumb_${file.name}`,
        file.type
      );

      const presignedUrl = uploadUrlResponse.data;

      await wallpaperService.uploadFile(presignedUrl, file);

      const url = new URL(presignedUrl);
      const thumbnailKey = url.pathname.substring(1);

      return thumbnailKey;
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      throw error;
    }
  },
};

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadWallpaper } from "../services/wallpaperService";
import "../styles/UploadWallpaper.css";

const UploadWallpaper = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: uploadWallpaper,
    onSuccess: () => {
      queryClient.invalidateQueries("wallpapers");
      toast.success("Wallpaper uploaded successfully!");
      reset();
    },
    onError: (err) => {
      toast.error(`Error uploading wallpaper: ${err.message}`);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("tags", data.tags);
    formData.append("image", data.image[0]);
    mutate(formData);
  };

  return (
    <div className="upload-wallpaper-container">
      <h2 className="upload-wallpaper-title">Upload New Wallpaper</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="upload-wallpaper-form"
      >
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="error-message">{errors.title.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="error-message">{errors.description.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be a positive number" },
            })}
          />
          {errors.price && (
            <p className="error-message">{errors.price.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            {...register("category", { required: "Category is required" })}
          />
          {errors.category && (
            <p className="error-message">{errors.category.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            {...register("tags", { required: "Tags are required" })}
          />
          {errors.tags && (
            <p className="error-message">{errors.tags.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="error-message">{errors.image.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Wallpaper"}
        </button>
      </form>
    </div>
  );
};

export default UploadWallpaper;

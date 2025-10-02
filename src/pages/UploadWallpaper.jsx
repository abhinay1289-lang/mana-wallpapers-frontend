import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { categories } from "../data/categories";

import { uploadWallpaper } from "../services/wallpaperService";
import "../styles/UploadWallpaper.css";

const UploadWallpaper = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      category: "2d-wallpaper-types",
    },
  });
  const queryClient = useQueryClient();

  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const categoryValue = watch("category");
  const subCategoryValue = watch("subCategory");

  useEffect(() => {
    if (categoryValue) {
      const selectedCategory = categories.find(
        (cat) => cat.name.toLowerCase().replace(/ /g, '-') === categoryValue
      );
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories);
        setValue("subCategory", "");
        setSubSubCategories([]);
        setValue("subSubCategory", "");
      }
    } else {
      setSubCategories([]);
      setValue("subCategory", "");
      setSubSubCategories([]);
      setValue("subSubCategory", "");
    }
  }, [categoryValue, setValue]);

  useEffect(() => {
    if (subCategoryValue) {
      const selectedSubCategory = subCategories.find(
        (subCat) => subCat.name.toLowerCase().replace(/ /g, '-') === subCategoryValue
      );
      if (selectedSubCategory) {
        setSubSubCategories(selectedSubCategory.items);
        setValue("subSubCategory", "");
      }
    } else {
      setSubSubCategories([]);
      setValue("subSubCategory", "");
    }
  }, [subCategoryValue, subCategories, setValue]);

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
    formData.append("subCategory", data.subCategory);
    formData.append("subSubCategory", data.subSubCategory);
    formData.append("dimension", data.dimension);
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
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name.toLowerCase().replace(/ /g, '-')}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="error-message">{errors.category.message}</p>
          )}
        </div>
        {subCategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subCategory">Sub Category</label>
            <select
              id="subCategory"
              {...register("subCategory", { required: "Sub Category is required" })}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subCat) => (
                <option
                  key={subCat.name}
                  value={subCat.name.toLowerCase().replace(/ /g, '-')}
                >
                  {subCat.name}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="error-message">{errors.subCategory.message}</p>
            )}
          </div>
        )}
        {subSubCategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subSubCategory">Sub Sub Category</label>
            <select
              id="subSubCategory"
              {...register("subSubCategory")}
            >
              <option value="">Select Sub Sub Category</option>
              {subSubCategories.map((item) => (
                <option key={item} value={item.toLowerCase().replace(/ /g, '-')}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="dimension">Dimension</label>
          <select
            id="dimension"
            {...register("dimension", { required: "Dimension is required" })}
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
            <option value="mixed">Mixed</option>
          </select>
          {errors.dimension && (
            <p className="error-message">{errors.dimension.message}</p>
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

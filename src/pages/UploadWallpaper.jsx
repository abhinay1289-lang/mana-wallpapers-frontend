import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadWallpaper } from "../services/wallpaperService";
import "../styles/UploadWallpaper.css";
import { getAllcategoriesStructure } from "../store/thunks/wallpaperThunk";
import { useDispatch, useSelector } from "react-redux";

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
      isFree: false,
    },
  });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const { categories } = useSelector((state) => state.wallpaper);

  const categoryValue = watch("category");
  const subCategoryValue = watch("subCategory");

  useEffect(() => {
    dispatch(getAllcategoriesStructure());
  }, []);

  useEffect(() => {
    if (categoryValue) {
      const selectedCategory = categories?.find(
        (cat) => cat.name.toLowerCase().replace(/ /g, "-") === categoryValue
      );
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories);
        setValue("subCategory", "");
        setSubSubCategories([]);
        setValue("subSubCategory", "");
      } else {
        setSubCategories([]);
        setValue("subCategory", "");
      }
    } else {
      setSubCategories([]);
      setValue("subCategory", "");
    }
  }, [categoryValue, setValue]);

  useEffect(() => {
    if (subCategoryValue) {
      const selectedSubCategory = subCategories.find(
        (subCat) =>
          subCat.name.toLowerCase().replace(/ /g, "-") === subCategoryValue
      );
      if (selectedSubCategory) {
        setSubSubCategories(selectedSubCategory.items);
        setValue("subSubCategory", "");
      } else {
        setSubSubCategories([]);
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
    // Exclude image from wallpaperDto, put rest as JSON string
    const { image, ...wallpaperDto } = data;
    formData.append("wallpaperDto", JSON.stringify(wallpaperDto));

    // Attach the image file
    if (image && image[0]) {
      formData.append("file", image[0]);
    }
    formData.append("uploadedBy", user.userId);
    mutate(formData);
  };

  return (
    <div className="upload-wallpaper-container">
      <h2 className="upload-wallpaper-title">Upload New Wallpaper</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="upload-wallpaper-form">
        <div className="form-group full-width">
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

        <div className="form-group full-width">
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

        <div className="form-group full-width">
          <label htmlFor="image">Wallpaper Image</label>
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

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
          >
            <option value="category">Select Category</option>
            {categories.map((cat) => (
              <option
                key={cat.name}
                value={cat.name.toLowerCase().replace(/ /g, "-")}
              >
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="error-message">{errors.category.message}</p>
          )}
        </div>

        {subCategories?.length > 0 && (
          <div className="form-group">
            <label htmlFor="subCategory">Sub Category</label>
            <select
              id="subCategory"
              {...register("subCategory", {
                required: "Sub Category is required",
              })}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subCat) => (
                <option
                  key={subCat.name}
                  value={subCat.name.toLowerCase().replace(/ /g, "-")}
                >
                  {subCat.name}
                </option>
              ))}
            </select>
            {errors?.subCategory && (
              <p className="error-message">{errors.subCategory.message}</p>
            )}
          </div>
        )}

        {subSubCategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subSubCategory">Detail</label>
            <select id="subSubCategory" {...register("subSubCategory")}>
              <option value="">Select Detail</option>
              {subSubCategories.map((item) => (
                <option
                  key={item?.id}
                  value={item.name?.toLowerCase().replace(/ /g, "-")}
                >
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="resolution">Resolution</label>
          <select
            id="resolution"
            {...register("resolution", { required: "Resolution is required" })}
          >
            <option value="">Select Resolution</option>
            <option value="1920x1080">1920x1080</option>
            <option value="2560x1440">2560x1440</option>
            <option value="3840x2160">3840x2160</option>
            <option value="1366x768">1366x768</option>
            <option value="1440x900">1440x900</option>
            <option value="360x640">360x640</option>
            <option value="390x844">390x844</option>
            <option value="1080x2400">1080x2400</option>
            <option value="1440x3200">1440x3200</option>
          </select>
          {errors.resolution && (
            <p className="error-message">{errors.resolution.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="format">Format</label>
          <select
            id="format"
            {...register("format", { required: "Format is required" })}
          >
            <option value="">Select Format</option>
            <option value="jpeg">JPEG (JPG)</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="svg">SVG</option>
            <option value="gif">GIF</option>
          </select>
          {errors.format && (
            <p className="error-message">{errors.format.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
          />
          {errors.price && (
            <p className="error-message">{errors.price.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            {...register("currency", { required: "Currency is required" })}
          >
            <option value="">Select Currency</option>
            <option value="IND">IND</option>
            <option value="USD">USD</option>
          </select>
          {errors.currency && (
            <p className="error-message">{errors.currency.message}</p>
          )}
        </div>

        <div className="form-group-checkbox full-width">
          <input type="checkbox" id="isFree" {...register("isFree")} />
          <label htmlFor="isFree">This is a free wallpaper</label>
        </div>

        <button
          type="submit"
          className="submit-btn full-width"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Wallpaper"}
        </button>
      </form>
    </div>
  );
};

export default UploadWallpaper;

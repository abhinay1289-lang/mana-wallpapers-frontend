
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { uploadWallpaper } from "../features/thunks/wallpapersThunks";
import { categories } from "../data/categories";
import toast from "react-hot-toast";

const Input = styled("input")({
  display: "none",
});

const UploadWallpaper = () => {
  const dispatch = useDispatch();
  const { status: uploadStatus, error: uploadError } = useSelector(
    (state) => state.wallpapers
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      isFree: false,
      priceCents: 0,
      tags: "",
    },
  });

  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const categoryValue = watch("category");
  const subCategoryValue = watch("subCategory");

  useEffect(() => {
    if (categoryValue) {
      const selectedCategory = categories.find(
        (cat) => cat.name.toLowerCase().replace(/ /g, "-'") === categoryValue
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
          subCat.name.toLowerCase().replace(/ /g, "-'") === subCategoryValue
      );
      if (selectedSubCategory && selectedSubCategory.items) {
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image") {
        formData.append("imageFile", data.image[0]);
      } else if (key === "tags") {
        formData.append(key, data[key].split(",").map((tag) => tag.trim()));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await dispatch(uploadWallpaper(formData)).unwrap();
      toast.success("Wallpaper uploaded successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to upload wallpaper");
    }
  };

  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="p-8">
        <Typography
          variant="h4"
          component="h1"
          className="font-bold text-center mb-8"
        >
          Upload New Wallpaper
        </Typography>

        {uploadError && (
          <Alert severity="error" className="mb-4">
            {uploadError.message || "An unexpected error occurred."}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="image"
                control={control}
                rules={{ required: "Image is required" }}
                render={({ field }) => (
                  <>
                    <label htmlFor="image-upload">
                      <Button variant="contained" component="span">
                        Choose Image
                      </Button>
                    </label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </>
                )}
              />
              {errors.image && (
                <Typography color="error" variant="caption">
                  {errors.image.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                defaultValue=""
                {...register("category", { required: "Category is required" })}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((cat) => (
                  <MenuItem
                    key={cat.name}
                    value={cat.name.toLowerCase().replace(/ /g, "-'")}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {subCategories.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Sub Category"
                  defaultValue=""
                  {...register("subCategory", {
                    required: "Sub Category is required",
                  })}
                  error={!!errors.subCategory}
                  helperText={errors.subCategory?.message}
                >
                  {subCategories.map((subCat) => (
                    <MenuItem
                      key={subCat.name}
                      value={subCat.name.toLowerCase().replace(/ /g, "-'")}
                    >
                      {subCat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {subSubCategories.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Detail"
                  defaultValue=""
                  {...register("subSubCategory")}
                >
                  {subSubCategories.map((item) => (
                    <MenuItem
                      key={item}
                      value={item.toLowerCase().replace(/ /g, "-'")}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resolution"
                {...register("resolution", {
                  required: "Resolution is required",
                })}
                error={!!errors.resolution}
                helperText={errors.resolution?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Format"
                {...register("format", { required: "Format is required" })}
                error={!!errors.format}
                helperText={errors.format?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                {...register("tags")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (in cents)"
                type="number"
                {...register("priceCents", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Price must be non-negative" },
                })}
                error={!!errors.priceCents}
                helperText={errors.priceCents?.message}
                disabled={watch("isFree")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox {...register("isFree")} />}
                label="Free Wallpaper"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={uploadStatus === "loading"}
                startIcon={uploadStatus === "loading" && <CircularProgress size={20} />}
              >
                {uploadStatus === "loading" ? "Uploading..." : "Upload"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadWallpaper;

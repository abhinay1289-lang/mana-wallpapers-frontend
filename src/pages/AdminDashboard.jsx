import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { wallpaperService } from "../services/wallpaperService";
import { uploadService } from "../services/uploadService";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch wallpapers
  const { data: wallpapersData, isLoading } = useQuery({
    queryKey: ["admin-wallpapers"],
    queryFn: () => wallpaperService.getAllWallpapers({ page: 0, size: 50 }),
  });

  // Upload wallpaper mutation
  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      const thumbnailKey = thumbnailFile
        ? await uploadService.uploadThumbnail(thumbnailFile)
        : null;

      return uploadService.uploadWallpaper(selectedFile, {
        ...data,
        thumbnailKey,
      });
    },
    onSuccess: () => {
      toast.success("Wallpaper uploaded successfully!");
      setUploadDialogOpen(false);
      reset();
      setSelectedFile(null);
      setThumbnailFile(null);
      queryClient.invalidateQueries(["admin-wallpapers"]);
    },
    onError: (error) => {
      toast.error("Failed to upload wallpaper");
      console.error(error);
    },
  });

  // Delete wallpaper mutation
  const deleteMutation = useMutation({
    mutationFn: wallpaperService.deleteWallpaper,
    onSuccess: () => {
      toast.success("Wallpaper deleted successfully!");
      queryClient.invalidateQueries(["admin-wallpapers"]);
    },
    onError: () => {
      toast.error("Failed to delete wallpaper");
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onSubmit = (data) => {
    if (!selectedFile) {
      toast.error("Please select a wallpaper file");
      return;
    }

    const formData = {
      title: data.title,
      description: data.description,
      priceCents: data.isFree ? null : Math.round(parseFloat(data.price) * 100),
      isFree: data.isFree,
      resolution: data.resolution,
      licenseText: data.licenseText,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    };

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this wallpaper?")) {
      deleteMutation.mutate(id);
    }
  };

  const stats = [
    {
      title: "Total Wallpapers",
      value: wallpapersData?.data?.totalElements || 0,
      icon: InventoryIcon,
      color: "primary",
    },
    {
      title: "Free Wallpapers",
      value: "12",
      icon: DashboardIcon,
      color: "success",
    },
    { title: "Paid Wallpapers", value: "8", icon: MoneyIcon, color: "warning" },
  ];

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent className="flex items-center">
                <Box className="flex-1">
                  <Typography variant="h4" className="font-bold">
                    {stat.value}
                  </Typography>
                  <Typography color="text.secondary">{stat.title}</Typography>
                </Box>
                <stat.icon sx={{ fontSize: 48 }} color={stat.color} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<InventoryIcon />} label="Wallpapers" />
            <Tab icon={<UploadIcon />} label="Upload" />
          </Tabs>
        </Box>

        <CardContent className="min-h-96">
          {/* Dashboard Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                className="mr-2"
              >
                Upload Wallpaper
              </Button>
            </Box>
          )}

          {/* Wallpapers Tab */}
          {tabValue === 1 && (
            <Box>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Manage Wallpapers
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Upload New
                </Button>
              </Box>

              <Grid container spacing={3}>
                {wallpapersData?.data?.content?.map((wallpaper) => (
                  <Grid item xs={12} sm={6} md={4} key={wallpaper.id}>
                    <Card>
                      <img
                        src={
                          wallpaper.thumbnailUrl ||
                          "https://via.placeholder.com/300x200?text=Wallpaper"
                        }
                        alt={wallpaper.title}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          className="font-semibold truncate"
                        >
                          {wallpaper.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {wallpaper.resolution} • {wallpaper.format}
                        </Typography>
                        <Box className="flex justify-between items-center mt-2">
                          {wallpaper.isFree ? (
                            <Chip label="FREE" color="success" size="small" />
                          ) : (
                            <Typography
                              variant="body2"
                              className="font-semibold"
                            >
                              ${(wallpaper.priceCents / 100).toFixed(2)}
                            </Typography>
                          )}
                          <Box>
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(wallpaper.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Upload Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Upload New Wallpaper
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Start Upload
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload New Wallpaper</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Title"
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register("description")}
            />

            <TextField
              fullWidth
              label="Resolution (e.g., 1920x1080)"
              {...register("resolution", {
                required: "Resolution is required",
              })}
              error={!!errors.resolution}
              helperText={errors.resolution?.message}
            />

            <FormControl fullWidth>
              <InputLabel>Is Free?</InputLabel>
              <Select {...register("isFree")} defaultValue={false}>
                <MenuItem value={true}>Yes, Free</MenuItem>
                <MenuItem value={false}>No, Paid</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Price (USD)"
              type="number"
              step="0.01"
              {...register("price")}
              helperText="Leave empty for free wallpapers"
            />

            <TextField
              fullWidth
              label="Tags (comma separated)"
              {...register("tags")}
              helperText="e.g., nature, landscape, mountains"
            />

            <TextField
              fullWidth
              label="License Text"
              multiline
              rows={2}
              {...register("licenseText")}
            />

            <Box>
              <Typography variant="body2" className="mb-2">
                Wallpaper File *
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
            </Box>

            <Box>
              <Typography variant="body2" className="mb-2">
                Thumbnail (Optional)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;

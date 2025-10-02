import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { categories } from "../data/categories";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const WallpaperManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [priceFilter, setPriceFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: wallpapersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "wallpapers",
      categoryFilter,
      searchTerm,
      sortBy,
      priceFilter,
      dimensionFilter,
    ],
    queryFn: () =>
      wallpaperService.getAllWallpapers({
        category: categoryFilter === "all" ? undefined : categoryFilter,
        q: searchTerm || undefined,
        sortBy,
        free: priceFilter === "" ? undefined : priceFilter === "true",
        dimension: dimensionFilter === "" ? undefined : dimensionFilter,
      }),
  });

  const { mutate: deleteWallpaper, isLoading: isDeleting } = useMutation({
    mutationFn: wallpaperService.deleteWallpaper,
    onSuccess: () => {
      toast.success("Wallpaper deleted successfully");
      queryClient.invalidateQueries("wallpapers");
    },
    onError: () => {
      toast.error("Failed to delete wallpaper");
    },
  });

  const getCategoryName = (slug) => {
    const category = categories.find(
      (c) => c.name.toLowerCase().replace(/ /g, "-") === slug
    );
    return category ? category.name : slug;
  };

  return (
    <Container maxWidth="xl" className="py-4 sm:py-8">
      <Box className="flex justify-between items-center mb-8">
        <Typography variant="h4" component="h1" className="font-bold">
          Wallpaper Management
        </Typography>
        <Button
          component={Link}
          to="/upload-wallpaper"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Wallpaper
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" className="mb-8">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search wallpapers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem
                  key={cat.name}
                  value={cat.name.toLowerCase().replace(/ /g, "-")}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt-desc">Latest</MenuItem>
              <MenuItem value="createdAt-asc">Oldest</MenuItem>
              <MenuItem value="title-asc">Title A-Z</MenuItem>
              <MenuItem value="title-desc">Title Z-A</MenuItem>
              <MenuItem value="priceCents-asc">Price Low-High</MenuItem>
              <MenuItem value="priceCents-desc">Price High-Low</MenuItem>
              <MenuItem value="popularity-desc">Popularity</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Price</InputLabel>
            <Select
              value={priceFilter}
              label="Price"
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Free</MenuItem>
              <MenuItem value="false">Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Dimension</InputLabel>
            <Select
              value={dimensionFilter}
              label="Dimension"
              onChange={(e) => setDimensionFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="2d">2D</MenuItem>
              <MenuItem value="3d">3D</MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Results */}
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <Typography color="error">
          Error loading wallpapers. Please try again.
        </Typography>
      ) : wallpapersData?.data?.content?.length > 0 ? (
        <Grid container spacing={3}>
          {wallpapersData.data.content.map((wallpaper) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={wallpaper.id}>
              <Card className="h-full flex flex-col">
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    wallpaper.thumbnailUrl ||
                    "https://via.placeholder.com/300x200?text=Wallpaper"
                  }
                  alt={wallpaper.title}
                />
                <CardContent className="flex-1">
                  <Typography variant="h6" className="font-semibold truncate">
                    {wallpaper.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryName(wallpaper.category)} /{" "}
                    {wallpaper.dimension.toUpperCase()}
                  </Typography>
                  {!wallpaper.isFree ? (
                    <Typography
                      variant="h6"
                      color="primary"
                      className="font-bold mt-1"
                    >
                      ${(wallpaper.priceCents / 100).toFixed(2)}
                    </Typography>
                  ) : (
                    <Chip
                      label="FREE"
                      color="success"
                      size="small"
                      className="mt-1"
                    />
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    component={Link}
                    to={`/admin/edit-wallpaper/${wallpaper.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteWallpaper(wallpaper.id || wallpaper._id)}
                    disabled={isDeleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="text-center py-16">
          <Typography variant="h5" color="text.secondary">
            No wallpapers found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            className="mt-2"
          >
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WallpaperManagement;

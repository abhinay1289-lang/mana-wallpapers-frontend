
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWallpaperById,
  createFreeDownload,
} from "../features/thunks/wallpapersThunks";
import { addToCart } from "../features/thunks/cartThunks";
import { categories } from "../data/categories";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    selected: wallpaper,
    status,
    error,
  } = useSelector((state) => state.wallpapers);

  useEffect(() => {
    if (id) {
      dispatch(fetchWallpaperById(id));
    }
  }, [dispatch, id]);

  const handleFreeDownload = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to download wallpapers");
      return;
    }

    try {
      const downloadUrl = await dispatch(createFreeDownload(wallpaper.data.id)).unwrap();
      window.open(downloadUrl.data, "_blank");
      toast.success("Download started!");
    } catch (error) {
      toast.error(error.message || "Failed to download wallpaper");
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart(wallpaper.data));
    toast.success("Added to cart!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const categoryName =
    categories.find(
      (c) =>
        c.name.toLowerCase().replace(/ /g, "-'") ===
        wallpaper?.data?.category
    )?.name || wallpaper?.data?.category;

  if (status === "loading") {
    return (
      <Container maxWidth="lg" className="py-4 sm:py-8">
        <Grid container spacing={{ xs: 2, md: 6 }}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="rectangular" height={150} className="mt-4" />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (status === "failed" || !wallpaper.data) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h5" color="error" className="text-center">
          {error?.message || "Wallpaper not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-4 sm:py-8">
      <Grid container spacing={{ xs: 2, md: 6 }}>
        {/* Wallpaper Preview */}
        <Grid item xs={12} md={8}>
          <Card className="overflow-hidden">
            <CardMedia
              component="img"
              image={
                wallpaper.data.imageUrl ||
                "https://via.placeholder.com/800x600?text=Wallpaper"
              }
              alt={wallpaper.data.title}
              className="w-full h-auto object-cover"
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={4}>
          <Box className="space-y-4">
            {/* Title and Price */}
            <Box>
              <Typography
                variant="h4"
                component="h1"
                className="font-bold mb-2"
              >
                {wallpaper.data.title}
              </Typography>

              <Box className="flex items-center gap-2 mb-4">
                {wallpaper.data.isFree ? (
                  <Chip label="FREE" color="success" size="medium" />
                ) : (
                  <Typography
                    variant="h5"
                    color="primary"
                    className="font-bold"
                  >
                    {`$${(wallpaper.data.priceCents / 100).toFixed(2)}`}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                className="mb-4"
              >
                {wallpaper.data.description}
              </Typography>
            </Box>

            {/* Details */}
            <Box className="space-y-2">
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {categoryName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Dimension:</strong> {wallpaper.data.dimension}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Resolution:</strong> {wallpaper.data.resolution}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Format:</strong> {wallpaper.data.format}
              </Typography>
              {wallpaper.data.tags && wallpaper.data.tags.length > 0 && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-2"
                  >
                    <strong>Tags:</strong>
                  </Typography>
                  <Box className="flex flex-wrap gap-1">
                    {wallpaper.data.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box className="space-y-3">
              {wallpaper.data.isFree ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleFreeDownload}
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Downloading..."
                    : "Download Free"}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}

              {/* Secondary Actions */}
              <Box className="flex gap-2">
                <IconButton onClick={handleShare} className="flex-1">
                  <ShareIcon />
                </IconButton>
                <IconButton className="flex-1">
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* License Info */}
            {wallpaper.data.licenseText && (
              <Box className="p-4 bg-gray-50 rounded-lg">
                <Typography variant="body2" className="font-semibold mb-1">
                  License:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {wallpaper.data.licenseText}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;

import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { downloadService } from "../services/downloadService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { categories } from "../data/categories";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: wallpaperData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallpaper", id],
    queryFn: () => wallpaperService.getWallpaperById(id),
    enabled: !!id,
  });

  const wallpaper = wallpaperData?.data;

  const handleFreeDownload = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to download wallpapers");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await downloadService.createFreeDownload(wallpaper.id);
      const downloadUrl = response.data;

      // Open download URL in new tab
      window.open(downloadUrl, "_blank");
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download wallpaper");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const categoryName = categories.find(c => c.name.toLowerCase().replace(/ /g, '-') === wallpaper?.category)?.name || wallpaper?.category;

  if (isLoading) {
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

  if (error || !wallpaper) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h5" color="error" className="text-center">
          Wallpaper not found
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
                wallpaper.thumbnailUrl ||
                "https://via.placeholder.com/800x600?text=Wallpaper"
              }
              alt={wallpaper.title}
              className="w-full h-auto object-cover"
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={4}>
          <Box className="space-y-4">
            {/* Title and Price */}
            <Box>
              <Typography variant="h4" component="h1" className="font-bold mb-2">
                {wallpaper.title}
              </Typography>

              <Box className="flex items-center gap-2 mb-4">
                {wallpaper.isFree ? (
                  <Chip label="FREE" color="success" size="medium" />
                ) : (
                  <Typography
                    variant="h5"
                    color="primary"
                    className="font-bold"
                  >
                    ₹{wallpaper.priceCents}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                className="mb-4"
              >
                {wallpaper.description}
              </Typography>
            </Box>

            {/* Details */}
            <Box className="space-y-2">
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {categoryName}
              </Typography>
               <Typography variant="body2" color="text.secondary">
                <strong>Dimension:</strong> {wallpaper.dimension}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Resolution:</strong> {wallpaper.resolution}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Format:</strong> {wallpaper.format}
              </Typography>
              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-2"
                  >
                    <strong>Tags:</strong>
                  </Typography>
                  <Box className="flex flex-wrap gap-1">
                    {wallpaper.tags.map((tag, index) => (
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
              {wallpaper.isFree ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleFreeDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Downloading..." : "Download Free"}
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
            {wallpaper.licenseText && (
              <Box className="p-4 bg-gray-50 rounded-lg">
                <Typography variant="body2" className="font-semibold mb-1">
                  License:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {wallpaper.licenseText}
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

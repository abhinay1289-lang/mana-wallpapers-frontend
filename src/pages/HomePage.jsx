import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Fab,
  Skeleton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { wallpaperService } from "../services/wallpaperService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import ThreeDBackground from "../components/common/ThreeDBackground";

const HomePage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const { data: wallpapersData, isLoading } = useQuery({
    queryKey: ["wallpapers", { page: 0, size: 12 }],
    queryFn: () => wallpaperService.getAllWallpapers({ page: 0, size: 12 }),
  });

  const handleAddToCart = (wallpaper) => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const categories = [
    {
      name: "Nature",
      slug: "nature",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    },
    {
      name: "Abstract",
      slug: "abstract",
      image:
        "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=300&h=200&fit=crop",
    },
    {
      name: "Technology",
      slug: "technology",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    },
    {
      name: "Space",
      slug: "space",
      image:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
    },
  ];

  return (
    <Box>
      <ThreeDBackground />
      {/* Hero Section */}
      <Box className="relative text-white py-40 text-center">
        <Container maxWidth="lg">
          <Typography variant="h2" className="font-bold mb-4 text-gradient">
            Find Your Next Wallpaper
          </Typography>
          <Typography variant="h5" className="opacity-80 max-w-2xl mx-auto">
            A universe of stunning wallpapers at your fingertips.
          </Typography>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" className="py-16">
        <Typography
          variant="h4"
          className="text-center font-bold mb-8 text-gradient"
        >
          Browse by Category
        </Typography>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.slug}>
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer group transform hover:-translate-y-2"
                component={Link}
                to={`/category/${category.slug}`}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  className="group-hover:opacity-80 transition-opacity"
                  style={{ borderRadius: "1rem" }}
                />
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Wallpapers */}
      <Box className="bg-secondary-color py-16">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            className="text-center font-bold mb-8 text-gradient"
          >
            Featured Wallpapers
          </Typography>

          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                      <CardContent>
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={20} width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : wallpapersData?.data?.content?.map((wallpaper) => (
                  <Grid item xs={12} sm={6} md={3} key={wallpaper.id}>
                    <Card className="hover:shadow-lg transition-shadow group transform hover:-translate-y-2">
                      <Box className="relative overflow-hidden">
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            wallpaper.thumbnailUrl ||
                            "https://via.placeholder.com/300x200?text=Wallpaper"
                          }
                          alt={wallpaper.title}
                          className="group-hover:scale-110 transition-transform duration-300"
                        />
                        {wallpaper.isFree && (
                          <Chip
                            label="FREE"
                            color="success"
                            size="small"
                            className="absolute top-2 left-2"
                          />
                        )}
                      </Box>

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
                        {!wallpaper.isFree && (
                          <Typography
                            variant="h6"
                            color="primary"
                            className="font-bold mt-1"
                          >
                            ${(wallpaper.priceCents / 100).toFixed(2)}
                          </Typography>
                        )}
                      </CardContent>

                      <CardActions className="p-4 pt-0">
                        <Button
                          fullWidth
                          variant={wallpaper.isFree ? "outlined" : "contained"}
                          startIcon={
                            wallpaper.isFree ? <DownloadIcon /> : <CartIcon />
                          }
                          onClick={() =>
                            wallpaper.isFree
                              ? window.open(
                                  `/wallpaper/${wallpaper.id}`,
                                  "_blank"
                                )
                              : handleAddToCart(wallpaper)
                          }
                        >
                          {wallpaper.isFree ? "Download" : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>

          <Box className="text-center mt-8">
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/category/all"
            >
              View All Wallpapers
            </Button>
          </Box>
        </Container>
      </Box>

      {user?.role === "ADMIN" && (
        <Fab
          color="primary"
          aria-label="upload"
          className="fixed bottom-8 right-8"
          component={Link}
          to="/admin"
        >
          <UploadIcon />
        </Fab>
      )}
    </Box>
  );
};

export default HomePage;

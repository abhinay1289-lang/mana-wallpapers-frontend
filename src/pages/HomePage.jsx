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
import { categories } from "../data/categories";

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

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <ThreeDBackground />
      </Box>
      {/* Hero Section */}
      <Box className="relative text-white py-20 sm:py-32 md:py-40 text-center">
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

        <Grid container spacing={4} style={{justifyContent: "space-between"}}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer group transform hover:-translate-y-2"
                component={Link}
                to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                 sx={{
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://source.unsplash.com/300x200/?${category.name}`}
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
                            ₹{wallpaper.priceCents}
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
          to="/admin/upload-wallpaper"
        >
          <UploadIcon />
        </Fab>
      )}
    </Box>
  );
};

export default HomePage;

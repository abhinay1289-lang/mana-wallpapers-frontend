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
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [freeFilter, setFreeFilter] = useState("");
  const { addToCart } = useCart();

  const { data: wallpapersData, isLoading } = useQuery({
    queryKey: ["wallpapers", slug, searchTerm, sortBy, freeFilter],
    queryFn: () =>
      wallpaperService.getAllWallpapers({
        category: slug === "all" ? undefined : slug,
        q: searchTerm || undefined,
        sortBy,
        free: freeFilter === "" ? undefined : freeFilter === "true",
        page: 0,
        size: 24,
      }),
  });

  const handleAddToCart = (wallpaper) => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const categoryNames = {
    nature: "Nature",
    abstract: "Abstract",
    technology: "Technology",
    space: "Space",
    minimalist: "Minimalist",
    artistic: "Artistic",
    all: "All Wallpapers",
  };

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h3" className="font-bold mb-4">
          {categoryNames[slug] || "Category"}
        </Typography>

        {/* Filters */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="createdAt">Latest</MenuItem>
                <MenuItem value="title">Title A-Z</MenuItem>
                <MenuItem value="priceCents">Price Low-High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Price Filter</InputLabel>
              <Select
                value={freeFilter}
                label="Price Filter"
                onChange={(e) => setFreeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Free Only</MenuItem>
                <MenuItem value="false">Paid Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : wallpapersData?.data?.content?.length > 0 ? (
          wallpapersData.data.content.map((wallpaper) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={wallpaper.id}>
              <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col">
                <Box className="relative overflow-hidden">
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      wallpaper.thumbnailUrl ||
                      "https://via.placeholder.com/300x200?text=Wallpaper"
                    }
                    alt={wallpaper.title}
                    className="group-hover:scale-105 transition-transform duration-300"
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

                <CardContent className="flex-1">
                  <Typography variant="h6" className="font-semibold truncate">
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
                        ? window.open(`/wallpaper/${wallpaper.id}`, "_blank")
                        : handleAddToCart(wallpaper)
                    }
                  >
                    {wallpaper.isFree ? "Download" : "Add to Cart"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
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
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CategoryPage;

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
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
  Brush,
  CameraAlt,
  Texture,
  Title,
  Animation,
  ViewInAr,
  ThreeDRotation,
  Camera,
  Business,
  Landscape,
  Pets,
  Memory,
  Theaters,
  FilterVintage,
  SportsEsports,
  WbSunny,
  Whatshot,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { categories } from "../data/categories";

const iconMap = {
  Brush: <Brush />,
  CameraAlt: <CameraAlt />,
  Texture: <Texture />,
  Title: <Title />,
  Animation: <Animation />,
  ViewInAr: <ViewInAr />,
  ThreeDRotation: <ThreeDRotation />,
  Camera: <Camera />,
  Business: <Business />,
  Landscape: <Landscape />,
  Pets: <Pets />,
  Memory: <Memory />,
  Theaters: <Theaters />,
  FilterVintage: <FilterVintage />,
  SportsEsports: <SportsEsports />,
  WbSunny: <WbSunny />,
  Whatshot: <Whatshot />,
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [priceFilter, setPriceFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(slug || "all");
  const { addToCart } = useCart();

  const getCategoryNameBySlug = (slug) => {
    if (!slug || slug === "all") {
      return "All Wallpapers";
    }
    for (const mainCat of categories) {
      const mainCatSlug = mainCat.name.toLowerCase().replace(/ /g, '-');
      if (mainCatSlug === slug) {
        return mainCat.name;
      }
      for (const subCat of mainCat.subCategories) {
        const subCatSlug = subCat.name.toLowerCase().replace(/ /g, '-');
        if (subCatSlug === slug) {
          return subCat.name;
        }
        for (const item of subCat.items) {
          const itemSlug = item.toLowerCase().replace(/ /g, '-');
          if (itemSlug === slug) {
            return item;
          }
        }
      }
    }
    return "All Wallpapers";
  };

  const { data: wallpapersData, isLoading } = useQuery({
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
        page: 0,
        size: 24,
      }),
  });

  const handleAddToCart = (wallpaper) => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const categoryName = getCategoryNameBySlug(categoryFilter);

  return (
    <Container maxWidth="xl" className="py-4 sm:py-8">
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          {categoryName}
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} alignItems="center">
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
                renderValue={(selected) => getCategoryNameBySlug(selected)}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map(mainCat => {
                  const items = [];
                  items.push(<ListSubheader key={mainCat.name}>{mainCat.name}</ListSubheader>);
                  mainCat.subCategories.forEach(subCat => {
                    items.push(
                      <MenuItem key={subCat.name} value={subCat.name.toLowerCase().replace(/ /g, '-')} >
                        {iconMap[subCat.icon] && <ListItemIcon>{iconMap[subCat.icon]}</ListItemIcon>}
                        <ListItemText primary={subCat.name} />
                      </MenuItem>
                    );
                    subCat.items.forEach(item => {
                      items.push(
                        <MenuItem key={item} value={item.toLowerCase().replace(/ /g, '-')} style={{ paddingLeft: '3em' }}>
                          <ListItemText primary={item} />
                        </MenuItem>
                      );
                    });
                  });
                  return items;
                })}
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
                <MenuItem value="createdAt">Latest</MenuItem>
                <MenuItem value="title">Title A-Z</MenuItem>
                <MenuItem value="title-desc">Title Z-A</MenuItem>
                <MenuItem value="priceCents">Price Low-High</MenuItem>
                <MenuItem value="priceCents-desc">Price High-Low</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
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

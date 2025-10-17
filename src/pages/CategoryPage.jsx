import { useEffect, useState } from "react";
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
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useGetAllcategoriesStructureQuery } from "../store/apis/wallpaperApi";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [priceFilter, setPriceFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(slug || "all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const { addToCart } = useCart();
  const { data: categoriesMapList } = useGetAllcategoriesStructureQuery();

  const [mainCategory, setMainCategory] = useState(slug || "all");
  const [subCategory, setSubCategory] = useState("all");
  const [miniSubCategory, setMiniSubCategory] = useState("all");

  const [subCategories, setSubCategories] = useState([]);
  const [miniSubCategories, setMiniSubCategories] = useState([]);

  useEffect(() => {
    setCategories(categoriesMapList?.data || []);
  }, [categoriesMapList?.data]);

  useEffect(() => {
    if (mainCategory === "all") {
      setSubCategories([]);
      setSubCategory("all");
    } else {
      const mainCat = categories.find(
        (cat) => cat.name.toLowerCase().replace(/ /g, "-") === mainCategory
      );
      setSubCategories(mainCat?.subCategories || []);
      setSubCategory("all");
    }
    setMiniSubCategories([]);
    setMiniSubCategory("all");
  }, [mainCategory, categories]);

  useEffect(() => {
    if (subCategory === "all") {
      setMiniSubCategories([]);
      setMiniSubCategory("all");
    } else {
      const subCat = subCategories.find(
        (cat) => cat.name.toLowerCase().replace(/ /g, "-") === subCategory
      );
      setMiniSubCategories(subCat?.items || []);
      setMiniSubCategory("all");
    }
  }, [subCategory, subCategories]);

  useEffect(() => {
    let activeFilter = "all";
    if (miniSubCategory !== "all") {
      activeFilter = miniSubCategory;
    } else if (subCategory !== "all") {
      activeFilter = subCategory;
    } else {
      activeFilter = mainCategory;
    }
    setCategoryFilter(activeFilter);
    setPage(1); // Reset page when filters change
  }, [mainCategory, subCategory, miniSubCategory]);

  const getCategoryNameBySlug = (slug) => {
    if (!slug || slug === "all") return "All Wallpapers";
    for (const mainCat of categories) {
      if (mainCat.name.toLowerCase().replace(/ /g, "-") === slug) return mainCat.name;
      for (const subCat of mainCat.subCategories) {
        if (subCat.name.toLowerCase().replace(/ /g, "-") === slug) return subCat.name;
        for (const item of subCat.items) {
          if (item.name.toLowerCase().replace(/ /g, "-") === slug) return item.name;
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
      page,
    ],
    queryFn: () =>
      wallpaperService.getAllWallpapers({
        category: categoryFilter === "all" ? undefined : categoryFilter,
        q: searchTerm || undefined,
        sortBy,
        free: priceFilter === "" ? undefined : priceFilter === "true",
        dimension: dimensionFilter === "" ? undefined : dimensionFilter,
        page: page - 1,
        size: 10,
      }),
  });

  const handleAddToCart = (wallpaper) => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const handleCategoryCardClick = (categorySlug, level) => {
    if (level === 'sub') {
      setSubCategory(categorySlug)
    } else if (level === 'mini') {
      setMiniSubCategory(categorySlug)
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    if (mainCategory === 'all') {
      return categories.map((cat) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={cat.name}>
          <Card onClick={() => handleCategoryCardClick(cat.name.toLowerCase().replace(/ /g, "-"), 'sub')} className="cursor-pointer hover:shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-semibold truncate">{cat.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    // Show sub-categories
    if (mainCategory !== 'all' && subCategory === 'all') {
      return subCategories.map((subCat) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={subCat.name}>
           <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col" onClick={() => handleCategoryCardClick(subCat.name.toLowerCase().replace(/ /g, "-"), 'mini')}>
          <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                image={'https://via.placeholder.com/300x200?text=Wallpaper'}
                alt={'Media'}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              { true && (
                <Chip label="FREE" color="success" size="small" className="absolute top-2 left-2" />
              )}
            </Box>
            <CardContent className="flex-1">
              <Typography variant="h6" className="font-semibold truncate">{subCat.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    // Show mini-sub-categories
    if (subCategory !== 'all' && miniSubCategory === 'all') {
      return miniSubCategories.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
          <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col" onClick={() => handleCategoryCardClick(item.name.toLowerCase().replace(/ /g, "-"), 'mini')}>
          <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                image={wallpaper?.thumbnailUrl || 'https://via.placeholder.com/300x200?text=Wallpaper'}
                alt={wallpaper?.title || 'Media'}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              {wallpaper?.isFree || true && (
                <Chip label="FREE" color="success" size="small" className="absolute top-2 left-2" />
              )}
            </Box>
            {/* <CardContent className="flex-1">
              <Typography variant="h6" className="font-semibold truncate">{wallpaper?.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {wallpaper?.resolution} • {wallpaper?.format}
              </Typography>
              {!wallpaper?.isFree && (
                <Typography variant="h6" color="primary" className="font-bold mt-1">
                  ₹{wallpaper?.priceCents}
                </Typography>
              )}
            </CardContent>
            <CardActions className="p-4 pt-0">
              <Button
                fullWidth
                variant={wallpaper?.isFree ? "outlined" : "contained"}
                startIcon={wallpaper?.isFree ? <DownloadIcon /> : <CartIcon />}
                onClick={() =>
                  wallpaper?.isFree
                    ? window.open(`/wallpaper/${wallpaper?.id}`, "_blank")
                    : handleAddToCart(wallpaper)
                }
              >
                {wallpaper?.isFree ? "Download" : "Add to Cart"}
              </Button>
            </CardActions> */}
          </Card>
        </Grid>
      ));
    }

    // Show wallpapers
    if (wallpapersData?.data?.content?.length > 0) {
      return wallpapersData.data.content.map((wallpaper) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={wallpaper.id}>
          <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col">
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                image={wallpaper.thumbnailUrl || 'https://via.placeholder.com/300x200?text=Wallpaper'}
                alt={wallpaper.title}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              {wallpaper.isFree && (
                <Chip label="FREE" color="success" size="small" className="absolute top-2 left-2" />
              )}
            </Box>
            <CardContent className="flex-1">
              <Typography variant="h6" className="font-semibold truncate">{wallpaper.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {wallpaper.resolution} • {wallpaper.format}
              </Typography>
              {!wallpaper.isFree && (
                <Typography variant="h6" color="primary" className="font-bold mt-1">
                  ₹{wallpaper.priceCents}
                </Typography>
              )}
            </CardContent>
            <CardActions className="p-4 pt-0">
              <Button
                fullWidth
                variant={wallpaper.isFree ? "outlined" : "contained"}
                startIcon={wallpaper.isFree ? <DownloadIcon /> : <CartIcon />}
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
      ));
    } 

    return (
      <Grid item xs={12}>
        <Box className="text-center py-16">
          <Typography variant="h5" color="text.secondary">No content found</Typography>
          <Typography variant="body1" color="text.secondary" className="mt-2">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      </Grid>
    );
  };

  const categoryName = getCategoryNameBySlug(categoryFilter);

  return (
    <Container maxWidth="xl" className="py-4 sm:py-8">
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          {categoryName}
        </Typography>

        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search..."
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
                value={mainCategory}
                label="Category"
                onChange={(e) => setMainCategory(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map((mainCat) => (
                  <MenuItem
                    key={mainCat.name}
                    value={mainCat.name.toLowerCase().replace(/ /g, "-")}
                  >
                    {mainCat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth disabled={!subCategories.length}>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={subCategory}
                label="Sub Category"
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {subCategories.map((subCat) => (
                  <MenuItem
                    key={subCat.name}
                    value={subCat.name.toLowerCase().replace(/ /g, "-")}
                  >
                    {subCat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth disabled={!miniSubCategories.length}>
              <InputLabel>Mini Sub Category</InputLabel>
              <Select
                value={miniSubCategory}
                label="Mini Sub Category"
                onChange={(e) => setMiniSubCategory(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {miniSubCategories.map((item) => (
                  <MenuItem
                    key={item.name}
                    value={item.name.toLowerCase().replace(/ /g, "-")}
                  >
                    {item.name}
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

      <Grid container spacing={3}>
        {renderContent()}
      </Grid>

      {wallpapersData?.data?.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={wallpapersData.data.totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;

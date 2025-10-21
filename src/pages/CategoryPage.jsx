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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wallpaperService } from "../services/wallpaperService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import {
  useGetAllcategoriesStructureQuery,
  useGetWallpapersQuery,
} from "../store/apis/wallpaperApi";
import getImage from "../components/common/getImage";

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
  const { data, isLoading, isFetching } = useGetWallpapersQuery(
    miniSubCategory?.id,
    {
      skip: !miniSubCategory?.id,
    }
  );
  const [wallPapersList, setWallpapersList] = useState([]);

  useEffect(() => {
    setCategories(categoriesMapList?.data || []);
  }, [categoriesMapList?.data]);

  useEffect(() => {
    setWallpapersList(data?.data);
  }, [data?.data]);

  useEffect(() => {
    filterAndSortWallpapers();
  }, [searchTerm, sortBy, priceFilter]);

  const filterAndSortWallpapers = () => {
    if (!data?.data) return [];
    let filtered = data?.data;

    if (searchTerm) {
      filtered = filtered.filter((wallpaper) =>
        wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (priceFilter) {
      filtered = filtered.filter((wallpaper) => wallpaper.isFree);
    } else if (priceFilter === false) {
      filtered = filtered.filter((wallpaper) => !wallpaper.isFree);
    }
    switch (sortBy) {
      case "createdAt":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "priceCents":
        filtered.sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
        break;
      case "priceCents-desc":
        filtered.sort((a, b) => (b.priceCents || 0) - (a.priceCents || 0));
        break;
      default:
        break;
    }
    setWallpapersList(filtered);
  };

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
      if (mainCat.name.toLowerCase().replace(/ /g, "-") === slug)
        return mainCat.name;
      for (const subCat of mainCat.subCategories) {
        if (subCat.name.toLowerCase().replace(/ /g, "-") === slug)
          return subCat.name;
        for (const item of subCat.items) {
          if (item.name.toLowerCase().replace(/ /g, "-") === slug)
            return item.name;
        }
      }
    }
    return "All Wallpapers";
  };

  const handleAddToCart = (wallpaper) => {
    addToCart(wallpaper);
    toast.success("Added to cart!");
  };

  const handleCategoryCardClick = (categorySlug, level) => {
    if (level === "sub") {
      setSubCategory(categorySlug);
    }
  };

  const handleDownload = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      });
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
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

    if (mainCategory === "all") {
      return categories.map((cat) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={cat.name}>
          <Card
            style={{ cursor: "pointer" }}
            className="hover:shadow-lg transition-shadow group h-full flex flex-col"
            onClick={() => {
              setMainCategory(cat.name.toLowerCase().replace(/ /g, "-"));
              handleCategoryCardClick(
                cat.name.toLowerCase().replace(/ /g, "-"),
                "sub"
              );
            }}
          >
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                onContextMenu={(e) => e.preventDefault()}
                image={getImage(cat.name)}
                alt={"Media"}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Box>
            <CardContent className="flex-1">
              <Typography
                variant="subtitle1"
                className="font-semibold truncate"
              >
                {cat.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    // Show sub-categories
    if (mainCategory !== "all" && subCategory === "all") {
      return subCategories.map((subCat) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={subCat.name}>
          <Card
            className="hover:shadow-lg transition-shadow group h-full flex flex-col"
            onClick={() => {
              setSubCategory(subCat.name.toLowerCase().replace(/ /g, "-"));
              handleCategoryCardClick(
                subCat.name.toLowerCase().replace(/ /g, "-"),
                "mini"
              );
            }}
          >
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                onContextMenu={(e) => e.preventDefault()}
                image={getImage(subCat.name)}
                alt={"Media"}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Box>
            <CardContent className="flex-1">
              <Typography
                variant="subtitle1"
                className="font-semibold truncate"
              >
                {subCat.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    // Show mini-sub-categories
    if (subCategory !== "all" && miniSubCategory === "all") {
      return miniSubCategories.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
          <Card
            className="hover:shadow-lg transition-shadow group h-full flex flex-col"
            onClick={() => {
              setMiniSubCategory(item);
              handleCategoryCardClick(
                item.name.toLowerCase().replace(/ /g, "-"),
                "mini"
              );
            }}
          >
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                onContextMenu={(e) => e.preventDefault()}
                image={getImage(item.name)}
                alt={"Media"}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Box>
            <CardContent className="flex-1">
              <Typography
                variant="subtitle1"
                className="font-semibold truncate"
              >
                {item.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }

    // Show wallpapers
    if (wallPapersList?.length > 0) {
      return wallPapersList?.map((wallpaper) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={wallpaper.id}>
          <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col">
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="200"
                onContextMenu={(e) => e.preventDefault()}
                image={wallpaper.fileKey}
                alt={wallpaper.title}
                loading="lazy"
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
              <Typography
                variant="subtitle1"
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
                size="small"
                variant={wallpaper.isFree ? "outlined" : "contained"}
                startIcon={wallpaper.isFree ? <DownloadIcon /> : <CartIcon />}
                onClick={() =>
                  wallpaper.isFree
                    ? handleDownload(
                        wallpaper.fileKey,
                        `${wallpaper.title}.png`
                      )
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
          <Typography variant="h6" color="text.secondary">
            No content found
          </Typography>
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
        <Typography variant="h5" component="h1" className="font-bold mb-4">
          {categoryName}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              style={{ borderRadius: "2rem" }}
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
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={mainCategory}
                label="Category"
                onChange={(e) => {
                  setMainCategory(e.target.value);
                }}
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
            <FormControl
              fullWidth
              disabled={!subCategories.length}
              size="small"
            >
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
            <FormControl
              fullWidth
              disabled={!miniSubCategories.length}
              size="small"
            >
              <InputLabel>Mini Sub Category</InputLabel>
              <Select
                value={miniSubCategory}
                label="Mini Sub Category"
                onChange={(e) => {
                  setMiniSubCategory(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {miniSubCategories.map((item) => (
                  <MenuItem key={item.name} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
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
            <FormControl fullWidth size="small">
              <InputLabel>Price</InputLabel>
              <Select
                value={priceFilter}
                label="Price"
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <MenuItem value={undefined}>All</MenuItem>
                <MenuItem value={true}>Free</MenuItem>
                <MenuItem value={false}>Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
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

      {data?.data.length > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={data.data.length}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;

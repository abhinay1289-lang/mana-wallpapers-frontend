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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import {
  useGetAllcategoriesStructureQuery,
  useGetWallpapersQuery,
  useLikeWallpaperMutation,
  useSaveWallpaperMutation,
} from "../store/apis/wallpaperApi";
// import "./../components/common/Common.css";

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [priceFilter, setPriceFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const { addToCart } = useCart();
  const { data: categoriesMapList } = useGetAllcategoriesStructureQuery();

  const [mainCategory, setMainCategory] = useState("all");
  const [saveWallpaper] = useSaveWallpaperMutation();
  const [likeWallpaper] = useLikeWallpaperMutation();

  const { data, isLoading, isFetching } = useGetWallpapersQuery(
    mainCategory?.id,
    {
      skip: !mainCategory?.id,
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

  useEffect(() => {
    const container = document.querySelector(".masonry-container");
    if (!container) return;

    const items = Array.from(container.querySelectorAll(".masonry-item"));
    if (!("IntersectionObserver" in window)) {
      // Fallback: make all visible
      items.forEach((it) => it.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, [wallPapersList, categories, mainCategory]);

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

  const getCategoryNameBySlug = (slug) => {
    if (!slug || slug === "all") return "All Wallpapers";
    for (const mainCat of categories) {
      if (mainCat.name.toLowerCase().replace(/ /g, "-") === slug)
        return mainCat.name;
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

  const handleSaveWallpaper = (id, isSaved) => {
    // Implement save wallpaper logic here
    saveWallpaper({ id, isLikedOrSaved: isSaved })
      .unwrap()
      .then(() => {
        toast.success("Wallpaper saved successfully!");
      })
      .catch(() => {});
  };

  const handleLikeWallpaper = (id, isLiked) => {
    // Implement save wallpaper logic here
    likeWallpaper({ id, isLikedOrSaved: isLiked })
      .unwrap()
      .then(() => {
        toast.success("Wallpaper liked successfully!");
      })
      .catch(() => {});
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return Array.from({ length: 10 }).map((_, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={index}
          style={{ marginBottom: "1rem" }}
        >
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

    if (mainCategory == "all") {
      return categories.map((cat) => (
        <div key={cat.id} className="masonry-item masonry-card">
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              cursor: "pointer",
              transition:
                "transform 0.35s cubic-bezier(.2,.9,.3,1), box-shadow 0.35s",
            }}
            onClick={() => {
              setMainCategory(cat);
              handleCategoryCardClick(
                cat.name.toLowerCase().replace(/ /g, "-"),
                "sub"
              );
            }}
          >
            <div className="card-media-wrap">
              <CardMedia
                component="img"
                image={cat?.imageUrl}
                alt={cat.name}
                className="card-media"
                onContextMenu={(e) => e.preventDefault()}
                loading="lazy"
              />
              <div className="card-overlay">
                <CardContent className="flex-1">
                  <Typography
                    variant="subtitle1"
                    className="font-semibold truncate"
                  >
                    {cat.name}
                  </Typography>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      ));
    }

    if (wallPapersList?.length > 0) {
      return wallPapersList.map((wallpaper) => (
        <div key={wallpaper.id} className="masonry-item masonry-card">
          <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col">
            <Box className="relative overflow-hidden">
              <CardMedia
                component="img"
                height="400"
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
              <div
                className="absolute top-2 right-2"
                style={{ gap: "1rem", display: "flex" }}
              >
                {wallpaper.isSaved ? (
                  <BookmarkRoundedIcon
                    fontSize="large"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() =>
                      handleSaveWallpaper(wallpaper.id, !wallpaper.isSaved)
                    }
                  />
                ) : (
                  <TurnedInNotIcon
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleSaveWallpaper(wallpaper.id, !wallpaper.isSaved)
                    }
                  />
                )}
                {wallpaper.isLiked ? (
                  <FavoriteRoundedIcon
                    fontSize="large"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() =>
                      handleLikeWallpaper(wallpaper.id, !wallpaper.isLiked)
                    }
                  />
                ) : (
                  <FavoriteBorderIcon
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleLikeWallpaper(wallpaper.id, !wallpaper.isLiked)
                    }
                  />
                )}
              </div>
            </Box>
            <div className="card-overlay">
              <CardContent>
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
              <Button
                fullWidth
                size="small"
                style={{
                  height: "3rem",
                  fontSize: "1rem",
                  width: "8rem",
                  borderColor: "#fff",
                  backgroundColor: "#f8f6f62b",
                  color: "#fff",
                }}
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
            </div>
          </Card>
        </div>
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

          <Grid item xs={6} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={mainCategory}
                label="Category"
                onChange={(e) => {
                  setMainCategory(e.target.value);
                }}
              >
                <MenuItem value={"all"}>All</MenuItem>
                {categories.map((mainCat) => {
                  return (
                    <MenuItem key={mainCat.id} value={mainCat}>
                      {mainCat.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={2}>
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

          <Grid item xs={6} sm={6} md={2}>
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
          <Grid item xs={6} sm={6} md={2}>
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

      <div>
        <div className="masonry-container">{renderContent()}</div>
      </div>

      {wallPapersList?.length > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={wallPapersList.length}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
          />
        </Box>
      )}
      <style>{`
        /* Masonry container built with CSS columns */
        .masonry-container {
          column-count: 2;
        }
        @media (min-width: 640px) { .masonry-container {column-count: 2; } }
        @media (min-width: 960px) { .masonry-container { column-count: 3; } }

        .masonry-item {
          display: inline-block;
          width: 100%;
          break-inside: avoid;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(24px) scale(0.995);
          transition: opacity 420ms cubic-bezier(.2,.9,.3,1), transform 420ms cubic-bezier(.2,.9,.3,1);
        }
        .masonry-item.is-visible { opacity: 1; transform: translateY(0) scale(1); }

        .card-media-wrap { position: relative; overflow: hidden; }
        .card-media { display: block; width: 100%; height: auto; transform-origin: center; transition: transform 0.6s cubic-bezier(.2,.9,.3,1) ; }

        .card-overlay {
          position: absolute;
          left: 12px;
          bottom: 12px;
          right: 12px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.48) 100%);
          color: white;
          padding: 14px;
          border-radius: 12px;
          transform: translateY(8px);
          opacity: 0;
          transition: opacity 260ms, transform 260ms;
        }

        .masonry-item:hover .card-media { transform: scale(1.07) rotate(-0.4deg) translateY(-6px); }
        .masonry-item:hover .card-overlay { opacity: 1; transform: translateY(0); }

        /* floating chip subtle animation */
        .chip-float { animation: floaty 6s ease-in-out infinite; }
        .chip-float:nth-child(2) { animation-delay: 0.2s; }
        .chip-float:nth-child(3) { animation-delay: 0.4s; }
        @keyframes floaty {
          0%{ transform: translateY(0) }
          50%{ transform: translateY(-6px) }
          100%{ transform: translateY(0) }
        }

        /* reveal effect uses is-visible class added by IntersectionObserver */
        .masonry-card { will-change: transform, opacity; }

        /* Admin FAB style */
        .upload-fab { box-shadow: 0 12px 40px rgba(16,24,40,0.5); }

        /* colorful animated gradient for the main heading */
        .text-gradient {
          background: linear-gradient(90deg,
            #ff6b6b 0%,
            #ff9f43 16%,
            #ffd93d 32%,
            #6beaa7 48%,
            #7dd3fc 64%,
            #a78bfa 80%,
            #ff6b6b 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradientShift 6s linear infinite;
          font-weight: 800;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* make sure images are crisp on hover */
        img.card-media { border-radius: 12px; display:block; }
      `}</style>
    </Container>
  );
};

export default CategoryPage;

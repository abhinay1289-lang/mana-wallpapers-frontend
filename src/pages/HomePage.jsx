import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Fab,
  Skeleton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ThreeDBackground from "../components/common/ThreeDBackground";
import { useAuth } from "../context/AuthContext";
import { useGetAllcategoriesStructureQuery } from "../store/apis/wallpaperApi";
import getImage from "../components/common/getImage";

const HomePage = () => {
  const { user } = useAuth();
  const { data: categoriesMapList, isLoading } =
    useGetAllcategoriesStructureQuery();
  const [categories, setCategories] = useState([]);
  // Removed TypeScript generic since this is a .jsx file
  const heroRef = useRef(null);

  useEffect(() => {
    setCategories(categoriesMapList?.data || []);
  }, [categoriesMapList?.data]);

  // Parallax effect for ThreeDBackground -> subtle translate on scroll
  useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY;
      if (heroRef.current) {
        // transform background slightly depending on scroll position -- smooth and subtle
        heroRef.current.style.transform = `translateY(${Math.min(
          sc * 0.1,
          80
        )}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver to stagger reveal of masonry cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(".masonry-card")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [categories]);

  return (
    <Box>
      {/* Parallax / 3D background container */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
          transition: "transform 0.2s ease-out",
        }}
        ref={heroRef}
      >
        <ThreeDBackground />
      </Box>

      {/* Hero */}
      <Box className="relative text-white py-24 sm:py-32 text-center">
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{ fontWeight: 800, fontSize: { xs: 28, md: 48 } }}
            className="mb-4 text-gradient"
          >
            Discover & Collect Beautiful Wallpapers
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.85, maxWidth: 900, margin: "0 auto" }}
            className="mb-6"
          >
            Curated wallpapers from artists around the world. Browse by
            category, save your favorites, or purchase premium artwork.
          </Typography>

          {/* Search bar like Pinterest */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: 760,
              margin: "12px auto 0",
              background: "rgba(255,255,255,0.06)",
              padding: "8px",
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              backdropFilter: "blur(6px)",
            }}
          >
            <SearchIcon sx={{ marginLeft: 1, opacity: 0.8 }} />
            <input
              style={{ border: "none" }}
              placeholder="Search wallpapers, e.g. forests, abstract, 3D"
              className="w-full bg-transparent outline-none px-4 py-2 text-white placeholder:opacity-70"
            />
            <Button
              variant="contained"
              sx={{ borderRadius: 2, marginRight: 1 }}
            >
              Search
            </Button>
          </Box>

          {/* Category chips carousel */}
          <Box
            sx={{
              mt: 6,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {(categories.length
              ? categories.slice(0, 12)
              : Array.from({ length: 8 })
            ).map((c, i) => (
              <Chip
                key={c?.name || i}
                label={
                  c?.name || (
                    <span className="inline-block w-16 h-3 rounded-md bg-gray-600 animate-pulse" />
                  )
                }
                clickable
                className="chip-float"
                sx={{
                  padding: "6px 12px",
                  fontWeight: 600,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
                  backdropFilter: "blur(4px)",
                }}
                component={c?.name ? Link : "div"}
                to={
                  c?.name
                    ? `/category/${c.name.toLowerCase().replace(/ /g, "-")}`
                    : undefined
                }
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Masonry categories grid */}
      <Container maxWidth="lg" className="py-12">
        <Typography
          variant="h4"
          className="text-center font-bold mb-8 text-gradient"
        >
          Explore Categories
        </Typography>

        {/* Masonry using CSS columns for responsive Pinterest-like layout */}
        <div className="masonry-container" style={{ columnGap: 20 }}>
          {isLoading
            ? // show placeholder skeleton cards
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="masonry-item">
                  <Card sx={{ borderRadius: 3 }}>
                    <Skeleton
                      variant="rectangular"
                      height={220}
                      animation="wave"
                    />
                    <CardContent>
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={16} width="40%" />
                    </CardContent>
                  </Card>
                </div>
              ))
            : categories.map((category) => (
                <div key={category.id} className="masonry-item masonry-card">
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition:
                        "transform 0.35s cubic-bezier(.2,.9,.3,1), box-shadow 0.35s",
                    }}
                    component={Link}
                    to={`/category/${category.name
                      ?.toLowerCase()
                      .replace(/ /g, "-")}`}
                  >
                    <div className="card-media-wrap">
                      <CardMedia
                        component="img"
                        image={category?.imageUrl}
                        alt={category.name}
                        className="card-media"
                        onContextMenu={(e) => e.preventDefault()}
                        loading="lazy"
                      />
                      <div className="card-overlay">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                          Browse collection
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
        </div>

        <Box className="text-center mt-10">
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

      {/* Floating Upload action for admin */}
      {user?.role === "ADMIN" && (
        <Fab
          color="primary"
          aria-label="upload"
          className="fixed bottom-8 right-8 upload-fab"
          component={Link}
          to="/admin/upload-wallpaper"
        >
          <UploadIcon />
        </Fab>
      )}

      {/* Local styles for the enhanced UI (scoped classes) */}
      <style>{`
        /* Masonry container built with CSS columns */
        .masonry-container {
          column-count: 2;
        }
        @media (min-width: 640px) { .masonry-container {column-count: 2; } }
        @media (min-width: 960px) { .masonry-container { column-count: 3; } }

        .masonry-item { 
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
    </Box>
  );
};

export default HomePage;

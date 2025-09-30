import { Box, Container, Typography, Link, Grid } from "@mui/material";
import { Facebook, Twitter, Instagram, GitHub } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box component="footer" className="bg-gray-900 text-white py-12 mt-auto">
      <Container maxWidth="xl">
        <Grid container spacing={4} style={{marginLeft:'0px'}}>
          {/* Company Info */}
          <Grid item xs={12} md={4} style={{ padding: "0rem" }}>
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Mana Wallpapers"
                style={{ height: "10rem" }}
              />
            </div>
            <Typography variant="body2" className="text-gray-300 mb-4">
              Discover and download premium wallpapers for your devices. From
              nature to abstract art, find the perfect backdrop for your screen.
            </Typography>
            <Box className="flex space-x-4">
              <Link href="#" color="inherit" className="hover:text-indigo-400">
                <Facebook />
              </Link>
              <Link href="#" color="inherit" className="hover:text-indigo-400">
                <Twitter />
              </Link>
              <Link href="#" color="inherit" className="hover:text-indigo-400">
                <Instagram />
              </Link>
              <Link href="#" color="inherit" className="hover:text-indigo-400">
                <GitHub />
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className="font-semibold mb-4">
              Categories
            </Typography>
            <Box className="space-y-2">
              <Link
                href="/category/nature"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Nature
              </Link>
              <Link
                href="/category/abstract"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Abstract
              </Link>
              <Link
                href="/category/technology"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Technology
              </Link>
              <Link
                href="/category/space"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Space
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Support
            </Typography>
            <Box className="space-y-2">
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Help Center
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Contact Us
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                License Info
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Refund Policy
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Legal
            </Typography>
            <Box className="space-y-2">
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                Cookie Policy
              </Link>
              <Link
                href="#"
                color="inherit"
                className="block text-gray-300 hover:text-white no-underline"
              >
                DMCA
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box className="border-t border-gray-700 mt-8 pt-8 text-center">
          <Typography variant="body2" className="text-gray-400">
            © {new Date().getFullYear()} Mana Wallpapers. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

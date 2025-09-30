import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Search from "./Search";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const cartItemCount = getItemCount();

  const mobileMenuItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleMobileMenu}
      onKeyDown={toggleMobileMenu}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/category/nature">
          <ListItemText primary="Nature" />
        </ListItem>
        <ListItem button component={Link} to="/category/abstract">
          <ListItemText primary="Abstract" />
        </ListItem>
        <ListItem button component={Link} to="/category/technology">
          <ListItemText primary="Technology" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" className="bg-header-color shadow-md">
      <Container maxWidth="xl">
        <Toolbar className="flex justify-between">
          {/* Logo */}
          <Link to="/" className="no-underline flex items-center">
            <img
              src="/logo.png"
              alt="Mana Wallpapers"
              style={{ height: "5rem" }}
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-grow mx-8 hidden md:block">
            <Search />
          </div>

          {/* Navigation Links */}
          <Box className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-text-color hover:text-indigo-400 no-underline"
            >
              <Button style={{ color: "#fff" }}>Home</Button>
            </Link>
            <Link
              to="/category/nature"
              className="text-text-color hover:text-indigo-400 no-underline"
            >
              <Button style={{ color: "#fff" }}>Nature</Button>
            </Link>
            <Link
              to="/category/abstract"
              className="text-text-color hover:text-indigo-400 no-underline"
            >
              <Button style={{ color: "#fff" }}>Abstract</Button>
            </Link>
            <Link
              to="/category/technology"
              className="text-text-color hover:text-indigo-400 no-underline"
            >
              <Button style={{ color: "#fff" }}>Technology</Button>
            </Link>
          </Box>

          {/* Right side buttons */}
          <Box className="flex items-center space-x-2">
            {/* Cart */}
            <Link to="/cart">
              <IconButton color="inherit" className="hover:bg-accent-color">
                <Badge badgeContent={cartItemCount} style={{ color: "#fff" }}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>

            {/* User Menu or Login/Register */}
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                  className="hover:bg-accent-color"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  classes={{ paper: "bg-secondary-color text-text-color" }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleMenuClose();
                    }}
                  >
                    <DashboardIcon className="mr-2" />
                    Dashboard
                  </MenuItem>
                  {user?.role === "ADMIN" && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        handleMenuClose();
                      }}
                    >
                      <DashboardIcon className="mr-2" />
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon className="mr-2" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box className="space-x-2 hidden md:flex">
                <Link to="/login">
                  <Button
                    style={{ color: "#fff" }}
                    className="hover:bg-accent-color"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained" color="primary">
                    Register
                  </Button>
                </Link>
              </Box>
            )}
            {/* Mobile Menu */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              className="md:hidden"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={toggleMobileMenu}
              classes={{ paper: "bg-secondary-color text-text-color" }}
            >
              {mobileMenuItems}
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

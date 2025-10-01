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
  People as PeopleIcon,
  CloudUpload as CloudUploadIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Description as ReportsIcon,
  PhotoLibrary as WallpaperManagementIcon,
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
    <div
      className="w-64"
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
    </div>
  );

  return (
    <AppBar position="sticky" className="bg-header-color shadow-md">
      <div className="container mx-auto px-4">
        <Toolbar className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline">
            <img
              src="/logo.png"
              alt="Mana Wallpapers"
              className="h-12 md:h-20"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-grow mx-4 md:mx-8">
            <Search />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              component={Link}
              to="/"
              style={{ color: "#fff" }}
              className="hover:text-indigo-400"
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/category/nature"
              style={{ color: "#fff" }}
              className="hover:text-indigo-400"
            >
              Nature
            </Button>
            <Button
              component={Link}
              to="/category/abstract"
              style={{ color: "#fff" }}
              className="hover:text-indigo-400"
            >
              Abstract
            </Button>
            <Button
              component={Link}
              to="/category/technology"
              style={{ color: "#fff" }}
              className="hover:text-indigo-400"
            >
              Technology
            </Button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            {user?.role === "BUYER" && (
              <IconButton
                component={Link}
                to="/buyer/cart"
                color="inherit"
                className="hover:bg-accent-color"
              >
                <Badge badgeContent={cartItemCount} style={{ color: "#fff" }}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

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
                  {user?.role === "ADMIN" ? (
                    [
                      <MenuItem
                        key="dashboard"
                        onClick={() => {
                          navigate("/admin");
                          handleMenuClose();
                        }}
                      >
                        <DashboardIcon className="mr-2" />
                        Dashboard
                      </MenuItem>,
                      <MenuItem
                        key="wallpaper-management"
                        onClick={() => {
                          navigate("/admin/wallpapers");
                          handleMenuClose();
                        }}
                      >
                        <WallpaperManagementIcon className="mr-2" />
                        Wallpaper Management
                      </MenuItem>,
                      <MenuItem
                        key="user-management"
                        onClick={() => {
                          navigate("/admin/users");
                          handleMenuClose();
                        }}
                      >
                        <PeopleIcon className="mr-2" />
                        User Management
                      </MenuItem>,
                      <MenuItem
                        key="upload-wallpaper"
                        onClick={() => {
                          navigate("/admin/upload-wallpaper");
                          handleMenuClose();
                        }}
                      >
                        <CloudUploadIcon className="mr-2" />
                        Upload Wallpaper
                      </MenuItem>,
                      <MenuItem
                        key="analytics"
                        onClick={() => {
                          navigate("/admin/analytics");
                          handleMenuClose();
                        }}
                      >
                        <BarChartIcon className="mr-2" />
                        Analytics
                      </MenuItem>,
                      <MenuItem
                        key="reports"
                        onClick={() => {
                          navigate("/admin/reports");
                          handleMenuClose();
                        }}
                      >
                        <ReportsIcon className="mr-2" />
                        Reports
                      </MenuItem>,
                      <MenuItem
                        key="settings"
                        onClick={() => {
                          navigate("/admin/settings");
                          handleMenuClose();
                        }}
                      >
                        <SettingsIcon className="mr-2" />
                        Settings
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        <LogoutIcon className="mr-2" />
                        Logout
                      </MenuItem>,
                    ]
                  ) : (
                    [
                      <MenuItem
                        key="dashboard"
                        onClick={() => {
                          navigate("/buyer/dashboard");
                          handleMenuClose();
                        }}
                      >
                        <DashboardIcon className="mr-2" />
                        Dashboard
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        <LogoutIcon className="mr-2" />
                        Logout
                      </MenuItem>,
                    ]
                  )}
                </Menu>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  component={Link}
                  to="/login"
                  style={{ color: "#fff" }}
                  className="hover:bg-accent-color"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </div>
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
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
};

export default Header;

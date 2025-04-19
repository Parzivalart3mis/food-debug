import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../State/Authentication/Action";

// Material UI imports
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Container,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { pink } from "@mui/material/colors";

// Components
import Auth from "../../pages/Auth/Auth";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { auth, cart } = useSelector((store) => store);

  // State management
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Derived states
  const isMenuOpen = Boolean(anchorEl);
  const isAuthenticated = Boolean(auth.user?.fullName);
  const isAdmin = auth.user?.role === "ROLE_ADMIN";
  const isRestaurantOwner = auth.user?.role === "ROLE_RESTAURANT_OWNER";
  const isAdminOrOwner = isAdmin || isRestaurantOwner;
  const cartItemCount = cart.cartItems.length;
  const userInitial = auth.user?.fullName?.[0]?.toUpperCase() || "?";

  // Menu handlers
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Navigation handlers
  const navigateTo = (path) => () => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseMenu();
  };

  const handleProfile = () => {
    navigate(isAdminOrOwner ? "/admin/restaurant" : "/my-profile");
    setDrawerOpen(false);
    handleCloseMenu();
  };

  const handleCloseAuthModel = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseMenu();
    setDrawerOpen(false);
  };

  // Mobile drawer content
  const drawerContent = (
      <Box sx={{ width: 280, height: '100%' }} role="presentation">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: pink.A400,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            MunchMate
          </Typography>
          <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {isAuthenticated && (
            <Box sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: pink[50]
            }}>
              <Avatar sx={{ bgcolor: pink.A400, color: 'white', mr: 2 }}>
                {userInitial}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {auth.user.fullName}
              </Typography>
            </Box>
        )}

        <List>
          <ListItem button onClick={navigateTo('/')}>
            <ListItemIcon>
              <HomeIcon sx={{ color: pink.A400 }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={navigateTo('/search')}>
            <ListItemIcon>
              <SearchIcon sx={{ color: pink.A400 }} />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>

          <ListItem button onClick={navigateTo('/cart')}>
            <ListItemIcon>
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon sx={{ color: pink.A400 }} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>

          {isAuthenticated ? (
              <>
                <ListItem button onClick={handleProfile}>
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: pink.A400 }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: pink.A700 }} />
                  </ListItemIcon>
                  <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ color: pink.A700 }}
                  />
                </ListItem>
              </>
          ) : (
              <ListItem button onClick={navigateTo('/account/login')}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: pink.A400 }} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
          )}
        </List>
      </Box>
  );

  return (
      <Box
          sx={{
            background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
            padding: { xs: '0.7rem 1rem', md: '0.7rem 2rem', lg: '0.7rem 5rem' },
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
          }}
      >
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo Section */}
            <Box
                onClick={navigateTo('/')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
            >
              <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '0.5px',
                    fontFamily: '"Poppins", "Roboto", sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                  }}
              >
                MunchMate
              </Typography>
            </Box>

            {/* Mobile menu button or Desktop Navigation */}
            {isMobile ? (
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={toggleDrawer(true)}
                    sx={{ color: 'white' }}
                >
                  <MenuIcon />
                </IconButton>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title="Search" arrow>
                    <IconButton
                        onClick={navigateTo('/search')}
                        sx={{
                          color: 'white',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>

                  {isAuthenticated ? (
                      <Tooltip title={isAdmin ? "Admin Menu" : "Profile"} arrow>
                        <IconButton
                            onClick={isAdmin ? handleOpenMenu : handleProfile}
                            sx={{ p: 0.5 }}
                        >
                          <Avatar
                              sx={{
                                bgcolor: 'white',
                                color: pink.A400,
                                transition: 'all 0.2s',
                                border: '2px solid transparent',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  border: '2px solid white'
                                },
                              }}
                          >
                            {userInitial}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                  ) : (
                      <Tooltip title="Login" arrow>
                        <IconButton
                            onClick={navigateTo('/account/login')}
                            sx={{
                              color: 'white',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                        >
                          <PersonIcon />
                        </IconButton>
                      </Tooltip>
                  )}

                  <Tooltip title="Cart" arrow>
                    <IconButton
                        onClick={navigateTo('/cart')}
                        sx={{
                          color: 'white',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                    >
                      <Badge
                          badgeContent={cartItemCount}
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: 'white',
                              color: pink.A400,
                              fontWeight: 'bold'
                            }
                          }}
                      >
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </Box>
            )}

            {/* User Menu */}
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleCloseMenu}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: '0px 5px 15px rgba(0,0,0,0.15)',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${pink[100]}` }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {auth.user?.fullName}
                </Typography>
              </Box>

              <MenuItem
                  onClick={navigateTo(isAdmin ? "/admin" : "/super-admin")}
                  sx={{ py: 1.5, '&:hover': { backgroundColor: pink[50] } }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" sx={{ color: pink.A400 }} />
                </ListItemIcon>
                <Typography variant="body2">Profile</Typography>
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1.5, '&:hover': { backgroundColor: pink[50] } }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: pink.A700 }} />
                </ListItemIcon>
                <Typography variant="body2" color={pink.A700}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Container>

        {/* Mobile navigation drawer */}
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
        >
          {drawerContent}
        </Drawer>

        <Auth handleClose={handleCloseAuthModel} />
      </Box>
  );
};

export default Navbar;

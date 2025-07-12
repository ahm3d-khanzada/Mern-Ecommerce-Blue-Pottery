"use client"

import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import LocalMallIcon from "@mui/icons-material/LocalMall"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {
  TrackChanges,
  Logout,
  Shop2,
  Store,
  Person,
  KeyboardArrowDown,
  Storefront,
  YouTube,
  DashboardCustomizeRounded,
  Menu as MenuIcon,
} from "@mui/icons-material"

import { Link, useNavigate } from "react-router-dom"
import { Avatar, Badge, Divider, Drawer, ListItemIcon, useMediaQuery, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { NavLogo } from "../utils/styles"
import { motion, AnimatePresence } from "framer-motion"

import Cart from "./customer/components/Cart"
import Search from "./customer/components/Search"
import ProductsMenu from "./customer/components/ProductsMenu"
import { updateCustomer } from "../redux/userHandle"

// Motion components
const MotionAppBar = motion(AppBar)
const MotionIconButton = motion(IconButton)
const MotionBadge = motion(Badge)
const MotionButton = motion(Button)
const MotionBox = motion(Box)
const MotionAvatar = motion(Avatar)
const MotionDrawer = motion(Drawer)

// Animation variants
const navbarVariants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
}

const iconVariants = {
  hover: {
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5,
    },
  },
}

const cartBadgeVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
}

const logoVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
  hover: {
    textShadow: "0px 0px 8px rgba(240, 231, 134, 0.7)",
    transition: { duration: 0.3 },
  },
}

const Navbar = () => {
  const { currentUser, currentRole } = useSelector((state) => state.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const totalQuantity =
    currentUser && currentUser.cartDetails && currentUser.cartDetails.reduce((total, item) => total + item.quantity, 0)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (currentRole === "Customer") {
      dispatch(updateCustomer(currentUser, currentUser._id))
    }
  }, [currentRole, currentUser, dispatch])

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElSign, setAnchorElSign] = React.useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const open = Boolean(anchorElUser)
  const openSign = Boolean(anchorElSign)

  const [isCartOpen, setIsCartOpen] = React.useState(false)

  // Cart
  const handleOpenCart = () => {
    setIsCartOpen(true)
  }

  const handleOpenTrack = () => {
    navigate('/Order-status-Customer')
  }


  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  // Navigation Menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  // Mobile Menu
  const handleOpenMobileMenu = () => {
    setMobileMenuOpen(true)
  }

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // User Menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  // Signin Menu
  const handleOpenSigninMenu = (event) => {
    setAnchorElSign(event.currentTarget)
  }

  const handleCloseSigninMenu = () => {
    setAnchorElSign(null)
  }

  const homeHandler = () => {
    navigate("/")
    if (mobileMenuOpen) {
      handleCloseMobileMenu()
    }
  }

  const navigateAndClose = (path) => {
    navigate(path)
    handleCloseMobileMenu()
    handleCloseUserMenu()
    handleCloseSigninMenu()
  }

  return (
    <MotionAppBar position="sticky" initial="hidden" animate="visible" variants={navbarVariants}>
      <Container
        maxWidth="xl"
        sx={{
          background: "linear-gradient(135deg, #03c5db, #f0e786)",
          boxShadow: "0 4px 20px rgba(3, 197, 219, 0.3)",
        }}
      >
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* MOBILE MENU ICON */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <MotionIconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenMobileMenu}
              color="inherit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{ color: "#1a365d" }}
            >
              <MenuIcon />
            </MotionIconButton>
          </Box>

          {/* LOGO - MOBILE & DESKTOP */}
          <HomeContainer
            sx={{
              flexGrow: { xs: 0, md: 1 },
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                letterSpacing: { xs: ".1rem", sm: ".2rem" },
                color: "#1a365d",
                textDecoration: "none",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              <NavLogo
                to="top"
                activeClass="active"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={homeHandler}
              >
                <MotionBox
                  component="span"
                  display="flex"
                  alignItems="center"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  {!isSmallMobile && (
                    <MotionIconButton
                      color="inherit"
                      sx={{ p: 0, mr: 1, color: "#1a365d" }}
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <LocalMallIcon />
                    </MotionIconButton>
                  )}
                  Blue Crafts Fusions
                </MotionBox>
              </NavLogo>
            </Typography>
          </HomeContainer>

          {/* DESKTOP NAVIGATION */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            <Search />
            <ProductsMenu dropName="Categories" />
            <ProductsMenu dropName="Products" />
          </Box>

          {/* MOBILE SEARCH ICON */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <MotionIconButton
              size="large"
              aria-label="search products"
              onClick={() => {
                navigate("/Search")
                handleCloseMobileMenu()
              }}
              color="inherit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{ color: "#1a365d" }}
            >
              <SearchIcon />
            </MotionIconButton>
          </Box>

          {/* DESKTOP SIGN IN */}
          {currentRole === null && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <MotionButton
                onClick={handleOpenSigninMenu}
                sx={{
                  my: 2,
                  color: "#1a365d",
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  px: 2,
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.4)",
                  },
                }}
                endIcon={<KeyboardArrowDown />}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Sign in
              </MotionButton>
              <Menu
                anchorEl={anchorElSign}
                id="menu-appbar"
                open={openSign}
                onClose={handleCloseSigninMenu}
                onClick={handleCloseSigninMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    ...styles.styledPaper,
                    "&:before": {
                      ...styles.styledPaper["&:before"],
                      background: "linear-gradient(135deg, #03c5db, #f0e786)",
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigateAndClose("/Customerlogin")}>
                  <MotionAvatar
                    sx={{
                      background: "linear-gradient(135deg, #03c5db, #f0e786)",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Person />
                  </MotionAvatar>
                  <StyledLink to="/Customerlogin">Sign in as customer</StyledLink>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.2)" }} />
                <MenuItem onClick={() => navigateAndClose("/Sellerlogin")}>
                  <ListItemIcon>
                    <Store fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/Sellerlogin">Sign in as seller</StyledLink>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* CUSTOMER CART & PROFILE */}
          {currentRole === "Customer" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="Track" arrow>
                <MotionIconButton
                  onClick={handleOpenTrack}
                  sx={{
                    color: "#1a365d",
                    p: 0,
                    mr: { xs: 1, sm: 2 },
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MotionBadge
                    color="error"
                    variants={cartBadgeVariants}
                    initial="initial"
                    animate="animate"
                    key={totalQuantity}
                  >
                    <TrackChanges sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
                  </MotionBadge>
                </MotionIconButton>
              </Tooltip>
              <Tooltip title="Cart" arrow>
                <MotionIconButton
                  onClick={handleOpenCart}
                  sx={{
                    color: "#1a365d",
                    p: 0,
                    mr: { xs: 1, sm: 2 },
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MotionBadge
                    badgeContent={totalQuantity}
                    color="error"
                    variants={cartBadgeVariants}
                    initial="initial"
                    animate="animate"
                    key={totalQuantity}
                  >
                    <ShoppingCartIcon sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
                  </MotionBadge>
                </MotionIconButton>
              </Tooltip>
              <Tooltip title="Account settings" arrow>
                <MotionIconButton
                  onClick={handleOpenUserMenu}
                  size="small"
                  sx={{ ml: { xs: 0, sm: 1 } }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MotionAvatar
                    sx={{
                      width: { xs: 32, sm: 38 },
                      height: { xs: 32, sm: 38 },
                      background: "linear-gradient(135deg, #03c5db, #f0e786)",
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      fontWeight: "bold",
                      color: "#1a365d",
                    }}
                  >
                    {currentUser && currentUser.name ? String(currentUser.name).charAt(0) : "U"}
                  </MotionAvatar>
                </MotionIconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                id="account-menu"
                open={open}
                onClose={handleCloseUserMenu}
                onClick={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    ...styles.styledPaper,
                    "&:before": {
                      ...styles.styledPaper["&:before"],
                      background: "linear-gradient(135deg, #03c5db, #f0e786)",
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigateAndClose("/Profile")}>
                  <MotionAvatar
                    sx={{
                      background: "linear-gradient(135deg, #03c5db, #f0e786)",
                      color: "#1a365d",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {currentUser && currentUser.name ? String(currentUser.name).charAt(0) : "U"}
                  </MotionAvatar>
                  <StyledLink to="/Profile">Profile</StyledLink>
                </MenuItem>
                <MenuItem onClick={() => navigateAndClose("/Orders")}>
                  <ListItemIcon>
                    <Shop2 fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/Orders">My Orders</StyledLink>
                </MenuItem>
                <MenuItem onClick={() => navigateAndClose("/Custom-Order/list")}>
                  <ListItemIcon>
                    <DashboardCustomizeRounded fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/Custom-Order/list">Custom Orders</StyledLink>
                </MenuItem>
                <MenuItem onClick={() => navigateAndClose("/Custom-seller/list")}>
                  <ListItemIcon>
                    <Storefront fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/Custom-seller/list">Custom Sellers</StyledLink>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.2)" }} />
                <MenuItem onClick={() => navigateAndClose("/DisplayVideo")}>
                  <ListItemIcon>
                    <YouTube fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/DisplayVideo">Reels</StyledLink>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.2)" }} />
                <MenuItem onClick={() => navigateAndClose("/Logout")}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "#03c5db" }} />
                  </ListItemIcon>
                  <StyledLink to="/Logout">Logout</StyledLink>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* MOBILE DRAWER MENU */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "75%",
            maxWidth: "300px",
            background: "linear-gradient(180deg, #03c5db 0%, #f0e786 100%)",
            padding: "20px 0",
            boxShadow: "0 4px 20px rgba(3, 197, 219, 0.3)",
          },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "#1a365d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <LocalMallIcon />
            Blue Crafts Fusions
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 1 }}>
          <MenuItem onClick={() => navigateAndClose("/")}>
            <Typography sx={{ color: "#1a365d", fontWeight: 500 }}>Home</Typography>
          </MenuItem>

          <MenuItem onClick={() => navigateAndClose("/Search")}>
            <Typography sx={{ color: "#1a365d", fontWeight: 500 }}>Search</Typography>
          </MenuItem>

          {/* Categories and Products would need to be implemented as expandable sections */}
          <MenuItem>
            <Typography sx={{ color: "#1a365d", fontWeight: 500 }}>Categories</Typography>
          </MenuItem>

          <MenuItem>
            <Typography sx={{ color: "#1a365d", fontWeight: 500 }}>Products</Typography>
          </MenuItem>

          {currentRole === null && (
            <>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", my: 2 }} />
              <Typography sx={{ px: 2, mb: 1, fontWeight: 600, color: "#1a365d" }}>Sign In Options</Typography>
              <MenuItem onClick={() => navigateAndClose("/Customerlogin")}>
                <ListItemIcon>
                  <Person fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Sign in as customer</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigateAndClose("/Sellerlogin")}>
                <ListItemIcon>
                  <Store fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Sign in as seller</Typography>
              </MenuItem>
            </>
          )}

          {currentRole === "Customer" && (
            <>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", my: 2 }} />
              <Typography sx={{ px: 2, mb: 1, fontWeight: 600, color: "#1a365d" }}>My Account</Typography>
              <MenuItem onClick={() => navigateAndClose("/Profile")}>
                <ListItemIcon>
                  <Person fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigateAndClose("/Orders")}>
                <ListItemIcon>
                  <Shop2 fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>My Orders</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigateAndClose("/Custom-Order/list")}>
                <ListItemIcon>
                  <DashboardCustomizeRounded fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Custom Orders</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigateAndClose("/Custom-seller/list")}>
                <ListItemIcon>
                  <Storefront fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Custom Sellers</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigateAndClose("/DisplayVideo")}>
                <ListItemIcon>
                  <YouTube fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Reels</Typography>
              </MenuItem>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", my: 2 }} />
              <MenuItem onClick={() => navigateAndClose("/Logout")}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#1a365d" }} />
                </ListItemIcon>
                <Typography sx={{ color: "#1a365d" }}>Logout</Typography>
              </MenuItem>
            </>
          )}
        </Box>
      </Drawer>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <MotionDrawer
            anchor="right"
            open={isCartOpen}
            onClose={handleCloseCart}
            sx={{
              width: isMobile ? "100%" : "400px",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: isMobile ? "100%" : "400px",
                boxSizing: "border-box",
                boxShadow: "-4px 0 25px rgba(0, 0, 0, 0.15)",
              },
            }}
            // initial={{ x: "100%" }}
            // animate={{ x: 0 }}
            // exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Cart setIsCartOpen={setIsCartOpen} />
          </MotionDrawer>
        )}
      </AnimatePresence>
    </MotionAppBar>
  )
}

export default Navbar

const HomeContainer = styled(Box)`
  display: flex;
  cursor: pointer;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #03c5db;
  }
`

const styles = {
  styledPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
    mt: 1.5,
    borderRadius: "12px",
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "& .MuiMenuItem-root": {
      padding: "10px 16px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(3, 197, 219, 0.08)",
      },
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
}

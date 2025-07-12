// Edited

import { useSelector, useDispatch } from "react-redux";
import { getSellerStats } from "../../redux/userHandle";

import { useState, useEffect } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AppBar, Drawer, NavLogo } from "../../utils/styles";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Logout from "../Logout";
import SideBar from "./components/SideBar";
import SellerHomePage from "./pages/SellerHomePage";
import AccountMenu from "./components/AccountMenu";
import ShowProducts from "./pages/ShowProducts";
import ShowOrders from "./pages/ShowOrders";
import ViewProductSeller from "./pages/ViewProductSeller";
import AddProduct from "./pages/AddProduct";
import Products from "../../components/Products";
import { productDataList } from "../../utils/products";
import ShopcartSpecial from "./pages/ShopcartSpecial";
import ShowCustomers from "./pages/ShowCustomers";
import SellerProfile from "./pages/SellerProfile";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import CustomizationToggle from "./components/CustomizationToggle";
import CustomOrderApproval from "./components/CustomOrderApproval";
import ApprovalList from "../Admin/ApprovalList";
import VideoDisplay from "../../components/VideoDisplay";
import VideoUpload from "./pages/VideoUpload";
import VideoManagement from "./pages/VideoManagement";
import OrderStatusDashboard from "../../components/order-status-dashboard";

// Motion components
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
const MotionTypography = motion(Typography);
const MotionDrawer = motion(Drawer);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  },
  hover: {
    scale: 1.05,
    textShadow: "0px 0px 8px rgba(3, 197, 219, 0.5)",
    transition: { duration: 0.3 },
  },
};

const iconVariants = {
  hover: {
    rotate: [0, -10, 10, -10, 0],
    scale: 1.1,
    transition: { duration: 0.5 },
  },
  tap: { scale: 0.95 },
};

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { currentUser, sellerStats } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [pageLoaded, setPageLoaded] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { currentRole } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const homeHandler = () => {
    navigate("/");
  };

  // Close drawer on mobile when navigating
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [location, isMobile]);

  // Page load animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Fetch seller stats when the component mounts
  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getSellerStats(currentUser._id));
    }
  }, [currentUser, dispatch]);

  return (
    <AnimatePresence>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        sx={{ display: "flex" }}
      >
        <CssBaseline />
        <StyledAppBar open={open} position="absolute">
          <Toolbar sx={{ pr: "24px" }}>
            <MotionIconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
                color: "#1a365d",
              }}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <MenuIcon />
            </MotionIconButton>

            {/* Desktop */}
            <MotionTypography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                mr: 2,
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "#1a365d",
                textDecoration: "none",
                cursor: "pointer",
              }}
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <NavLogo
                to="top"
                activeClass="active"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={homeHandler}
                style={{ display: "flex", alignItems: "center" }}
              >
                <MotionIconButton
                  sx={{
                    p: 0,
                    mr: 1,
                    color: "#1a365d",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                  disableRipple
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <LocalMallIcon sx={{ display: { xs: "none", md: "flex" } }} />
                </MotionIconButton>
                BLUE POTTERY
              </NavLogo>
            </MotionTypography>

            {/* Mobile */}
            <MotionTypography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "#1a365d",
                textDecoration: "none",
              }}
              variants={logoVariants}
              initial="hidden"
              animate="visible"
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
                BLUE POTTERY
              </NavLogo>
            </MotionTypography>

            <AccountMenu />
          </Toolbar>
        </StyledAppBar>

        <MotionDrawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
          initial={{ x: -80 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <MotionIconButton
              onClick={toggleDrawer}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <CloseIcon />
            </MotionIconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <SideBar />
          </List>
        </MotionDrawer>

        <MotionBox
          component="main"
          sx={styles.boxStyled}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Toolbar />
          <AnimatePresence mode="wait">
            <MotionBox
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              sx={{ height: "100%" }}
            >
              <Routes>
                <Route
                  path="/"
                  element={<SellerHomePage stats={sellerStats} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
                <Route
                  path="/Seller/dashboard"
                  element={<SellerHomePage stats={sellerStats} />}
                />
                <Route path="/Seller/profile" element={<SellerProfile />} />
                <Route
                  path="/Seller/custom/toggle"
                  element={<CustomizationToggle />}
                />{" "}
                {/* new */}
                <Route
                  path="/Seller/custom/list"
                  element={<CustomOrderApproval />}
                />{" "}
                {/* new */}
                <Route
                  path="/Admin/Approval/list"
                  element={<ApprovalList />}
                />{" "}
                {/* new */}
                {/* Class */}
                <Route path="/Seller/addproduct" element={<AddProduct />} />
                <Route path="/Seller/products" element={<ShowProducts />} />
                <Route
                  path="/Seller/products/product/:id"
                  element={<ViewProductSeller />}
                />
                <Route path="/uploadVideo" element={<VideoUpload />} />
                <Route path="/DisplayVideo" element={<VideoDisplay />} />
                <Route path="/VideoManagement" element={<VideoManagement />} />
                <Route path="/Order-status-Seller" element={<OrderStatusDashboard />} />
                
                {currentRole === "Shopcart" && (
                  <>
                    <Route
                      path="/Seller/shopcart"
                      element={<ShopcartSpecial />}
                    />
                    <Route
                      path="/Seller/uploadproducts"
                      element={<Products productData={productDataList} />}
                    />
                  </>
                )}
                <Route path="/Seller/orders" element={<ShowOrders />} />
                <Route
                  path="/Seller/orders/customers/:id"
                  element={<ShowCustomers />}
                />
                <Route
                  path="/Seller/orders/product/:id"
                  element={<ViewProductSeller />}
                />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </MotionBox>
          </AnimatePresence>
        </MotionBox>
      </MotionBox>
    </AnimatePresence>
  );
};

export default SellerDashboard;

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(135deg, #03c5db, #f0e786);
  box-shadow: 0 4px 20px rgba(3, 197, 219, 0.2);
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      rgba(3, 197, 219, 0.7),
      rgba(240, 231, 134, 0.7)
    );
  }
`;

const styles = {
  boxStyled: {
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(240, 245, 250, 0.8)"
        : theme.palette.grey[900],
    backgroundImage:
      "linear-gradient(135deg, rgba(3, 197, 219, 0.03), rgba(240, 231, 134, 0.03))",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
    "& .MuiDrawer-paper": {
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 250, 0.95))",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.05)",
      borderRight: "1px solid rgba(3, 197, 219, 0.1)",
    },
  },
  hideDrawer: {
    display: "flex",
    "& .MuiDrawer-paper": {
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 250, 0.95))",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.05)",
      borderRight: "1px solid rgba(3, 197, 219, 0.1)",
    },
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};

"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { getProductDetails, updateStuff } from "../redux/userHandle";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Environment, Float } from "@react-three/drei";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Rating,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Breadcrumbs,
  Skeleton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  LocalShipping,
  Inventory,
  Category,
  Description,
  Comment,
  Edit,
  Delete,
  Home,
  ArrowBack,
  Share,
  MoreVert,
} from "@mui/icons-material";
import { generateRandomColor, timeAgo } from "../utils/helperFunctions";

// Motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionContainer = motion(Container);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

// 3D Model component
function Model() {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1.2, 3, 32]} />
        <meshStandardMaterial color="#03c5db" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.7, 1, 0.5, 32]} />
        <meshStandardMaterial color="#0d47a1" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

const ViewProduct = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const productID = params.id;
  const { currentUser, currentRole, productDetails, loading, responseDetails } =
    useSelector((state) => state.user);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const reviewer = currentUser && currentUser._id;

  // Check if product is already in cart
  const isProductInCart = () => {
    if (!currentUser || !currentUser.cartDetails || !productDetails)
      return false;
    return currentUser.cartDetails.some(
      (item) => item._id === productDetails._id
    );
  };

  // Get current quantity in cart if product exists
  const getCurrentCartQuantity = () => {
    if (!currentUser || !currentUser.cartDetails || !productDetails) return 0;
    const cartItem = currentUser.cartDetails.find(
      (item) => item._id === productDetails._id
    );
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    dispatch(getProductDetails(productID));
  }, [productID, dispatch]);

  useEffect(() => {
    // Reset quantity to 1 when product changes
    setQuantity(1);
  }, [productID]);

  const handleOpenMenu = (event, reviewId) => {
    setSelectedReview(reviewId);
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    const maxAvailable = productDetails?.quantity || 0;

    if (newQuantity >= 1 && newQuantity <= maxAvailable) {
      setQuantity(newQuantity);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddToCart = () => {
    if (!productDetails) {
      showSnackbar("Product details not available", "error");
      return;
    }

    if (!productDetails.isInStock) {
      showSnackbar("This product is out of stock", "error");
      return;
    }

    if (productDetails.quantity <= 0) {
      showSnackbar("This product is out of stock", "error");
      return;
    }

    if (quantity <= 0) {
      showSnackbar("Please select a valid quantity", "error");
      return;
    }

    // Check if adding this quantity would exceed available stock
    const currentCartQty = getCurrentCartQuantity();
    const totalRequestedQty = currentCartQty + quantity;

    if (totalRequestedQty > productDetails.quantity) {
      showSnackbar(
        `Cannot add ${quantity} more. Only ${
          productDetails.quantity - currentCartQty
        } units available.`,
        "warning"
      );
      return;
    }

    // Create product with selected quantity
    const productWithQuantity = {
      ...productDetails,
      quantity: quantity, // Use the selected quantity for the cart
    };

    // Add to cart with the selected quantity
    dispatch(addToCart(productWithQuantity));

    // Show feedback to user
    showSnackbar(
      `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !comment) return;

    const fields = {
      rating,
      comment,
      reviewer,
    };

    dispatch(updateStuff(fields, productID, "addReview"));
    setComment("");
    showSnackbar("Review submitted successfully");
  };

  const deleteReviewHandler = (reviewId) => {
    const fields = { reviewId };
    dispatch(updateStuff(fields, productID, "deleteProductReview"));
    handleCloseMenu();
    showSnackbar("Review deleted successfully");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#03c5db" }} />
      </Box>
    );
  }

  if (responseDetails) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#1a365d",
            textAlign: "center",
          }}
        >
          Product Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          The product you are looking for may have been removed or does not
          exist.
        </Typography>
        <MotionButton
          component={Link}
          to="/"
          variant="contained"
          startIcon={<ArrowBack />}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          sx={{
            background: "linear-gradient(135deg, #03c5db, #0d47a1)",
            boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            padding: "10px 24px",
            "&:hover": {
              background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
            },
          }}
        >
          Back to Home
        </MotionButton>
      </MotionBox>
    );
  }

  return (
    <MotionContainer
      maxWidth="xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ py: 4 }}
    >
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 3,
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: "1.2rem" }} />
          Home
        </Link>
        <Link
          to="/Products"
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Products
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {productDetails && productDetails.productName
            ? productDetails.productName.length > 30
              ? productDetails.productName.substring(0, 30) + "..."
              : productDetails.productName
            : "Product Details"}
        </Typography>
      </Breadcrumbs>

      {/* Product Details Section */}
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <MotionBox
            variants={itemVariants}
            sx={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              backgroundColor: "#f5f5f5",
              aspectRatio: "1/1",
            }}
          >
            {!imageLoaded && !showModel && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}

            {showModel ? (
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <PresentationControls
                  global
                  zoom={0.8}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Float rotationIntensity={0.5}>
                    <Model />
                  </Float>
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>
            ) : (
              <Box
                component="img"
                src={productDetails && productDetails.productImage}
                alt={productDetails && productDetails.productName}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=500&width=500";
                  setImageLoaded(true);
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "24px",
                  opacity: imageLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}

            {/* Action buttons */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Tooltip
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <IconButton
                  onClick={() => setFavorite(!favorite)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  {favorite ? (
                    <Favorite sx={{ color: "#f44336" }} />
                  ) : (
                    <FavoriteBorder sx={{ color: "#757575" }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share product">
                <IconButton
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  <Share sx={{ color: "#757575" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={showModel ? "Show Image" : "View 3D Model"}>
                <IconButton
                  onClick={() => setShowModel(!showModel)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  <Category sx={{ color: "#03c5db" }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Discount badge */}
            {productDetails &&
              productDetails.price &&
              productDetails.price.discountPercent > 0 && (
                <Chip
                  icon={<LocalOffer sx={{ fontSize: "1rem" }} />}
                  label={`${productDetails.price.discountPercent}% OFF`}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "linear-gradient(135deg, #4caf50, #8bc34a)",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "1rem",
                    padding: "4px 8px",
                  }}
                />
              )}

            {/* Stock status badge */}
            {productDetails && (
              <Chip
                icon={<Inventory sx={{ fontSize: "1rem" }} />}
                label={
                  productDetails.isInStock && productDetails.quantity > 0
                    ? `${productDetails.quantity} in stock`
                    : "Out of stock"
                }
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  background:
                    productDetails.isInStock && productDetails.quantity > 0
                      ? "linear-gradient(135deg, #03c5db, #0d47a1)"
                      : "linear-gradient(135deg, #f44336, #d32f2f)",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "1rem",
                  padding: "4px 8px",
                }}
              />
            )}
          </MotionBox>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <MotionBox variants={itemVariants} sx={{ height: "100%" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "#1a365d",
                mb: 2,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {productDetails && productDetails.productName}
            </Typography>

            {/* Replace the static rating and review count with dynamic calculation */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={
                  productDetails &&
                  productDetails.reviews &&
                  productDetails.reviews.length > 0
                    ? productDetails.reviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / productDetails.reviews.length
                    : 0
                }
                precision={0.5}
                readOnly
              />
              <Typography
                variant="body2"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                (
                {productDetails && productDetails.reviews
                  ? productDetails.reviews.length
                  : 0}{" "}
                {productDetails &&
                productDetails.reviews &&
                productDetails.reviews.length === 1
                  ? "review"
                  : "reviews"}
                )
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Chip
                label={productDetails && productDetails.category}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.1))",
                  border: "1px solid rgba(3, 197, 219, 0.3)",
                  color: "#1a365d",
                  fontWeight: 500,
                }}
              />
              {productDetails && productDetails.subcategory && (
                <Chip
                  label={productDetails.subcategory}
                  sx={{
                    background: "rgba(0, 0, 0, 0.05)",
                    color: "text.secondary",
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  color: "#1a365d",
                }}
              >
                Rs.
                {productDetails &&
                  productDetails.price &&
                  productDetails.price.cost}
              </Typography>
              {productDetails &&
                productDetails.price &&
                productDetails.price.mrp && (
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    Rs.{productDetails.price.mrp}
                  </Typography>
                )}
              {productDetails &&
                productDetails.price &&
                productDetails.price.discountPercent > 0 && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4caf50",
                      fontWeight: 500,
                    }}
                  >
                    {productDetails.price.discountPercent}% off
                  </Typography>
                )}
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 3,
                lineHeight: 1.8,
              }}
            >
              {productDetails && productDetails.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Inventory sx={{ color: "#03c5db", mr: 1 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Availability
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color:
                          productDetails &&
                          productDetails.isInStock &&
                          productDetails.quantity > 0
                            ? "text.primary"
                            : "#f44336",
                      }}
                    >
                      {productDetails &&
                      productDetails.isInStock &&
                      productDetails.quantity > 0
                        ? `In Stock (${productDetails.quantity} available)`
                        : "Out of Stock"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalShipping sx={{ color: "#03c5db", mr: 1 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Shipping
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {productDetails && productDetails.shipping_cost === 0
                        ? "Free Shipping"
                        : `Rs.${productDetails.shipping_cost} Shipping`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Category sx={{ color: "#03c5db", mr: 1 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {productDetails && productDetails.category}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {currentRole === "Customer" &&
              productDetails &&
              productDetails.isInStock &&
              productDetails.quantity > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Quantity:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{
                          minWidth: "40px",
                          height: "40px",
                          borderRadius: 0,
                          color: "#1a365d",
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        sx={{
                          width: "40px",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {quantity}
                      </Typography>
                      <Button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (productDetails?.quantity || 0)}
                        sx={{
                          minWidth: "40px",
                          height: "40px",
                          borderRadius: 0,
                          color: "#1a365d",
                        }}
                      >
                        +
                      </Button>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {productDetails && productDetails.quantity > 0
                        ? `${productDetails.quantity} units available`
                        : "Out of stock"}
                    </Typography>
                  </Box>

                  {/* Show current cart quantity if product is in cart */}
                  {isProductInCart() && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#03c5db",
                        fontWeight: 500,
                      }}
                    >
                      Currently in your cart: {getCurrentCartQuantity()}{" "}
                      {getCurrentCartQuantity() === 1 ? "item" : "items"}
                    </Typography>
                  )}
                </Box>
              )}

            <Box sx={{ display: "flex", gap: 2 }}>
              {currentRole === "Customer" && (
                <>
                  <MotionButton
                    onClick={handleAddToCart}
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    disabled={
                      !productDetails ||
                      !productDetails.isInStock ||
                      productDetails.quantity <= 0
                    }
                    whileHover={
                      productDetails &&
                      productDetails.isInStock &&
                      productDetails.quantity > 0
                        ? "hover"
                        : undefined
                    }
                    whileTap={
                      productDetails &&
                      productDetails.isInStock &&
                      productDetails.quantity > 0
                        ? "tap"
                        : undefined
                    }
                    variants={buttonVariants}
                    sx={{
                      background:
                        productDetails &&
                        productDetails.isInStock &&
                        productDetails.quantity > 0
                          ? "linear-gradient(135deg, #03c5db, #0d47a1)"
                          : "rgba(0, 0, 0, 0.12)",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 500,
                      padding: "12px 24px",
                      boxShadow:
                        productDetails &&
                        productDetails.isInStock &&
                        productDetails.quantity > 0
                          ? "0 4px 10px rgba(3, 197, 219, 0.2)"
                          : "none",
                      color:
                        productDetails &&
                        productDetails.isInStock &&
                        productDetails.quantity > 0
                          ? "white"
                          : "rgba(0, 0, 0, 0.26)",
                      "&:hover": {
                        background:
                          productDetails &&
                          productDetails.isInStock &&
                          productDetails.quantity > 0
                            ? "linear-gradient(135deg, #02b1c5, #0a3d8f)"
                            : "rgba(0, 0, 0, 0.12)",
                        boxShadow:
                          productDetails &&
                          productDetails.isInStock &&
                          productDetails.quantity > 0
                            ? "0 6px 15px rgba(3, 197, 219, 0.3)"
                            : "none",
                      },
                    }}
                  >
                    {isProductInCart() ? "Add More to Cart" : "Add to Cart"}
                  </MotionButton>

                  <MotionButton
                    onClick={() => setFavorite(!favorite)}
                    variant="outlined"
                    startIcon={favorite ? <Favorite /> : <FavoriteBorder />}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    sx={{
                      borderColor: favorite ? "#f44336" : "#03c5db",
                      color: favorite ? "#f44336" : "#03c5db",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 500,
                      padding: "12px 24px",
                      "&:hover": {
                        borderColor: favorite ? "#d32f2f" : "#02b1c5",
                        backgroundColor: favorite
                          ? "rgba(244, 67, 54, 0.05)"
                          : "rgba(3, 197, 219, 0.05)",
                      },
                    }}
                  >
                    {favorite ? "Save for Later" : "Save for Later"}
                  </MotionButton>
                </>
              )}
            </Box>
          </MotionBox>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <MotionBox variants={itemVariants} sx={{ mt: 6 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            borderBottom: "1px solid rgba(3, 197, 219, 0.1)",
            "& .MuiTab-root": {
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              textTransform: "none",
              minHeight: "48px",
              color: "#1a365d",
            },
            "& .Mui-selected": {
              color: "#03c5db",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#03c5db",
              height: "3px",
              borderRadius: "1.5px",
            },
          }}
        >
          <Tab
            label="Description"
            icon={<Description />}
            iconPosition="start"
          />
          <Tab
            label="Reviews"
            icon={<Comment />}
            iconPosition="start"
            sx={{
              "& .MuiBadge-root": {
                marginLeft: 1,
              },
            }}
          />
          <Tab
            label="Specifications"
            icon={<Category />}
            iconPosition="start"
          />
        </Tabs>

        <AnimatePresence mode="wait">
          {tabValue === 0 && (
            <MotionBox
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              sx={{ p: 2 }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {productDetails && productDetails.description}
              </Typography>
              {productDetails && productDetails.tagline && (
                <Typography
                  variant="body1"
                  sx={{
                    mt: 3,
                    fontStyle: "italic",
                    color: "text.secondary",
                  }}
                >
                  {productDetails.tagline}
                </Typography>
              )}
            </MotionBox>
          )}

          {tabValue === 1 && (
            <MotionBox
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              sx={{ p: 2 }}
            >
              {/* Write a review section */}
              {currentRole === "Customer" && (
                <MotionBox
                  variants={itemVariants}
                  sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    background: "white",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "#1a365d",
                    }}
                  >
                    Write a Review
                  </Typography>
                  <form onSubmit={handleSubmitReview}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Your Rating:
                      </Typography>
                      <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                        precision={0.5}
                        size="large"
                      />
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Review"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#03c5db",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#03c5db",
                          },
                        },
                      }}
                    />
                    <MotionButton
                      type="submit"
                      variant="contained"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      sx={{
                        background: "linear-gradient(135deg, #03c5db, #0d47a1)",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 500,
                        padding: "10px 24px",
                        boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                          boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                        },
                      }}
                    >
                      Submit Review
                    </MotionButton>
                  </form>
                </MotionBox>
              )}

              {/* Reviews list */}
              {productDetails &&
              productDetails.reviews &&
              productDetails.reviews.length > 0 ? (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a365d",
                    }}
                  >
                    Customer Reviews ({productDetails.reviews.length})
                  </Typography>

                  {/* Calculate average rating */}
                  {(() => {
                    const totalRating = productDetails.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    );
                    const avgRating =
                      totalRating / productDetails.reviews.length;

                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Rating
                          value={avgRating}
                          precision={0.1}
                          readOnly
                          size="large"
                          sx={{ mr: 2 }}
                        />
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          {avgRating.toFixed(1)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          out of 5 ({productDetails.reviews.length}{" "}
                          {productDetails.reviews.length === 1
                            ? "review"
                            : "reviews"}
                          )
                        </Typography>
                      </Box>
                    );
                  })()}

                  {/* Rating distribution */}
                  <Box sx={{ mb: 4 }}>
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = productDetails.reviews.filter(
                        (review) => Math.floor(review.rating) === rating
                      ).length;
                      const percentage =
                        (count / productDetails.reviews.length) * 100;

                      return (
                        <Box
                          key={rating}
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography variant="body2" sx={{ width: "80px" }}>
                            {rating} {rating === 1 ? "Star" : "Stars"}
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              height: "8px",
                              bgcolor: "rgba(0,0,0,0.1)",
                              borderRadius: "4px",
                              mr: 2,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: "100%",
                                bgcolor:
                                  rating > 3
                                    ? "#4caf50"
                                    : rating > 1
                                    ? "#ff9800"
                                    : "#f44336",
                                borderRadius: "4px",
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ width: "50px" }}>
                            {count} ({percentage.toFixed(0)}%)
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Grid container spacing={3}>
                    {productDetails.reviews.map((review, index) => (
                      <Grid item xs={12} key={review._id || `review-${index}`}>
                        <MotionCard
                          variants={itemVariants}
                          sx={{
                            mb: 2,
                            p: 3,
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Decorative left bar */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              bottom: 0,
                              width: "4px",
                              background: `linear-gradient(to bottom, ${generateRandomColor(
                                review._id
                              )}, ${generateRandomColor(review._id + "alt")})`,
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              pl: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: "60px",
                                height: "60px",
                                mr: 2,
                                backgroundColor: generateRandomColor(
                                  review._id
                                ),
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {review.reviewer && review.reviewer.name
                                ? String(review.reviewer.name).charAt(0)
                                : "U"}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, color: "#1a365d" }}
                                  >
                                    {review.reviewer && review.reviewer.name
                                      ? review.reviewer.name
                                      : "Anonymous User"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {review.date
                                      ? timeAgo(review.date)
                                      : "Recently"}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Rating
                                    value={review.rating}
                                    readOnly
                                    size="small"
                                    sx={{ mr: 1 }}
                                  />
                                  {review.reviewer &&
                                    reviewer &&
                                    review.reviewer._id === reviewer && (
                                      <>
                                        <IconButton
                                          onClick={(e) =>
                                            handleOpenMenu(e, review._id)
                                          }
                                          size="small"
                                          sx={{ color: "inherit" }}
                                        >
                                          <MoreVert />
                                        </IconButton>
                                        <Menu
                                          id="review-menu"
                                          anchorEl={anchorElMenu}
                                          open={Boolean(anchorElMenu)}
                                          onClose={handleCloseMenu}
                                        >
                                          <MenuItem onClick={handleCloseMenu}>
                                            <Edit
                                              fontSize="small"
                                              sx={{ mr: 1 }}
                                            />
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() =>
                                              deleteReviewHandler(
                                                selectedReview
                                              )
                                            }
                                          >
                                            <Delete
                                              fontSize="small"
                                              sx={{ mr: 1 }}
                                            />
                                            Delete
                                          </MenuItem>
                                        </Menu>
                                      </>
                                    )}
                                </Box>
                              </Box>

                              <Typography
                                variant="body1"
                                sx={{ mt: 2, lineHeight: 1.6 }}
                              >
                                {review.comment}
                              </Typography>
                            </Box>
                          </Box>
                        </MotionCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                    px: 2,
                  }}
                >
                  <Comment
                    sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1a365d",
                      textAlign: "center",
                    }}
                  >
                    No Reviews Found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      textAlign: "center",
                      maxWidth: "400px",
                      mt: 1,
                    }}
                  >
                    Be the first to review this product.
                  </Typography>
                </Box>
              )}
            </MotionBox>
          )}

          {tabValue === 2 && (
            <MotionBox
              key="specifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              sx={{ p: 2 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          fontWeight: 600,
                          color: "#1a365d",
                        }}
                      >
                        Product Details
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Category
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.category}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Subcategory
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.subcategory}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Handmade
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.isHandmade
                              ? "Yes"
                              : "No"}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            In Stock
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.isInStock
                              ? "Yes"
                              : "No"}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Shipping
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails &&
                            productDetails.shipping_cost === 0
                              ? "Free Shipping"
                              : `$${productDetails.shipping_cost} Shipping`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          fontWeight: 600,
                          color: "#1a365d",
                        }}
                      >
                        Physical Specifications
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Color
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.color
                              ? productDetails.color
                              : "Not specified"}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Dimensions
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.dimensions
                              ? productDetails.dimensions
                              : "Not specified"}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Material
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {productDetails && productDetails.material
                              ? productDetails.material
                              : "Not specified"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>
    </MotionContainer>
  );
};

export default ViewProduct;

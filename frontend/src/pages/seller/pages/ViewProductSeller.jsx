"use client";

import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  TextField,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Paper,
  Grid,
  Rating,
  Chip,
  MenuItem,
  Breadcrumbs,
  Container,
  Divider,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Delete,
  KeyboardArrowUp,
  ArrowBack,
  Comment,
  AttachMoney,
  Category,
  Description,
  ShortText,
  Bookmark,
  AddPhotoAlternate,
  Home,
  Edit,
  Info,
  LocalOffer,
  Inventory,
  PhotoCamera,
  LocalShipping,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteStuff,
  getProductDetails,
  updateStuff,
} from "../../../redux/userHandle";
import altImage from "../../../assets/altimg.png";
import Popup from "../../../components/Popup";
import { generateRandomColor, timeAgo } from "../../../utils/helperFunctions";
import { underControl } from "../../../redux/userSlice";
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import Link from "@mui/material/Link";
import styled from "styled-components";

// Sample categories for blue pottery
const potteryCategories = [
  "Vases",
  "Plates",
  "Bowls",
  "Cups & Mugs",
  "Decorative Items",
  "Wall Hangings",
  "Planters",
  "Lamps & Lighting",
  "Tableware Sets",
];

// Sample subcategories
const potterySubcategories = {
  Vases: ["Flower Vases", "Decorative Vases", "Floor Vases", "Mini Vases"],
  Plates: ["Dinner Plates", "Dessert Plates", "Wall Plates", "Serving Plates"],
  Bowls: ["Soup Bowls", "Serving Bowls", "Decorative Bowls", "Fruit Bowls"],
  "Cups & Mugs": ["Coffee Mugs", "Tea Cups", "Espresso Cups", "Travel Mugs"],
  "Decorative Items": [
    "Figurines",
    "Sculptures",
    "Ornaments",
    "Candle Holders",
  ],
  "Wall Hangings": [
    "Wall Plates",
    "Tile Art",
    "Framed Pottery",
    "Decorative Panels",
  ],
  Planters: [
    "Indoor Planters",
    "Outdoor Planters",
    "Hanging Planters",
    "Succulent Planters",
  ],
  "Lamps & Lighting": [
    "Table Lamps",
    "Floor Lamps",
    "Pendant Lights",
    "Candle Holders",
  ],
  "Tableware Sets": ["Dinner Sets", "Tea Sets", "Serving Sets", "Mixed Sets"],
};

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);
const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);
const MotionAvatar = motion(Avatar);

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

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(3, 197, 219, 0.2)",
    transition: {
      duration: 0.3,
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

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const ViewProductSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const imageRef = useRef(null);

  const productID = params.id;

  const [showTab, setShowTab] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const buttonText = showTab ? "Cancel Editing" : "Edit Product Details";

  const { loading, status, error, productDetails, responseDetails } =
    useSelector((state) => state.user);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState({});
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [color, setColor] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState("99");
  const [inventoryQuantity, setInventoryQuantity] = useState("100");

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (category && potterySubcategories[category]) {
      setAvailableSubcategories(potterySubcategories[category]);
    } else {
      setAvailableSubcategories([]);
    }
  }, [category]);

  useEffect(() => {
    dispatch(getProductDetails(productID));
  }, [productID, dispatch]);

  useEffect(() => {
    if (productDetails) {
      setProductName(productDetails.productName || "");
      setPrice(productDetails.price || {});
      setSubcategory(productDetails.subcategory || "");
      setProductImage(productDetails.productImage || "");
      setCategory(productDetails.category || "");
      setDescription(productDetails.description || "");
      setTagline(productDetails.tagline || "");

      // Add these lines:
      setColor(productDetails.color || "Blue");
      setDimensions(productDetails.dimensions || "");
      setMaterial(productDetails.material || "Ceramic");
      setFreeShipping(productDetails.shipping_cost === 0);
      setShippingCost(
        productDetails.shipping_cost > 0
          ? productDetails.shipping_cost.toString()
          : "99"
      );
      setInventoryQuantity(
        productDetails.quantity ? productDetails.quantity.toString() : "100"
      );
    }
    if (productDetails.price) {
      setMrp(productDetails.price.mrp || "");
      setCost(productDetails.price.cost || "");
      setDiscountPercent(productDetails.price.discountPercent || "");
    }
  }, [productDetails]);

  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    category,
    description,
    tagline,
    shipping_cost: freeShipping ? 0 : Number.parseInt(shippingCost, 10),
    quantity: Number.parseInt(inventoryQuantity, 10),
    color,
    dimensions,
    material,
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // Validate form
    if (
      Number.parseFloat(mrp) < 0 ||
      Number.parseFloat(cost) < 0 ||
      Number.parseFloat(discountPercent) < 0 ||
      Number.parseFloat(discountPercent) > 100 ||
      Number.parseFloat(mrp) < Number.parseFloat(cost) ||
      Number.parseInt(inventoryQuantity) < 0 ||
      (!freeShipping && Number.parseInt(shippingCost) < 0)
    ) {
      setMessage("Please correct the errors in the form");
      setShowPopup(true);
      return;
    }

    setLoader(true);
    dispatch(updateStuff(fields, productID, "ProductUpdate"));
  };

  const deleteHandler = (reviewId) => {
    const fields = { reviewId };
    dispatch(updateStuff(fields, productID, "deleteProductReview"));
  };

  const deleteAllHandler = () => {
    dispatch(deleteStuff(productID, "deleteAllProductReviews"));
  };

  useEffect(() => {
    if (status === "updated" || status === "deleted") {
      setLoader(false);
      dispatch(getProductDetails(productID));
      setShowPopup(true);
      setMessage("Done Successfully");
      setShowTab(false);
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, error, dispatch, productID]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
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
          variant="h5"
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
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/Seller/products")}
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
          Back to Products
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
      sx={{ pt: 3, pb: 6 }}
    >
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
          underline="hover"
          color="inherit"
          href="/Seller/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Seller/dashboard");
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5, fontSize: "1.2rem" }} />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/Seller/products"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Seller/products");
          }}
        >
          Products
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {productDetails && productDetails.productName
            ? productDetails.productName.length > 20
              ? productDetails.productName.substring(0, 20) + "..."
              : productDetails.productName
            : "Product Details"}
        </Typography>
      </Breadcrumbs>

      {/* Product Info Section */}
      <MotionPaper
        variants={itemVariants}
        elevation={3}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          mb: 4,
          position: "relative",
        }}
      >
        {/* Decorative top bar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #03c5db, #f0e786)",
            zIndex: 1,
          }}
        />

        <Box sx={{ p: isTablet ? 2 : 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5} lg={4}>
              <MotionBox
                variants={imageVariants}
                whileHover="hover"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {!imageLoaded && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: "#03c5db" }} />
                  </Box>
                )}
                <ProductImageContainer>
                  <ProductImage
                    ref={imageRef}
                    src={productDetails && productDetails.productImage}
                    alt={productDetails && productDetails.productName}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                  />
                  <ImageOverlay>
                    <MotionIconButton
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                      onClick={() => setShowTab(true)}
                    >
                      <PhotoCamera sx={{ color: "#03c5db" }} />
                    </MotionIconButton>
                  </ImageOverlay>
                </ProductImageContainer>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
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
                  {productDetails &&
                    productDetails.price &&
                    productDetails.price.discountPercent > 0 && (
                      <Chip
                        icon={
                          <LocalOffer sx={{ fontSize: "1rem !important" }} />
                        }
                        label={`${productDetails.price.discountPercent}% OFF`}
                        sx={{
                          background:
                            "linear-gradient(135deg, #4caf50, #8bc34a)",
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    )}
                </Box>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    sx={{
                      fontWeight: 600,
                      color: "#1a365d",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {productDetails && productDetails.productName}
                  </Typography>

                  <MotionButton
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowTab(!showTab)}
                    startIcon={showTab ? <KeyboardArrowUp /> : <Edit />}
                    sx={{
                      background: showTab
                        ? "linear-gradient(135deg, #f44336, #e91e63)"
                        : "linear-gradient(135deg, #03c5db, #0d47a1)",
                      color: "white",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 500,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        background: showTab
                          ? "linear-gradient(135deg, #d32f2f, #c2185b)"
                          : "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                      },
                    }}
                  >
                    {buttonText}
                  </MotionButton>
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontStyle: "italic",
                    color: "text.secondary",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {productDetails && productDetails.tagline}
                </Typography>

                <PriceContainer>
                  <PriceCost>
                    $
                    {productDetails &&
                      productDetails.price &&
                      productDetails.price.cost}
                  </PriceCost>
                  <PriceMrp>
                    $
                    {productDetails &&
                      productDetails.price &&
                      productDetails.price.mrp}
                  </PriceMrp>
                  <PriceDiscount>
                    {productDetails &&
                      productDetails.price &&
                      productDetails.price.discountPercent}
                    % off
                  </PriceDiscount>
                </PriceContainer>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "#1a365d",
                      fontFamily: "Poppins, sans-serif",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Description sx={{ mr: 1, color: "#03c5db" }} />
                    Description:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                  >
                    {productDetails && productDetails.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#1a365d",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Category
                          sx={{ mr: 1, fontSize: "1rem", color: "#03c5db" }}
                        />
                        Category:
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 4, mt: 0.5 }}>
                        {productDetails && productDetails.category}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1a365d",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Bookmark
                        sx={{ mr: 1, fontSize: "1rem", color: "#03c5db" }}
                      />
                      Subcategory:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 4, mt: 0.5 }}>
                      {productDetails && productDetails.subcategory}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1a365d",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Inventory
                        sx={{ mr: 1, fontSize: "1rem", color: "#03c5db" }}
                      />
                      Inventory:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 4, mt: 0.5 }}>
                      {productDetails && productDetails.quantity
                        ? productDetails.quantity
                        : "100"}{" "}
                      units
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1a365d",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Inventory
                        sx={{ mr: 1, fontSize: "1rem", color: "#03c5db" }}
                      />
                      Stock Status:
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ ml: 4, mt: 0.5 }}
                    >
                      <Chip
                        label={
                          productDetails && productDetails.isInStock
                            ? "In Stock"
                            : "Out of Stock"
                        }
                        size="small"
                        sx={{
                          background:
                            productDetails && productDetails.isInStock
                              ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))"
                              : "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(233, 30, 99, 0.1))",
                          border:
                            productDetails && productDetails.isInStock
                              ? "1px solid rgba(76, 175, 80, 0.3)"
                              : "1px solid rgba(244, 67, 54, 0.3)",
                          color:
                            productDetails && productDetails.isInStock
                              ? "#4caf50"
                              : "#f44336",
                          fontWeight: 500,
                        }}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1a365d",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocalShipping
                        sx={{ mr: 1, fontSize: "1rem", color: "#03c5db" }}
                      />
                      Shipping:
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ ml: 4, mt: 0.5 }}
                    >
                      <Chip
                        label={productDetails?.shipping_cost}
                        size="small"
                        sx={{
                          background: productDetails?.isInStock
                            ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))"
                            : "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(233, 30, 99, 0.1))",
                          border: productDetails?.isInStock
                            ? "1px solid rgba(76, 175, 80, 0.3)"
                            : "1px solid rgba(244, 67, 54, 0.3)",
                          color: productDetails?.isInStock
                            ? "#4caf50"
                            : "#f44336",
                          fontWeight: 500,
                        }}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#1a365d",
                        fontFamily: "Poppins, sans-serif",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Info sx={{ mr: 1, color: "#03c5db" }} />
                      Specifications:
                    </Typography>
                    <Grid container spacing={2} sx={{ ml: 4, mt: 0.5 }}>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1a365d" }}
                        >
                          Color:
                        </Typography>
                        <Typography variant="body2">
                          {productDetails && productDetails.color
                            ? productDetails.color
                            : "Not specified"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1a365d" }}
                        >
                          Dimensions:
                        </Typography>
                        <Typography variant="body2">
                          {productDetails && productDetails.dimensions
                            ? productDetails.dimensions
                            : "Not specified"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1a365d" }}
                        >
                          Material:
                        </Typography>
                        <Typography variant="body2">
                          {productDetails && productDetails.material
                            ? productDetails.material
                            : "Not specified"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MotionPaper>

      <Collapse in={showTab} timeout="auto" unmountOnExit>
        <MotionPaper
          variants={fadeVariants}
          sx={{
            p: 3,
            borderRadius: "16px",
            mb: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            position: "relative",
          }}
        >
          {/* Decorative top bar */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #03c5db, #f0e786)",
              zIndex: 1,
            }}
          />

          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: "#1a365d",
              fontFamily: "Poppins, sans-serif",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Edit sx={{ mr: 1, color: "#03c5db" }} />
            Edit Product Details
          </Typography>

          <Tabs
            value={activeTab}
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
            <Tab label="Basic Info" icon={<Info />} iconPosition="start" />
            <Tab label="Pricing" icon={<AttachMoney />} iconPosition="start" />
            <Tab label="Categories" icon={<Category />} iconPosition="start" />
            <Tab
              label="Image"
              icon={<AddPhotoAlternate />}
              iconPosition="start"
            />
            <Tab
              label="Inventory & Shipping"
              icon={<Inventory />}
              iconPosition="start"
            />
            <Tab label="Specifications" icon={<Info />} iconPosition="start" />
          </Tabs>

          <form onSubmit={submitHandler}>
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <MotionBox
                  key="basic-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Product Name"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ShortText sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Tagline"
                        value={tagline}
                        onChange={(event) => setTagline(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ShortText sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="e.g. Handcrafted with traditional Jaipur techniques"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ alignSelf: "flex-start", mt: 1.5 }}
                            >
                              <Description sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </MotionBox>
              )}

              {activeTab === 1 && (
                <MotionBox
                  key="pricing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="MRP"
                        value={mrp}
                        onChange={(event) => setMrp(event.target.value)}
                        required
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        error={
                          mrp < 0 ||
                          (cost &&
                            Number.parseFloat(mrp) < Number.parseFloat(cost))
                        }
                        helperText={
                          mrp < 0
                            ? "MRP cannot be negative"
                            : cost &&
                              Number.parseFloat(mrp) < Number.parseFloat(cost)
                            ? "MRP should be greater than cost"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Cost"
                        value={cost}
                        onChange={(event) => setCost(event.target.value)}
                        required
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        error={cost < 0}
                        helperText={cost < 0 ? "Cost cannot be negative" : ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Discount %"
                        value={discountPercent}
                        onChange={(event) =>
                          setDiscountPercent(event.target.value)
                        }
                        required
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOffer sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        error={discountPercent < 0 || discountPercent > 100}
                        helperText={
                          discountPercent < 0
                            ? "Discount cannot be negative"
                            : discountPercent > 100
                            ? "Discount cannot exceed 100%"
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </MotionBox>
              )}

              {activeTab === 2 && (
                <MotionBox
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        select
                        label="Category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Category sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {potteryCategories.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        select
                        label="Subcategory"
                        value={subcategory}
                        onChange={(event) => setSubcategory(event.target.value)}
                        required
                        disabled={
                          !category || availableSubcategories.length === 0
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Bookmark sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {availableSubcategories.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                  </Grid>
                </MotionBox>
              )}

              {activeTab === 3 && (
                <MotionBox
                  key="image"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <StyledTextField
                        fullWidth
                        label="Product Image URL"
                        value={productImage}
                        onChange={(event) =>
                          setProductImage(event.target.value)
                        }
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddPhotoAlternate sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <ProductPreviewImage
                          src={productImage || altImage}
                          alt="Product Preview"
                          onError={(e) => {
                            e.target.src = altImage;
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </MotionBox>
              )}

              {activeTab === 4 && (
                <MotionBox
                  key="inventory-shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Inventory Quantity"
                        value={inventoryQuantity}
                        onChange={(event) =>
                          setInventoryQuantity(event.target.value)
                        }
                        required
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Inventory sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        error={inventoryQuantity < 0}
                        helperText={
                          inventoryQuantity < 0
                            ? "Quantity cannot be negative"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={freeShipping}
                            onChange={(e) => setFreeShipping(e.target.checked)}
                            sx={{
                              color: "#03c5db",
                              "&.Mui-checked": {
                                color: "#03c5db",
                              },
                            }}
                          />
                        }
                        label="Free Shipping"
                      />
                      {!freeShipping && (
                        <StyledTextField
                          fullWidth
                          label="Shipping Cost"
                          value={shippingCost}
                          onChange={(event) =>
                            setShippingCost(event.target.value)
                          }
                          required
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShipping sx={{ color: "#03c5db" }} />
                              </InputAdornment>
                            ),
                          }}
                          error={shippingCost < 0}
                          helperText={
                            shippingCost < 0
                              ? "Shipping cost cannot be negative"
                              : ""
                          }
                          sx={{ mt: 2 }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </MotionBox>
              )}

              {activeTab === 5 && (
                <MotionBox
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Color"
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="e.g. Blue, Red, Green"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Dimensions"
                        value={dimensions}
                        onChange={(event) => setDimensions(event.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="e.g. 10x5x3 inches"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Material"
                        value={material}
                        onChange={(event) => setMaterial(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="e.g. Ceramic, Clay, Porcelain"
                      />
                    </Grid>
                  </Grid>
                </MotionBox>
              )}
            </AnimatePresence>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <MotionButton
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowTab(false)}
                sx={{
                  background: "#f5f5f5",
                  color: "#757575",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    background: "#e0e0e0",
                  },
                }}
              >
                Cancel
              </MotionButton>

              <MotionButton
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={loader}
                sx={{
                  background: "linear-gradient(135deg, #03c5db, #0d47a1)",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                    boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #80e1eb, #8097cb)",
                    color: "white",
                  },
                }}
              >
                {loader ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress
                      size={24}
                      sx={{ color: "white", mr: 1 }}
                    />
                    <span>Updating...</span>
                  </Box>
                ) : (
                  "Update Product"
                )}
              </MotionButton>
            </Box>
          </form>
        </MotionPaper>
      </Collapse>

      {/* Reviews Section */}
      <MotionPaper
        variants={itemVariants}
        sx={{
          p: 3,
          borderRadius: "16px",
          position: "relative",
        }}
      >
        {/* Decorative top bar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #03c5db, #f0e786)",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
              fontFamily: "Poppins, sans-serif",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Comment sx={{ mr: 1, color: "#03c5db" }} />
            Customer Reviews
            {productDetails.reviews && productDetails.reviews.length > 0 && (
              <Badge
                badgeContent={productDetails.reviews.length}
                color="primary"
                sx={{
                  ml: 1,
                  "& .MuiBadge-badge": {
                    backgroundColor: "#03c5db",
                    fontWeight: "bold",
                  },
                }}
              />
            )}
          </Typography>

          {productDetails.reviews && productDetails.reviews.length > 0 && (
            <MotionButton
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setDialog("Do you want to delete all reviews?");
                setShowDialog(true);
              }}
              startIcon={<Delete />}
              sx={{
                background: "linear-gradient(135deg, #f44336, #e91e63)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                boxShadow: "0 4px 8px rgba(244, 67, 54, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #d32f2f, #c2185b)",
                  boxShadow: "0 6px 12px rgba(244, 67, 54, 0.3)",
                },
              }}
            >
              Remove All Reviews
            </MotionButton>
          )}
        </Box>

        {productDetails.reviews && productDetails.reviews.length > 0 ? (
          <AnimatePresence>
            <Box sx={{ mt: 2 }}>
              {productDetails.reviews.map((review, index) => {
                const uniqueKey =
                  review._id ||
                  `review-${index}-${Math.random().toString(36).substr(2, 5)}`;
                return (
                  <MotionCard
                    key={uniqueKey}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    sx={{
                      mb: 2,
                      p: 2,
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
                      sx={{ display: "flex", alignItems: "flex-start", pl: 1 }}
                    >
                      <MotionAvatar
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        sx={{
                          width: "50px",
                          height: "50px",
                          mr: 2,
                          backgroundColor: generateRandomColor(review._id),
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {String(review.reviewer.name).charAt(0)}
                      </MotionAvatar>

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
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: "#1a365d" }}
                            >
                              {review.reviewer.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {timeAgo(review.date)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Tooltip title="Delete review">
                              <MotionIconButton
                                onClick={() => deleteHandler(review._id)}
                                size="small"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                sx={{
                                  color: "#f44336",
                                  "&:hover": {
                                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                                  },
                                }}
                              >
                                <Delete />
                              </MotionIconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, lineHeight: 1.6 }}
                        >
                          {review.comment}
                        </Typography>
                      </Box>
                    </Box>
                  </MotionCard>
                );
              })}
            </Box>
          </AnimatePresence>
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
              When customers leave reviews for this product, they will appear
              here.
            </Typography>
          </Box>
        )}
      </MotionPaper>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      <AlertDialogSlide
        dialog={dialog}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        taskHandler={deleteAllHandler}
      />
    </MotionContainer>
  );
};

export default ViewProductSeller;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &:hover > div {
    opacity: 1;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  transition: all 0.3s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ProductPreviewImage = styled.img`
  width: 100%;
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const PriceContainer = styled(Box)`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
`;

const PriceMrp = styled(Typography)`
  text-decoration: line-through;
  color: #757575;
  font-size: 1rem;
`;

const PriceCost = styled(Typography)`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a365d;
`;

const PriceDiscount = styled(Typography)`
  color: #4caf50;
  font-weight: 500;
  font-size: 0.9rem;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #03c5db;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #03c5db;
      border-width: 2px;
    }
  }

  & .MuiInputLabel-root.Mui-focused {
    color: #03c5db;
  }

  & .MuiInputLabel-root {
    font-family: "Poppins, sans-serif";
  }

  & .MuiInputBase-input {
    font-family: "Poppins, sans-serif";
  }
`;

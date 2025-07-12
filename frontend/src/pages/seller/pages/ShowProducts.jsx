"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
  Paper,
} from "@mui/material";
import {
  Delete,
  Visibility,
  AddCircle,
  Upload,
  Search,
  FilterList,
  Sort,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteStuff, getProductsbySeller } from "../../../redux/userHandle";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate.jsx";
import AlertDialogSlide from "../../../components/AlertDialogSlide";

// Motion components
const MotionContainer = motion(Container);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

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

const cardVariants = {
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
  hover: {
    y: -10,
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const ShowProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentUser,
    currentRole,
    loading,
    sellerProductData,
    responseSellerProducts,
  } = useSelector((state) => state.user);

  const sellerID = currentUser._id;

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(getProductsbySeller(currentUser._id));
  }, [dispatch, currentUser._id]);

  // Filter and sort products
  useEffect(() => {
    if (Array.isArray(sellerProductData)) {
      let result = [...sellerProductData];

      // Filter by search term
      if (searchTerm) {
        result = result.filter(
          (product) =>
            product.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.subcategory &&
              product.subcategory
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        );
      }

      // Filter by category
      if (categoryFilter !== "All") {
        result = result.filter(
          (product) => product.category === categoryFilter
        );
      }

      // Sort products
      switch (sortOption) {
        case "priceHighToLow":
          result.sort((a, b) => b.price.cost - a.price.cost);
          break;
        case "priceLowToHigh":
          result.sort((a, b) => a.price.cost - b.price.cost);
          break;
        case "discountHighToLow":
          result.sort(
            (a, b) => b.price.discountPercent - a.price.discountPercent
          );
          break;
        case "nameAZ":
          result.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "nameZA":
          result.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        case "quantityHighToLow":
          result.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
          break;
        case "quantityLowToHigh":
          result.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
          break;
        default:
          // Default sorting (newest first, assuming this is the original order)
          break;
      }

      setFilteredProducts(result);
    }
  }, [sellerProductData, searchTerm, categoryFilter, sortOption]);

  // Get unique categories for filter dropdown
  const categories =
    sellerProductData && Array.isArray(sellerProductData)
      ? [
          "All",
          ...new Set(sellerProductData.map((product) => product.category)),
        ]
      : ["All"];

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteStuff(deleteID, address)).then(() => {
      dispatch(getProductsbySeller(currentUser._id));
    });
  };

  const deleteAllProducts = () => {
    deleteHandler(sellerID, "DeleteProducts");
  };

  const actions = [
    {
      icon: <AddCircle color="primary" />,
      name: "Add New Product",
      action: () => navigate("/Seller/addproduct"),
    },
    {
      icon: <Delete color="error" />,
      name: "Delete All Products",
      action: () => {
        setDialog("Do you want to delete all products?");
        setShowDialog(true);
      },
    },
  ];

  const shopcartActions = [
    {
      icon: <AddCircle color="primary" />,
      name: "Add New Product",
      action: () => navigate("/Seller/addproduct"),
    },
    {
      icon: <Upload color="success" />,
      name: "Upload New Product",
      action: () => navigate("/Seller/uploadproducts"),
    },
    {
      icon: <Delete color="error" />,
      name: "Delete All Products",
      action: () => {
        setDialog("Do you want to delete all products?");
        setShowDialog(true);
      },
    },
  ];

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
  return (
    <MotionContainer
      maxWidth="xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ py: 3 }}
    >
      <MotionPaper
        variants={itemVariants}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
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
            borderRadius: "16px 16px 0 0",
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
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Your Products
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => navigate("/Seller/addproduct")}
                sx={{
                  background: "linear-gradient(135deg, #03c5db, #0d47a1)",
                  boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                    boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                  },
                }}
              >
                Add Product
              </Button>
            </motion.div>

            {currentRole === "Shopcart" && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => navigate("/Seller/uploadproducts")}
                  sx={{
                    borderColor: "#03c5db",
                    color: "#03c5db",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#02b1c5",
                      backgroundColor: "rgba(3, 197, 219, 0.05)",
                    },
                  }}
                >
                  Upload Product
                </Button>
              </motion.div>
            )}
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search products by name or category..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#03c5db" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
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
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList sx={{ color: "#03c5db" }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(3, 197, 219, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03c5db",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03c5db",
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <Sort sx={{ color: "#03c5db" }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(3, 197, 219, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03c5db",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#03c5db",
                  },
                }}
              >
                <MenuItem value="default">Newest First</MenuItem>
                <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                <MenuItem value="discountHighToLow">
                  Discount: High to Low
                </MenuItem>
                <MenuItem value="nameAZ">Name: A to Z</MenuItem>
                <MenuItem value="nameZA">Name: Z to A</MenuItem>
                <MenuItem value="quantityHighToLow">
                  Inventory: High to Low
                </MenuItem>
                <MenuItem value="quantityLowToHigh">
                  Inventory: Low to High
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MotionPaper>

      {responseSellerProducts ? (
        <MotionBox
          variants={itemVariants}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="No products"
              style={{ opacity: 0.5 }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#1a365d",
            }}
          >
            No Products Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "text.secondary",
              maxWidth: "500px",
            }}
          >
            You haven't added any products to your store yet. Start by adding
            your first product.
          </Typography>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => navigate("/Seller/addproduct")}
              sx={{
                background: "linear-gradient(135deg, #03c5db, #0d47a1)",
                boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                padding: "8px 24px",
                "&:hover": {
                  background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                  boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                },
              }}
            >
              Add Your First Product
            </Button>
          </motion.div>
        </MotionBox>
      ) : (
        <>
          {filteredProducts.length === 0 && searchTerm ? (
            <MotionBox
              variants={itemVariants}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                px: 2,
                textAlign: "center",
              }}
            >
              <Search
                sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }}
              />
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "#1a365d",
                }}
              >
                No Products Found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: "500px",
                }}
              >
                We couldn't find any products matching your search. Try
                different keywords or filters.
              </Typography>
            </MotionBox>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const uniqueKey =
                    product._id ||
                    `product-${index}-${Math.random()
                      .toString(36)
                      .substr(2, 5)}`;
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={uniqueKey}>
                      <MotionCard
                        variants={cardVariants}
                        whileHover="hover"
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                          position: "relative",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.productImage}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.src =
                              "/placeholder.svg?height=200&width=200";
                          }}
                          sx={{
                            objectFit: "contain",
                            padding: "16px",
                            backgroundColor: "#f5f5f5",
                          }}
                        />

                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background:
                              "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.1))",
                            border: "1px solid rgba(3, 197, 219, 0.3)",
                            color: "#1a365d",
                            fontWeight: 500,
                          }}
                        />

                        {product.price && product.price.discountPercent > 0 && (
                          <Chip
                            label={`${product.price.discountPercent}% OFF`}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              background:
                                "linear-gradient(135deg, #4caf50, #8bc34a)",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        )}

                        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#1a365d",
                              fontFamily: "Poppins, sans-serif",
                              height: "3rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.productName}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "baseline",
                              mt: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, color: "#1a365d", mr: 1 }}
                            >
                              $ {product.price.cost}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                              }}
                            >
                              $ {product.price.mrp}
                            </Typography>
                          </Box>
                        </CardContent>

                        <CardActions sx={{ padding: "8px 16px 16px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Tooltip title="Delete product">
                              <IconButton
                                onClick={() =>
                                  deleteHandler(product._id, "DeleteProduct")
                                }
                                size="small"
                                sx={{
                                  color: "#f44336",
                                  "&:hover": {
                                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>

                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() =>
                                navigate(
                                  "/Seller/products/product/" + product._id
                                )
                              }
                              sx={{
                                borderColor: "#03c5db",
                                color: "#03c5db",
                                borderRadius: "8px",
                                textTransform: "none",
                                "&:hover": {
                                  borderColor: "#02b1c5",
                                  backgroundColor: "rgba(3, 197, 219, 0.05)",
                                },
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardActions>
                      </MotionCard>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          )}
        </>
      )}

      {currentRole === "Shopcart" ? (
        <SpeedDialTemplate actions={shopcartActions} />
      ) : (
        <SpeedDialTemplate actions={actions} />
      )}

      <AlertDialogSlide
        dialog={dialog}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        taskHandler={deleteAllProducts}
      />
    </MotionContainer>
  );
};

export default ShowProducts;

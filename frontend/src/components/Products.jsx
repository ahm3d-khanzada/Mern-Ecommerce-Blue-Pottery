// Edited
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Pagination,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  CloudUpload,
  Search,
  FilterList,
  Sort,
  Visibility,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { addStuff } from "../redux/userHandle";
import styled from "styled-components";

// Motion components
const MotionCard = motion(Card);
const MotionContainer = motion(Container);
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

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
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
    boxShadow: "0px 5px 15px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const Products = ({ productData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { currentRole, responseSearch } = useSelector((state) => state.user);

  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Set items per page based on screen size
  useEffect(() => {
    if (isMobile) {
      setItemsPerPage(4);
    } else if (isTablet) {
      setItemsPerPage(6);
    } else {
      setItemsPerPage(9);
    }
  }, [isMobile, isTablet]);

  // Filter and sort products
  useEffect(() => {
    if (Array.isArray(productData) && productData.length > 0) {
      let filtered = [...productData];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
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
        filtered = filtered.filter(
          (product) => product.category === categoryFilter
        );
      }

      // Sort products
      switch (sortOption) {
        case "priceHighToLow":
          filtered.sort((a, b) => b.price.cost - a.price.cost);
          break;
        case "priceLowToHigh":
          filtered.sort((a, b) => a.price.cost - b.price.cost);
          break;
        case "discountHighToLow":
          filtered.sort(
            (a, b) => b.price.discountPercent - a.price.discountPercent
          );
          break;
        case "nameAZ":
          filtered.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "nameZA":
          filtered.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        default:
          // Default sorting (newest first, assuming this is the original order)
          break;
      }

      setFilteredProducts(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    } else {
      setFilteredProducts([]);
    }
  }, [productData, searchTerm, categoryFilter, sortOption]);

  // Get unique categories for filter dropdown
  const categories =
    productData && Array.isArray(productData)
      ? ["All", ...new Set(productData.map((product) => product.category))]
      : ["All"];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    setLoading(true);
    dispatch(addToCart(product));
    setMessage("Product added to cart successfully!");
    setShowPopup(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleUpload = (event, product) => {
    event.stopPropagation();
    setLoading(true);
    dispatch(addStuff("ProductCreate", product));
    setMessage("Product uploaded successfully!");
    setShowPopup(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const messageHandler = (event) => {
    event.stopPropagation();
    setMessage("You have to login or register first");
    setShowPopup(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#03c5db" }} />
      </Box>
    );
  }

  if (responseSearch) {
    return (
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
        <Search sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }} />
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#1a365d",
            textAlign: "center",
          }}
        >
          No Products Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: "500px",
            mb: 4,
          }}
        >
          We couldn't find any products matching your search criteria.
        </Typography>
      </Box>
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
      <Box sx={{ mb: 4 }}>
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
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredProducts.length === 0 ? (
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
          <Search sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#1a365d",
              textAlign: "center",
            }}
          >
            No Products Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              maxWidth: "500px",
              mb: 4,
            }}
          >
            We couldn't find any products matching your search criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <AnimatePresence>
              {currentItems.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product._id || index}>
                  <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    onClick={() => navigate("/product/view/" + product._id)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        product.productImage ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={product.productName}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200";
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
                        sx={{ display: "flex", alignItems: "baseline", mt: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1a365d",
                            mr: 1,
                          }}
                        >
                          Rs. {product.price.cost}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            color: "text.secondary",
                          }}
                        >
                          Rs. {product.price.mrp}
                        </Typography>
                      </Box>

                      <Rating
                        value={4.5}
                        precision={0.5}
                        size="small"
                        readOnly
                        sx={{ mt: 1 }}
                      />
                    </CardContent>

                    <Divider sx={{ mx: 2 }} />

                    <CardActions sx={{ p: 2 }}>
                      {currentRole === "Customer" && (
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          style={{ width: "100%" }}
                        >
                          <AddToCartButton
                            onClick={(event) => handleAddToCart(event, product)}
                            fullWidth
                            startIcon={<ShoppingCart />}
                          >
                            Add To Cart
                          </AddToCartButton>
                        </motion.div>
                      )}

                      {currentRole === "Shopcart" && (
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          style={{ width: "100%" }}
                        >
                          <UploadButton
                            onClick={(event) => handleUpload(event, product)}
                            fullWidth
                            startIcon={<CloudUpload />}
                          >
                            Upload
                          </UploadButton>
                        </motion.div>
                      )}

                      {currentRole === null && (
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          style={{ width: "100%" }}
                        >
                          <ViewButton
                            onClick={(event) => messageHandler(event)}
                            fullWidth
                            startIcon={<Visibility />}
                          >
                            View Details
                          </ViewButton>
                        </motion.div>
                      )}
                    </CardActions>
                  </MotionCard>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          <Box
            sx={{
              mt: 5,
              mb: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: "Poppins, sans-serif",
                },
                "& .Mui-selected": {
                  backgroundColor: "rgba(3, 197, 219, 0.2) !important",
                  color: "#03c5db",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </>
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </MotionContainer>
  );
};

export default Products;

const AddToCartButton = styled(Button)`
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";
  box-shadow: 0 4px 8px rgba(3, 197, 219, 0.2);

  &:hover {
    background: linear-gradient(135deg, #02b1c5, #0a3d8f);
    box-shadow: 0 6px 12px rgba(3, 197, 219, 0.3);
  }
`;

const UploadButton = styled(Button)`
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);

  &:hover {
    background: linear-gradient(135deg, #43a047, #7cb342);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  }
`;

const ViewButton = styled(Button)`
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.2);

  &:hover {
    background: linear-gradient(135deg, #8e24aa, #5e35b1);
    box-shadow: 0 6px 12px rgba(156, 39, 176, 0.3);
  }
`;

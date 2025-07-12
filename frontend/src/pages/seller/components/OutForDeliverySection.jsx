// Edited
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Visibility,
  People,
  Search,
  FilterList,
  Sort,
  LocalShipping,
  AddCircle,
  GridView,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { getSpecificProducts } from "../../../redux/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import styled from "styled-components";

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
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
    boxShadow: "0px 5px 15px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const OutForDeliverySection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentUser,
    specificProductData,
    responseSpecificProducts,
    loading,
  } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

  useEffect(() => {
    dispatch(
      getSpecificProducts(currentUser._id, "getOrderedProductsBySeller")
    );
  }, [dispatch, currentUser._id]);

  // Process products data when it changes
  useEffect(() => {
    if (Array.isArray(specificProductData) && specificProductData.length > 0) {
      let filtered = [...specificProductData];

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
        case "quantityHighToLow":
          filtered.sort((a, b) => b.quantity - a.quantity);
          break;
        case "quantityLowToHigh":
          filtered.sort((a, b) => a.quantity - b.quantity);
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
    } else {
      setFilteredProducts([]);
    }
  }, [specificProductData, searchTerm, categoryFilter, sortOption]);

  // Get unique categories for filter dropdown
  const categories =
    specificProductData && Array.isArray(specificProductData)
      ? [
          "All",
          ...new Set(specificProductData.map((product) => product.category)),
        ]
      : ["All"];

  const productsColumns = [
    { id: "name", label: "Product Name", minWidth: 170 },
    { id: "quantity", label: "Product Quantity", minWidth: 100 },
    { id: "category", label: "Product Category", minWidth: 100 },
    { id: "subcategory", label: "Product SubCategory", minWidth: 100 },
    { id: "orderId", label: "Product OrderId", minWidth: 100 },
    { id: "customerName", label: "Customer Name", minWidth: 100 },
    { id: "orderStatus", label: "Order Status", minWidth: 100 },
    { id: "statusColor", label: "Status Color", minWidth: 50, align: "right" }, // Color on the right side
  ];
  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return { bg: "#FFFFED", text: "#8B8000" }; // Light Red BG, Dark Red Text
      case "Packed":
        return { bg: "#ffecb3", text: "#f57c00" }; // Light Yellow BG, Orange Text
      case "Shipped":
        return { bg: "#bbdefb", text: "#1976d2" }; // Light Blue BG, Dark Blue Text
      case "Delivered":
        return { bg: "#c8e6c9", text: "#388e3c" }; // Light Green BG, Dark Green Text
      case "Cancelled":
        return { bg: "#ffcccb", text: "#d32f2f" }; // Light Gray BG, Dark Gray Text
      default:
        return { bg: "#f5f5f5", text: "#000000" }; // Default Gray BG, Black Text
    }
  };

  const productsRows =
    filteredProducts.length > 0
      ? filteredProducts.map((product) => ({
          name: product.productName,
          quantity: product.quantity,
          category: product.category,
          subcategory: product.subcategory,
          id: product.productName,
          productID: product._id,
          orderId: product.orderId,
          customerName: product.customerName,
          orderStatus: product.orderStatus,
          // MAke the color represnt the order status
          statusColor: getOrderStatusColor(product.orderStatus),
        }))
      : [];

  const ProductsButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <ViewButton
            onClick={() => {
              navigate("/Seller/orders/product/" + row.productID);
            }}
          >
            View Product
          </ViewButton>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <CustomersButton
            onClick={() => {
              console.log("show");
            }}
          >
            Show Customers
          </CustomersButton>
        </motion.div>
      </Box>
    );
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

  if (responseSpecificProducts) {
    return (
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
          textAlign: "center",
        }}
      >
        <LocalShipping
          sx={{ fontSize: 80, color: "rgba(0, 0, 0, 0.2)", mb: 2 }}
        />
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#1a365d",
          }}
        >
          No Products Out for Delivery
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: "500px",
          }}
        >
          When customers place orders for your products, they will appear here.
        </Typography>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
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
            Add New Product
          </Button>
        </motion.div>
      </MotionBox>
    );
  }

  return (
    <MotionBox variants={containerVariants} initial="hidden" animate="visible">
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocalShipping sx={{ color: "#03c5db", mr: 1, fontSize: "2rem" }} />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Products Out for Delivery
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={viewMode === "grid" ? "Table View" : "Grid View"}>
            <IconButton
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
              sx={{
                color: "#03c5db",
                border: "1px solid rgba(3, 197, 219, 0.3)",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(3, 197, 219, 0.05)",
                },
              }}
            >
              {viewMode === "grid" ? <TableIcon /> : <GridIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
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
                <MenuItem value="quantityHighToLow">
                  Quantity: High to Low
                </MenuItem>
                <MenuItem value="quantityLowToHigh">
                  Quantity: Low to High
                </MenuItem>
                <MenuItem value="nameAZ">Name: A to Z</MenuItem>
                <MenuItem value="nameZA">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredProducts.length === 0 && searchTerm ? (
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
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "#1a365d",
              textAlign: "center",
            }}
          >
            No Products Found
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
            We couldn't find any products matching "{searchTerm}". Try different
            keywords or filters.
          </Typography>
        </Box>
      ) : (
        <>
          {viewMode === "table" ? (
            <Box sx={{ overflowX: "auto" }}>
              <TableTemplate
                buttonHaver={ProductsButtonHaver}
                columns={productsColumns}
                rows={productsRows}
              />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                        height="180"
                        image={
                          product.productImage ||
                          "/placeholder.svg?height=180&width=180"
                        }
                        alt={product.productName}
                        onError={(e) => {
                          e.target.src =
                            "/placeholder.svg?height=180&width=180";
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

                      <Chip
                        icon={
                          <LocalShipping sx={{ fontSize: "1rem !important" }} />
                        }
                        label={`Qty: ${product.quantity}`}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background:
                            "linear-gradient(135deg, #ff9800, #ff5722)",
                          color: "white",
                          fontWeight: 500,
                        }}
                      />

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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {product.orderId}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {product.customerName}
                        </Typography>

                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Chip
                            label={product.orderStatus}
                            sx={{
                              backgroundColor: getOrderStatusColor(
                                product.orderStatus
                              ).bg,
                              color: getOrderStatusColor(product.orderStatus)
                                .text,
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "4px 8px",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {product.subcategory}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                          }}
                        >
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <ViewButton
                              onClick={() =>
                                navigate(
                                  "/Seller/orders/product/" + product._id
                                )
                              }
                              size="small"
                            >
                              <Visibility sx={{ mr: 0.5, fontSize: "1rem" }} />
                              View
                            </ViewButton>
                          </motion.div>

                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <CustomersButton
                              onClick={() => console.log("show")}
                              size="small"
                            >
                              <People sx={{ mr: 0.5, fontSize: "1rem" }} />
                              Customers
                            </CustomersButton>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </>
      )}
    </MotionBox>
  );
};

export default OutForDeliverySection;

const ViewButton = styled(Button)`
  background: linear-gradient(
    135deg,
    rgba(3, 197, 219, 0.1),
    rgba(13, 71, 161, 0.1)
  );
  color: #03c5db;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(3, 197, 219, 0.3);
  text-transform: none;
  font-weight: 500;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(3, 197, 219, 0.2),
      rgba(13, 71, 161, 0.2)
    );
    border: 1px solid rgba(3, 197, 219, 0.5);
  }
`;

const CustomersButton = styled(Button)`
  background: linear-gradient(
    135deg,
    rgba(255, 152, 0, 0.1),
    rgba(255, 87, 34, 0.1)
  );
  color: #ff9800;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 152, 0, 0.3);
  text-transform: none;
  font-weight: 500;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 152, 0, 0.2),
      rgba(255, 87, 34, 0.2)
    );
    border: 1px solid rgba(255, 152, 0, 0.5);
  }
`;

const TableIcon = styled(Visibility)`
  font-size: 1.2rem;
`;

const GridIcon = styled(GridView)`
  font-size: 1.2rem;
`;

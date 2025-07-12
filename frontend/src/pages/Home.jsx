// Edited

import { useEffect, useState, useRef, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/userHandle";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Environment, Float } from "@react-three/drei";
import {
  Search,
  FilterList,
  Sort,
  Star,
  ArrowDownward,
  LocalOffer,
} from "@mui/icons-material";
import ProductCard from "./product-card";
import FeaturedProductCard from "./featured-product-card";
import HeroSection from "./hero-section";
import ProductsFilter from "./products-filter";
import { Link } from "react-router-dom";

// Motion components
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionGrid = motion(Grid);

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

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
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

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollYProgress } = useScroll();
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const { productData, responseProducts, loading, error } = useSelector(
    (state) => state.user
  );

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [productOptions, setProductOptions] = useState({
    inStock: false,
    freeShipping: false,
    handmade: false,
  });
  const [ratingFilter, setRatingFilter] = useState({
    5: false,
    4: false,
    3: false,
    2: false,
    1: false,
  });

  // Get products on component mount
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Select 3 random products for featured section
  useEffect(() => {
    if (productData && productData.length > 0) {
      const shuffled = [...productData].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
      setFilteredProducts(productData);
    }
  }, [productData]);

  // Filter and sort products
  useEffect(() => {
    if (productData && productData.length > 0) {
      let result = [...productData];

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

      // Filter by price range
      result = result.filter(
        (product) =>
          product.price &&
          product.price.cost >= priceRange[0] &&
          product.price.cost <= priceRange[1]
      );

      // Filter by product options
      if (productOptions.inStock) {
        result = result.filter((product) => product.isInStock);
      }
      if (productOptions.freeShipping) {
        result = result.filter((product) => product.shipping_cost === 0);
      }
      if (productOptions.handmade) {
        result = result.filter((product) => product.isHandmade);
      }

      // Filter by ratings
      const activeRatingFilters = Object.entries(ratingFilter)
        .filter(([_, isActive]) => isActive)
        .map(([rating]) => Number(rating));

      if (activeRatingFilters.length > 0) {
        // Get the minimum rating from active filters
        const minRating = Math.min(...activeRatingFilters);

        // Filter products with average rating >= minRating
        result = result.filter((product) => {
          // Skip products with no reviews if rating filter is active
          if (!product.reviews || product.reviews.length === 0) return false;

          const avgRating =
            product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length;
          return avgRating >= minRating;
        });
      }

      // Filter by tab value
      if (tabValue === 1) {
        // Discounted products (50% or more)
        result = result.filter(
          (product) => product.price && product.price.discountPercent >= 50
        );
      } else if (tabValue === 2) {
        // New arrivals (uploaded within 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1); // 24 hours ago

        result = result.filter((product) => {
          // Check if product has createdAt timestamp
          if (product.createdAt) {
            const createdDate = new Date(product.createdAt);
            return createdDate >= oneDayAgo;
          }
          // If no timestamp, use the first 10 products as fallback
          return result.indexOf(product) < 10;
        });
      } else if (tabValue === 3) {
        // Best sellers (rating above 4.6)
        result = result.filter((product) => {
          if (!product.reviews || product.reviews.length === 0) return false;

          const avgRating =
            product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length;
          return avgRating >= 4.6;
        });
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
            (a, b) =>
              (b.price?.discountPercent || 0) - (a.price?.discountPercent || 0)
          );
          break;
        case "nameAZ":
          result.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "nameZA":
          result.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        default:
          // Default sorting (newest first)
          break;
      }

      setFilteredProducts(result);
    }
  }, [
    productData,
    searchTerm,
    categoryFilter,
    sortOption,
    tabValue,
    priceRange,
    productOptions,
    ratingFilter,
  ]);

  // Get unique categories for filter
  const categories =
    productData && productData.length > 0
      ? ["All", ...new Set(productData.map((product) => product.category))]
      : ["All"];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Scroll to products section
  const productsRef = useRef(null);
  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#03c5db" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#1a365d" }}>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: "600px" }}>
          We're having trouble loading the products. Please try again later.
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(getProducts())}
          sx={{
            background: "linear-gradient(135deg, #03c5db, #0d47a1)",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            padding: "10px 24px",
            "&:hover": {
              background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (responseProducts || !productData || productData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#1a365d" }}>
          No products available
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: "600px" }}>
          There are no products available at the moment. Please check back
          later.
        </Typography>
        <Button
          component={Link}
          to="/Sellerregister"
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #03c5db, #0d47a1)",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            padding: "10px 24px",
            "&:hover": {
              background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
            },
          }}
        >
          Become a Seller
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section with 3D Model */}
      <HeroSection scrollToProducts={scrollToProducts} />

      {/* Featured Products Section */}
      <MotionBox
        style={{ opacity: scrollOpacity, scale: scrollScale }}
        sx={{
          py: 8,
          px: 2,
          background:
            "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.05))",
        }}
      >
        <Container maxWidth="xl">
          <MotionTypography
            variant="h4"
            component="h2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              mb: 4,
              fontWeight: 600,
              color: "#1a365d",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Featured Products
          </MotionTypography>

          <Grid container spacing={4}>
            {featuredProducts.map((product, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={product._id || `featured-${index}`}
              >
                <FeaturedProductCard product={product} index={index} />
              </Grid>
            ))}
          </Grid>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <MotionButton
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProducts}
              endIcon={<ArrowDownward />}
              sx={{
                background: "linear-gradient(135deg, #03c5db, #0d47a1)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                padding: "12px 24px",
                boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                  boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                },
              }}
            >
              Explore All Products
            </MotionButton>
          </MotionBox>
        </Container>
      </MotionBox>

      {/* 3D Showcase Section */}
      <Box
        sx={{
          height: "50vh",
          position: "relative",
          overflow: "hidden",
          background: "#f5f5f5",
        }}
      >
        <Suspense fallback={<CircularProgress />}>
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
        </Suspense>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Explore Our Handcrafted Collection
          </Typography>
          <Typography variant="body1">
            Interact with the 3D model to see the details
          </Typography>
        </Box>
      </Box>

      {/* All Products Section */}
      <MotionContainer
        ref={productsRef}
        maxWidth="xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        sx={{ py: 8 }}
      >
        <MotionTypography
          variant="h4"
          component="h2"
          variants={itemVariants}
          sx={{
            mb: 4,
            fontWeight: 600,
            color: "#1a365d",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Our Products
        </MotionTypography>

        {/* Search and Filter Bar */}
        <MotionBox
          variants={itemVariants}
          sx={{
            mb: 4,
            p: 2,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            background: "white",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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

            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "contained" : "outlined"}
                sx={{
                  borderColor: "#03c5db",
                  color: showFilters ? "white" : "#03c5db",
                  background: showFilters
                    ? "linear-gradient(135deg, #03c5db, #0d47a1)"
                    : "transparent",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#02b1c5",
                    backgroundColor: showFilters
                      ? "linear-gradient(135deg, #02b1c5, #0a3d8f)"
                      : "rgba(3, 197, 219, 0.05)",
                  },
                }}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Sort sx={{ color: "#03c5db" }} />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  native: true,
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
              >
                <option value="default">Newest First</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="discountHighToLow">Discount: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
                <option value="nameZA">Name: Z to A</option>
              </TextField>
            </Grid>
          </Grid>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <MotionBox
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ mt: 3, overflow: "hidden" }}
              >
                <Divider sx={{ mb: 3 }} />
                <ProductsFilter
                  categories={categories}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  productOptions={productOptions}
                  setProductOptions={setProductOptions}
                  ratingFilter={ratingFilter}
                  setRatingFilter={setRatingFilter}
                />
              </MotionBox>
            )}
          </AnimatePresence>
        </MotionBox>

        {/* Product Tabs */}
        <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
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
            <Tab label="All Products" />
            <Tab
              label="50%+ Discount"
              icon={<LocalOffer sx={{ fontSize: "1rem" }} />}
              iconPosition="start"
            />
            <Tab label="New Arrivals (24h)" iconPosition="start" />
            <Tab
              label="Top Rated (4.6+)"
              icon={<Star sx={{ fontSize: "1rem" }} />}
              iconPosition="start"
            />
          </Tabs>
        </MotionBox>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <MotionBox
            variants={fadeInVariants}
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
            <Search sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }} />
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
              We couldn't find any products matching your search. Try different
              keywords or filters.
            </Typography>
          </MotionBox>
        ) : (
          <MotionGrid container spacing={3}>
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product._id || `product-${index}`}
                >
                  <ProductCard product={product} index={index} />
                </Grid>
              ))}
            </AnimatePresence>
          </MotionGrid>
        )}
      </MotionContainer>
    </Box>
  );
};

export default HomePage;

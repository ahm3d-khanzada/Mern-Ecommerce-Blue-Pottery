"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { listClasses } from "@mui/material/List";
import Typography from "@mui/material/Typography";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  ShoppingBag,
  SortRounded,
} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { Paper, Skeleton, Divider, Box, Chip, Fade } from "@mui/material";

import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificProducts } from "../../../redux/userHandle";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const gridItemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: i * 0.05,
    },
  }),
};

const CustomerOrders = () => {
  const dispatch = useDispatch();
  const {
    currentUser,
    loading,
    specificProductData,
    responseSpecificProducts,
  } = useSelector((state) => state.user);
  const [sortOption, setSelectedOption] = useState("newest");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    dispatch(
      getSpecificProducts(currentUser._id, "getOrderedProductsByCustomer")
    );
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (specificProductData) {
      const sortedData = [...specificProductData];

      if (sortOption === "newest") {
        sortedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortOption === "oldest") {
        sortedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }

      setFilteredProducts(sortedData);

      // Set initial load to false after first data load
      if (isInitialLoad) {
        setTimeout(() => setIsInitialLoad(false), 500);
      }
    }
  }, [specificProductData, sortOption, isInitialLoad]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    setSelectedOption(value);
    handleCloseMenu();
  };

  // Loading skeletons
  if (loading) {
    return (
      <Container sx={{ py: 5 }}>
        <Skeleton
          variant="text"
          width="300px"
          height={60}
          sx={{ mx: "auto", mb: 4 }}
        />
        <Skeleton
          variant="rectangular"
          width="200px"
          height={40}
          sx={{ ml: "auto", mb: 3 }}
        />

        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid key={item} xs={12} sm={6} md={3}>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 3, mb: 1 }}
              />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="50%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // No orders
  if (responseSpecificProducts) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <ShoppingBag
            sx={{ fontSize: 100, color: "#3f51b5", opacity: 0.3, mb: 2 }}
          />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}
          >
            No Orders Yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: "500px" }}
          >
            You haven't placed any orders yet. Start shopping to see your orders
            here!
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              borderRadius: "10px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(63, 81, 181, 0.4)",
            }}
          >
            Browse Products
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Container sx={{ py: 5 }}>
        <motion.div variants={itemVariants}>
          <Typography
            sx={{
              fontSize: { xs: 32, md: 40 },
              textAlign: "center",
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Orders
          </Typography>
          <Divider
            sx={{
              width: "80px",
              mx: "auto",
              borderWidth: "2px",
              borderColor: "#3f51b5",
              mb: 5,
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: "12px",
              bgcolor: "#f5f7ff",
              border: "1px solid rgba(63, 81, 181, 0.1)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterList color="primary" />
                <Typography variant="body1" fontWeight={500}>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "Order" : "Orders"} Found
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexShrink={0}>
                <Chip
                  icon={<SortRounded />}
                  label="Sort by"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                />
                <Button
                  disableRipple
                  variant="contained"
                  color="primary"
                  onClick={handleOpenMenu}
                  endIcon={
                    anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                  }
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 600,
                    boxShadow: "0 2px 10px rgba(63, 81, 181, 0.2)",
                  }}
                >
                  {
                    sortOptions.find((option) => option.value === sortOption)
                      ?.label
                  }
                </Button>

                <Menu
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        [`& .${listClasses.root}`]: {
                          p: 0,
                        },
                      },
                    },
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === sortOption}
                      onClick={() => handleMenuItemClick(option.value)}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: "8px",
                        m: 0.5,
                        "&:hover": { bgcolor: "rgba(63, 81, 181, 0.1)" },
                        "&.Mui-selected": {
                          bgcolor: "rgba(63, 81, 181, 0.1)",
                          "&:hover": { bgcolor: "rgba(63, 81, 181, 0.15)" },
                        },
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        <Grid container spacing={3}>
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <Fade
                key={product._id}
                in={!isInitialLoad}
                timeout={300 + index * 100}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Grid xs={12} sm={6} md={3}>
                  <motion.div
                    custom={index}
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </Grid>
              </Fade>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default CustomerOrders;

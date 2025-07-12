"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Skeleton,
  Rating,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { ShoppingCart, LocalOffer } from "@mui/icons-material";

// Motion components
const MotionCard = motion(Card);
const MotionButton = motion(Button);

// Animation variants
const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: custom * 0.2,
    },
  }),
  hover: {
    y: -10,
    boxShadow: "0px 20px 40px rgba(3, 197, 219, 0.3)",
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

const FeaturedProductCard = ({ product, index }) => {
  // Always call hooks at the top level, before any conditional logic
  const dispatch = useDispatch();
  const { currentRole, currentUser } = useSelector((state) => state.user || {});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  // Use useEffect to check if product is in cart and calculate average rating
  useEffect(() => {
    // Check if product is in cart
    if (product && currentUser?.cartDetails) {
      setIsInCart(
        currentUser.cartDetails.some((item) => item?._id === product._id) ||
          false
      );
    } else {
      setIsInCart(false);
    }

    // Calculate average rating
    if (product?.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + (review?.rating || 0),
        0
      );
      setAvgRating(totalRating / product.reviews.length);
    } else {
      setAvgRating(0);
    }
  }, [currentUser, product]);

  // Guard clause - if product is undefined or null, return null
  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (product && product._id) {
      dispatch(addToCart(product));
    }
  };

  return (
    <MotionCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        position: "relative",
        background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
      }}
    >
      {/* Discount badge */}
      {product.price && product.price.discountPercent > 0 && (
        <Chip
          icon={<LocalOffer sx={{ fontSize: "1rem" }} />}
          label={`${product.price.discountPercent}% OFF`}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1,
            background: "linear-gradient(135deg, #4caf50, #8bc34a)",
            color: "white",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "4px 8px",
          }}
        />
      )}

      {/* Product image */}
      <Box sx={{ position: "relative", pt: "75%", backgroundColor: "#f5f5f5" }}>
        {!imageLoaded && (
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
        <CardMedia
          component="img"
          image={
            product.productImage || "/placeholder.svg?height=300&width=300"
          }
          alt={product.productName || "Product"}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=300&width=300";
            setImageLoaded(true);
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "24px",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </Box>

      {/* Product details */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "#1a365d",
            mb: 1,
          }}
        >
          {product.productName || "Unnamed Product"}
        </Typography>

        {/* Rating display with dynamic calculation */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={avgRating} readOnly size="small" precision={0.5} />
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            ({product.reviews ? product.reviews.length : 0})
          </Typography>
        </Box>

        <Chip
          label={product.category || "Uncategorized"}
          sx={{
            mb: 2,
            background:
              "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.1))",
            border: "1px solid rgba(3, 197, 219, 0.3)",
            color: "#1a365d",
            fontWeight: 500,
          }}
        />

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description ||
            product.tagline ||
            "Handcrafted with care and attention to detail."}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
            }}
          >
            ${product.price?.cost || 0}
          </Typography>
          {product.price?.mrp && product.price.mrp !== product.price.cost && (
            <Typography
              variant="h6"
              sx={{
                textDecoration: "line-through",
                color: "text.secondary",
              }}
            >
              ${product.price.mrp}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <MotionButton
            component={Link}
            to={product._id ? `/product/view/${product._id}` : "#"}
            variant="outlined"
            fullWidth
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            sx={{
              borderColor: "#03c5db",
              color: "#03c5db",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              padding: "10px 0",
              "&:hover": {
                borderColor: "#02b1c5",
                backgroundColor: "rgba(3, 197, 219, 0.05)",
              },
            }}
          >
            View Details
          </MotionButton>

          {currentRole === "Customer" && (
            <MotionButton
              onClick={handleAddToCart}
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              disabled={isInCart}
              sx={{
                background: isInCart
                  ? "linear-gradient(135deg, #4caf50, #8bc34a)"
                  : "linear-gradient(135deg, #03c5db, #0d47a1)",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                padding: "10px 0",
                boxShadow: "0 4px 10px rgba(3, 197, 219, 0.2)",
                "&:hover": {
                  background: isInCart
                    ? "linear-gradient(135deg, #43a047, #7cb342)"
                    : "linear-gradient(135deg, #02b1c5, #0a3d8f)",
                  boxShadow: "0 6px 15px rgba(3, 197, 219, 0.3)",
                },
                "&.Mui-disabled": {
                  background: "linear-gradient(135deg, #4caf50, #8bc34a)",
                  color: "white",
                  opacity: 0.8,
                },
              }}
            >
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </MotionButton>
          )}
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default FeaturedProductCard;

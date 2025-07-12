// Edited
import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Rating,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  Visibility,
} from "@mui/icons-material";

// Motion components
const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Animation variants
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: custom * 0.1,
    },
  }),
  hover: {
    y: -10,
    boxShadow: "0px 10px 30px rgba(3, 197, 219, 0.2)",
    transition: {
      duration: 0.3,
    },
  },
};

const ProductCard = ({ product, index }) => {
  const dispatch = useDispatch();
  const { currentRole } = useSelector((state) => state.user);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setFavorite(!favorite);
  };

  return (
    <MotionCard
      component={Link}
      to={`/product/view/${product._id}`}
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
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        textDecoration: "none",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* Discount badge */}
      {product.price && product.price.discountPercent > 0 && (
        <Chip
          icon={<LocalOffer sx={{ fontSize: "0.8rem" }} />}
          label={`${product.price.discountPercent}% OFF`}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1,
            background: "linear-gradient(135deg, #4caf50, #8bc34a)",
            color: "white",
            fontWeight: 500,
          }}
        />
      )}

      {/* Action buttons */}
      <MotionBox
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <IconButton
            onClick={toggleFavorite}
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

        {currentRole === "Customer" && (
          <Tooltip title="Add to cart">
            <IconButton
              onClick={handleAddToCart}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              <ShoppingCart sx={{ color: "#03c5db" }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Quick view">
          <IconButton
            component={Link}
            to={`/product/view/${product._id}`}
            onClick={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <Visibility sx={{ color: "#757575" }} />
          </IconButton>
        </Tooltip>
      </MotionBox>

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
          image={product.productImage}
          alt={product.productName}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=200";
            setImageLoaded(true);
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "16px",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </Box>

      {/* Product details */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              padding: "4px 8px",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                transform: "scale(1.02)",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 28,
                height: 28,
                fontSize: 14,
              }}
            >
              {product?.seller?.shopName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography
              variant="subtitle2"
              fontWeight="medium"
              color="text.primary"
            >
              {product?.seller?.shopName}
            </Typography>
          </Stack>
        </motion.div>
        <Typography
          variant="h6"
          component="h4"
          sx={{
            fontWeight: 600,
            fontSize: "2rem",
            color: "#1a365d",
            height: "3rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {product.productName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating
            value={
              product.reviews && product.reviews.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0
            }
            readOnly
            size="small"
            precision={0.5}
          />
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            ({product.reviews ? product.reviews.length : 0})
          </Typography>
        </Box>

        <Chip
          label={product.category}
          size="small"
          sx={{
            mb: 2,
            background:
              "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.1))",
            border: "1px solid rgba(3, 197, 219, 0.3)",
            color: "#1a365d",
            fontWeight: 500,
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
            }}
          >
            Rs. {product.price.cost}
          </Typography>
          {product.price.mrp && product.price.mrp !== product.price.cost && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "text.secondary",
              }}
            >
              Rs.{product.price.mrp}
            </Typography>
          )}
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default ProductCard;

"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  TextField,
  Typography,
  Divider,
  Skeleton,
  Chip,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  MoreVert,
  ShoppingCart,
  LocalShipping,
  Star,
  Edit,
  Delete,
  ArrowBack,
} from "@mui/icons-material";
import { addToCart, underControl } from "../../../redux/userSlice";
import { BasicButton, GreenButton } from "../../../utils/buttonStyles";
import { getProductDetails, updateStuff } from "../../../redux/userHandle";
import Popup from "../../../components/Popup";
import { generateRandomColor, timeAgo } from "../../../utils/helperFunctions";
import { motion, AnimatePresence } from "framer-motion";

// Styled components with animations
const AnimatedContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 20px;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ProductImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  @media (min-width: 768px) {
    width: 40%;
  }
`;

const ProductImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: white;
`;

const ProductInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 768px) {
    width: 60%;
  }
`;

const ProductName = styled(motion.h1)`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #333;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3f51b5, #2196f3);
    border-radius: 2px;
  }
`;

const PriceContainer = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-top: 1.5rem;
  align-items: center;
`;

const PriceMrp = styled(motion.p)`
  text-decoration: line-through;
  color: #777;
  font-size: 1rem;
`;

const PriceCost = styled(motion.h3)`
  font-size: 1.8rem;
  color: #3f51b5;
  font-weight: 700;
`;

const PriceDiscount = styled(motion.div)`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Description = styled(motion.p)`
  margin-top: 1.5rem;
  line-height: 1.6;
  color: #555;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #3f51b5;
`;

const ProductDetails = styled(motion.div)`
  margin: 1.5rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  p {
    background-color: #f5f5f5;
    padding: 0.75rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }
`;

const ButtonContainer = styled(motion.div)`
  margin: 1.5rem 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ReviewWritingContainer = styled(motion.div)`
  margin: 3rem auto;
  max-width: 800px;
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ReviewContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ReviewCard = styled(motion(Card))`
  && {
    background-color: white;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ReviewDetails = styled.div`
  flex: 1;
`;

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
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
  },
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const reviewCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: i * 0.1,
    },
  }),
  hover: {
    y: -5,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const ViewOrder = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const productID = params.id;

  const {
    currentUser,
    currentRole,
    productDetails,
    loading,
    status,
    error,
    responseReview,
    responseDetails,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProductDetails(productID));
  }, [productID, dispatch]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

  const deleteHandler = (reviewId) => {
    const fields = { reviewId };
    dispatch(updateStuff(fields, productID, "deleteProductReview"));
  };
  const productWithQuantity = {
    ...productDetails,
    quantity: quantity, // Use the selected quantity for the cart
  };
  const reviewer = currentUser && currentUser._id;

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      setMessage("Please select a rating.");
      setShowPopup(true);
      setIsSubmitting(false);
    } else {
      const fields = { rating, comment, reviewer };
      dispatch(updateStuff(fields, productID, "addReview"));

      // Reset after animation completes
      setTimeout(() => {
        setRating(0);
        setComment("");
        setIsSubmitting(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (status === "updated") {
      dispatch(getProductDetails(productID));
      dispatch(underControl());
    } else if (responseReview) {
      setMessage("You have already submitted a review for this product.");
      setShowPopup(true);
    } else if (error) {
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [dispatch, responseReview, productID, status, error]);

  if (loading) {
    return (
      <AnimatedContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ProductContainer>
          <Skeleton
            variant="rectangular"
            width={300}
            height={300}
            sx={{ borderRadius: 2 }}
          />
          <ProductInfo>
            <Skeleton variant="text" width="80%" height={60} />
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="100%" height={100} />
            <Skeleton variant="text" width="60%" height={40} />
          </ProductInfo>
        </ProductContainer>
      </AnimatedContainer>
    );
  }

  if (responseDetails) {
    return (
      <AnimatedContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ textAlign: "center", padding: "4rem 1rem" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Typography variant="h4" gutterBottom>
            Product not found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </motion.div>
        </motion.div>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      <ProductContainer>
        <ProductImageContainer variants={itemVariants} whileHover="hover">
          <ProductImage
            variants={imageVariants}
            src={productDetails && productDetails.productImage}
            alt={productDetails && productDetails.productName}
          />
        </ProductImageContainer>

        <ProductInfo>
          <ProductName variants={itemVariants}>
            {productDetails?.productName}
          </ProductName>

          <motion.div variants={itemVariants}>
            <Chip
              label={productDetails?.category}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={productDetails?.subcategory}
              variant="outlined"
              size="small"
            />
          </motion.div>

          <PriceContainer variants={itemVariants}>
            <PriceCost>Rs.{productDetails?.price?.cost}</PriceCost>
            <PriceMrp>Rs.{productDetails?.price?.mrp}</PriceMrp>
            <PriceDiscount>
              {productDetails?.price?.discountPercent}% off
            </PriceDiscount>
          </PriceContainer>

          <Description variants={itemVariants}>
            {productDetails?.description}
          </Description>

          <ProductDetails variants={itemVariants}>
            <p>
              <LocalShipping sx={{ color: "#3f51b5" }} />
              {productDetails?.shipping_cost
                ? `Rs ${productDetails.shipping_cost} Shipping`
                : "Free Shipping"}
            </p>
            <p>
              <Star sx={{ color: "#f57c00" }} /> Top Rated Product
            </p>
          </ProductDetails>

          {currentRole === "Customer" && (
            <ButtonContainer variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BasicButton
                  onClick={() => dispatch(addToCart(productWithQuantity))}
                  startIcon={<ShoppingCart />}
                  sx={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontWeight: 600,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Re-Order
                </BasicButton>
              </motion.div>
            </ButtonContainer>
          )}
        </ProductInfo>
      </ProductContainer>

      {currentRole === "Customer" && (
        <ReviewWritingContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight={600}
              textAlign="center"
            >
              Share Your Experience
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </motion.div>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <motion.div
              variants={itemVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              <Box>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={handleRatingChange}
                  size="large"
                  sx={{
                    fontSize: "2rem",
                    "& .MuiRating-iconFilled": {
                      color: "#f57c00",
                    },
                  }}
                />
              </Box>

              <TextField
                label="Write a Review"
                variant="outlined"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ width: "100%" }}
                required
                InputProps={{
                  sx: {
                    borderRadius: "12px",
                  },
                }}
              />

              <Box sx={{ textAlign: "right", width: "100%" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GreenButton
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: 600,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <CircularProgress size={24} color="inherit" />
                      </motion.div>
                    ) : (
                      "Submit Review"
                    )}
                  </GreenButton>
                </motion.div>
              </Box>
            </motion.div>
          </form>
        </ReviewWritingContainer>
      )}

      <ReviewWritingContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Customer Reviews
          </Typography>
        </motion.div>
      </ReviewWritingContainer>

      {productDetails.reviews && productDetails.reviews.length > 0 ? (
        <ReviewContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {productDetails.reviews.map((review, index) => (
              <ReviewCard
                key={index}
                custom={index}
                variants={reviewCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit={{ opacity: 0, y: 20 }}
              >
                <ReviewCardDivision>
                  <Avatar
                    sx={{
                      width: "60px",
                      height: "60px",
                      marginRight: "1rem",
                      backgroundColor: generateRandomColor(review._id),
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {String(review.reviewer.name).charAt(0)}
                  </Avatar>
                  <ReviewDetails>
                    <Typography variant="h6" fontWeight={600}>
                      {review.reviewer.name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {timeAgo(review.date)}
                      </Typography>
                    </div>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{
                          color: "#f57c00",
                          mr: 1,
                        }}
                      />
                      <Chip
                        label={`${review.rating}/5`}
                        size="small"
                        color={
                          review.rating >= 4
                            ? "success"
                            : review.rating >= 3
                            ? "primary"
                            : "error"
                        }
                        sx={{ height: "20px" }}
                      />
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f9f9f9",
                        borderRadius: "8px",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1">{review.comment}</Typography>
                    </Paper>
                  </ReviewDetails>
                  {review.reviewer._id === reviewer && (
                    <>
                      <IconButton
                        onClick={handleOpenMenu}
                        sx={{
                          color: "inherit",
                          p: 1,
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.05)",
                            transform: "rotate(90deg)",
                            transition: "all 0.3s ease",
                          },
                        }}
                      >
                        <MoreVert sx={{ fontSize: "1.5rem" }} />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorElMenu}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        open={Boolean(anchorElMenu)}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                          sx: {
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleCloseMenu();
                          }}
                          sx={{
                            gap: 1,
                            borderRadius: "8px",
                            m: 0.5,
                            "&:hover": { bgcolor: "rgba(63, 81, 181, 0.1)" },
                          }}
                        >
                          <Edit fontSize="small" color="primary" />
                          <Typography textAlign="center">Edit</Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            deleteHandler(review._id);
                            handleCloseMenu();
                          }}
                          sx={{
                            gap: 1,
                            borderRadius: "8px",
                            m: 0.5,
                            "&:hover": { bgcolor: "rgba(211, 47, 47, 0.1)" },
                          }}
                        >
                          <Delete fontSize="small" color="error" />
                          <Typography textAlign="center">Delete</Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </ReviewCardDivision>
              </ReviewCard>
            ))}
          </AnimatePresence>
        </ReviewContainer>
      ) : (
        <ReviewWritingContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No Reviews Found. Be the first to add a review!
            </Typography>
          </motion.div>
        </ReviewWritingContainer>
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </AnimatedContainer>
  );
};

export default ViewOrder;

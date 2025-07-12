"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.orderId);
    setOpenSnackbar(true);
  };

  const handleCardClick = () => {
    navigate("/order/view/" + product._id);
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: {
      y: -8,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    tap: { scale: 0.98 },
  };

  const imageVariants = {
    hover: {
      scale: 1.08,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const priceVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } },
  };

  const copyButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { yoyo: Number.POSITIVE_INFINITY, duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      layout
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer",
          background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Order ID Copy Feature */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            p: 2,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(5px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <motion.div variants={copyButtonVariants}>
            <Tooltip title="Copy Order ID" arrow>
              <IconButton
                onClick={handleCopy}
                color="primary"
                sx={{
                  background: "rgba(25, 118, 210, 0.1)",
                  "&:hover": { background: "rgba(25, 118, 210, 0.2)" },
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </motion.div>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Order ID: {product.orderId}
          </Typography>
        </Stack>

        {/* Product Image */}
        <Box
          sx={{
            pt: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            variants={imageVariants}
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <motion.img
              src={product.productImage}
              alt={product.productName}
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": { bgcolor: "primary.main", color: "white" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Product Details */}
        <Stack
          spacing={2}
          sx={{
            p: 3,
            textAlign: "center",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Link
            color="inherit"
            underline="none"
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              cursor: "pointer",
              transition: "color 0.3s ease",
              "&:hover": { color: "primary.main" },
            }}
          >
            {product.productName}
          </Link>

          <motion.div variants={priceVariants}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Typography
                variant="body1"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                Rs.{product.price?.mrp}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 700,
                  textShadow: "0px 0px 1px rgba(0,0,0,0.1)",
                }}
              >
                Rs.{product.price?.cost}
              </Typography>
            </Stack>
          </motion.div>
        </Stack>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="Order ID copied to clipboard!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: "primary.main",
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;

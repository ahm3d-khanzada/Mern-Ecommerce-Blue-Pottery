"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Box,
  Snackbar,
  Alert,
} from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import InfoIcon from "@mui/icons-material/Info"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../../../redux/userSlice"

const CustomOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    axios
      .get("http://localhost:5000/CustomPricedO")
      .then((response) => {
        setOrders(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching Orders:", error)
        setLoading(false)
      })
  }, [])

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  // Animation for card entry
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <AccessTimeIcon fontSize="small" />
      case "Completed":
        return <CheckCircleIcon fontSize="small" />
      default:
        return <InfoIcon fontSize="small" />
    }
  }

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning"
      case "Completed":
        return "success"
      default:
        return "info"
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f0f7ff",
        }}
      >
        <CircularProgress sx={{ color: "#1565c0" }} />
      </Box>
    )
  }

  return (
    <Box sx={{ padding: "24px", bgcolor: "#f0f7ff", minHeight: "100vh" }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: "bold",
          background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Custom Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <AnimatedCard
              order={order}
              cardVariants={cardVariants}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              showSnackbar={showSnackbar}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

const AnimatedCard = ({ order, cardVariants, getStatusIcon, getStatusColor, showSnackbar }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Check if order is already in cart
  const isOrderInCart = () => {
    if (!currentUser || !currentUser.cartDetails) return false
    return currentUser.cartDetails.some((item) => item._id === order._id)
  }

  const handleAddToCart = () => {
    if (!order) {
      showSnackbar("Order details not available", "error")
      return
    }

    if (order.status !== "priced") {
      showSnackbar("This order is not ready for purchase yet", "error")
      return
    }

    // Format the order data to match the structure expected by Cart.jsx
    // but with special flags for custom orders
    const orderForCart = {
      _id: order._id,
      productName: order._id, // Use order ID as the title
      productImage: order.image || "/placeholder.svg",
      quantity: 1,
      // Set price without discount
      price: {
        cost: order.price,
        mrp: order.price,
        discountPercent: 0,
      },
      // Special flags for custom orders
      isCustomOrder: true,
      isQuantityFixed: true, // Flag to prevent quantity changes
      description: order.description,
      userEmail: order.userEmail,
      vendorId: order.vendorId,
      status: order.status,
    }

    // Add to cart
    dispatch(addToCart(orderForCart))

    // Show feedback to user
    showSnackbar("Custom order added to cart")
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={cardVariants} style={{ height: "100%" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
          borderRadius: "12px",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          border: "1px solid #bbdefb",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "200px",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #e3f2fd, #ffffff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <img
            src={order.image || "/placeholder.svg"}
            alt="Custom Order"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="caption" color="#1976d2">
                Order ID
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "medium",
                  color: "#0d47a1",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {order._id}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="#1976d2">
                Price
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#0d47a1",
                }}
              >
                ${order.price}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="#1976d2">
              Email
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#0d47a1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {order.userEmail}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="#1976d2">
              Vendor ID
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#0d47a1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {order.vendorId}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="#1976d2">
              Description
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#0d47a1",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {order.description}
            </Typography>
          </Box>

          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </CardContent>

        <Box
          sx={{
            display: "flex",
            padding: "16px",
          }}
        >
          {/* Show cart status if order is in cart */}
          {isOrderInCart() && (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                bottom: "70px",
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#1976d2",
                fontWeight: 500,
              }}
            >
              Already in cart
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={order.status !== "priced"}
            sx={{
              fontWeight: "bold",
              boxShadow: 3,
              width: "100%",
              bgcolor: order.status === "priced" ? "#1565c0" : "rgba(0, 0, 0, 0.12)",
              color: order.status === "priced" ? "white" : "rgba(0, 0, 0, 0.26)",
              "&:hover": {
                bgcolor: order.status === "priced" ? "#0d47a1" : "rgba(0, 0, 0, 0.12)",
                transform: order.status === "priced" ? "scale(1.05)" : "none",
              },
            }}
          >
            {isOrderInCart() ? "Add Again" : "Add to Cart"}
          </Button>
        </Box>
      </Card>
    </motion.div>
  )
}

export default CustomOrder


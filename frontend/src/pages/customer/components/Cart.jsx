import { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import {
  Button,
  Container,
  Divider,
  IconButton,
  Typography,
  CardContent,
  Box,
  Chip,
  Tooltip,
  Badge,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowUp,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon,
  DesignServices as DesignServicesIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material"
import { addToCart, removeAllFromCart, removeFromCart, removeSpecificProduct } from "../../../redux/userSlice"
import { updateCustomer } from "../../../redux/userHandle"

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
  height: "100%",
  maxHeight: "90vh",
  overflow: "hidden",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
}))

const TopContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  padding: theme.spacing(2),
  backgroundColor: "#f8f9fa",
  zIndex: 10,
  width: "100%",
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

const CartContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  width: "100%",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c5c5c5",
    borderRadius: "10px",
    "&:hover": {
      background: "#a8a8a8",
    },
  },
}))

const EmptyCartContainer = styled(motion.div)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: theme.spacing(6),
  textAlign: "center",
}))

const ProductCard = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
}))

const CustomOrderCard = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}))

const ProductContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },
}))

const ProductImage = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: "8px",
  marginRight: theme.spacing(2),
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}))

const ProductDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}))

const QuantityControl = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "20px",
  width: "fit-content",
  overflow: "hidden",
  backgroundColor: "#f5f5f5",
}))

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}))

const PriceSummary = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  borderTop: `4px solid ${theme.palette.primary.main}`,
}))

const BottomContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "sticky",
  bottom: 0,
  padding: theme.spacing(2),
  backgroundColor: "#f8f9fa",
  borderTop: `1px solid ${theme.palette.divider}`,
  width: "100%",
  zIndex: 10,
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 3,
    padding: "0 4px",
    backgroundColor: theme.palette.primary.main,
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  },
}))

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
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

const summaryVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
}

const Cart = ({ setIsCartOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const cartDetails = currentUser.cartDetails || []

  const priceContainerRef = useRef(null)
  const firstCartItemRef = useRef(null)

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product))
  }

  const handleRemoveProduct = (productId) => {
    dispatch(removeSpecificProduct(productId))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const handleRemoveAllFromCart = () => {
    dispatch(removeAllFromCart())
  }

  const totalQuantity = cartDetails.reduce((total, item) => total + item.quantity, 0)
  const totalOGPrice = cartDetails.reduce((total, item) => total + item.quantity * item.price.mrp, 0)
  const totalNewPrice = cartDetails.reduce((total, item) => total + item.quantity * item.price.cost, 0)
  const totalSavings = totalOGPrice - totalNewPrice

  const productViewHandler = (productID) => {
    navigate("/product/view/" + productID)
    setIsCartOpen(false)
  }

  const productBuyingHandler = (id) => {
    dispatch(updateCustomer(currentUser, currentUser._id))
    setIsCartOpen(false)
    navigate(`/product/buy/${id}`)
  }

  const allProductsBuyingHandler = () => {
    dispatch(updateCustomer(currentUser, currentUser._id))
    setIsCartOpen(false)
    navigate("/Checkout")
  }

  const handleScrollToBottom = () => {
    if (priceContainerRef.current) {
      priceContainerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleScrollToTop = () => {
    if (firstCartItemRef.current) {
      firstCartItemRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Render a regular product item
  const renderRegularProduct = (item, index) => (
    <ProductCard
      key={item._id}
      ref={index === 0 ? firstCartItemRef : null}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5 }}
      layout
    >
      <ProductContent>
        <ProductImage src={item.productImage} alt={item.productName} />

        <ProductDetails>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" component="h3" fontWeight="600">
              {item.productName}
            </Typography>
            <Chip
              label={`${item.price.discountPercent}% OFF`}
              size="small"
              color="primary"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "white",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}>
            <Typography variant="h6" component="span" fontWeight="600">
              Rs.{item.price.cost}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textDecoration: "line-through" }}>
              Rs.{item.price.mrp}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <QuantityControl>
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton size="small" onClick={() => handleRemoveFromCart(item)} sx={{ color: "#f44336" }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </motion.div>
              <Typography sx={{ px: 2, fontWeight: "medium" }}>{item.quantity}</Typography>
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton size="small" onClick={() => handleAddToCart(item)} sx={{ color: "#4caf50" }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </motion.div>
            </QuantityControl>

            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              Total: Rs.{item.quantity * item.price.cost}
            </Typography>
          </Box>

          <ActionButtons>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => productViewHandler(item._id)}
              >
                View
              </StyledButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                variant="contained"
                color="primary"
                size="small"
                startIcon={<CreditCardIcon />}
                onClick={() => productBuyingHandler(item._id)}
              >
                Buy Now
              </StyledButton>
            </motion.div>
          </ActionButtons>
        </ProductDetails>
      </ProductContent>
    </ProductCard>
  )

  // Render a custom order item
  const renderCustomOrder = (item, index) => (
    <CustomOrderCard
      key={item._id}
      ref={index === 0 ? firstCartItemRef : null}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5 }}
      layout
    >
      <ProductContent>
        <ProductImage src={item.productImage} alt="Custom Order" />

        <ProductDetails>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DesignServicesIcon color="primary" />
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: "bold" }}>
                  CUSTOM ORDER
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Order ID: {item.productName}
                </Typography>
              </Box>
            </Box>
          </Box>

          {item.description && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2">
                {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
              Rs.{item.price.cost}
            </Typography>
            <Chip label="Quantity: 1 (Fixed)" size="small" variant="outlined" color="primary" />
          </Box>

          <ActionButtons>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveProduct(item._id)}
              >
                Remove
              </StyledButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                variant="contained"
                color="primary"
                size="small"
                startIcon={<CreditCardIcon />}
                onClick={() => productBuyingHandler(item._id)}
              >
                Buy Now
              </StyledButton>
            </motion.div>
          </ActionButtons>
        </ProductDetails>
      </ProductContent>
    </CustomOrderCard>
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <StyledContainer>
          {/* Top Navigation */}
          <TopContainer>
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<KeyboardDoubleArrowLeft />}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </StyledButton>
            </motion.div>

            {cartDetails.length > 0 && (
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title="Scroll to top">
                  <IconButton
                    color="primary"
                    onClick={handleScrollToTop}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      borderRadius: "50%",
                    }}
                  >
                    <KeyboardDoubleArrowUp />
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
          </TopContainer>

          {/* Cart Content */}
          <CartContent>
            <AnimatePresence>
              {cartDetails.length === 0 ? (
                <EmptyCartContainer variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <ShoppingCartIcon
                      sx={{
                        fontSize: 100,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.7,
                      }}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Your cart is empty
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      paragraph
                      sx={{ maxWidth: "400px", mx: "auto", mb: 3 }}
                    >
                      Looks like you haven't added any products to your cart yet. Explore our beautiful Multan pottery
                      collection and find something you'll love!
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => setIsCartOpen(false)}
                      startIcon={<ShoppingBagIcon />}
                      size="large"
                    >
                      Start Shopping
                    </StyledButton>
                  </motion.div>
                </EmptyCartContainer>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Your Cart
                    </Typography>
                    <StyledBadge badgeContent={totalQuantity} color="primary" showZero>
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </Box>

                  <AnimatePresence>
                    {cartDetails.map((item, index) =>
                      item.isCustomOrder ? renderCustomOrder(item, index) : renderRegularProduct(item, index),
                    )}
                  </AnimatePresence>

                  {/* Price Summary */}
                  <PriceSummary ref={priceContainerRef} variants={summaryVariants} initial="hidden" animate="visible">
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocalShippingIcon /> ORDER SUMMARY
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Price ({totalQuantity} items)</Typography>
                      <Typography>Rs.{totalOGPrice}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                        color: "success.main",
                        fontWeight: "medium",
                      }}
                    >
                      <Typography>Discount</Typography>
                      <Typography>- Rs.{totalSavings}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Delivery</Typography>
                      <Typography sx={{ color: "success.main" }}>Free</Typography>
                    </Box>

                    <Divider
                      sx={{
                        my: 2,
                        borderStyle: "dashed",
                        borderColor: "primary.main",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        py: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderRadius: "8px",
                        px: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        Rs.{totalNewPrice}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: "medium" }}>
                      You will save Rs.{totalSavings} on this order
                    </Typography>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={allProductsBuyingHandler}
                        startIcon={<ShoppingBagIcon />}
                        sx={{
                          py: 1.5,
                          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        }}
                      >
                        Checkout All Items
                      </StyledButton>
                    </motion.div>
                  </PriceSummary>
                </motion.div>
              )}
            </AnimatePresence>
          </CartContent>

          {/* Bottom Actions */}
          {cartDetails.length > 0 && (
            <BottomContainer>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <StyledButton variant="outlined" onClick={handleScrollToBottom} sx={{ borderRadius: "8px" }}>
                  View Summary
                </StyledButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <StyledButton
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveAllFromCart}
                  sx={{ borderRadius: "8px" }}
                >
                  Clear Cart
                </StyledButton>
              </motion.div>
            </BottomContainer>
          )}
        </StyledContainer>
      </motion.div>

    </>
  )
}

export default Cart

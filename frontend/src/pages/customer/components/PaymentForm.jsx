import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../../components/Popup";
import {
  fetchProductDetailsFromCart,
  removeAllFromCart,
  removeSpecificProduct,
} from "../../../redux/userSlice";
import {
  CreditCard,
  CalendarMonth,
  Lock,
  ArrowBack,
  ShoppingBag,
} from "@mui/icons-material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiInputAdornment-root": {
    color: theme.palette.text.secondary,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  },
}));

const PaymentContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s infinite",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    opacity: 0.7,
  },
  "@keyframes shimmer": {
    "0%": {
      backgroundPosition: "200% 0",
    },
    "100%": {
      backgroundPosition: "-200% 0",
    },
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "&::after": {
    content: '""',
    display: "block",
    height: "2px",
    background: theme.palette.primary.main,
    flex: 1,
    marginLeft: "10px",
    borderRadius: "2px",
  },
}));

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
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const PaymentForm = ({ handleBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, currentUser, productDetailsCart } = useSelector(
    (state) => state.user
  );

  const params = useParams();
  const productID = params.id;

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Format card number with spaces
    if (id === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setPaymentData((prevData) => ({
        ...prevData,
        [id]: formattedValue,
      }));
    } else {
      setPaymentData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productID) {
      dispatch(fetchProductDetailsFromCart(productID));
    }
  }, [productID, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!paymentData.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(paymentData.cardName)) {
      newErrors.cardName = "Name should contain only letters";
      isValid = false;
    }

    const cardNumberWithoutSpaces = paymentData.cardNumber.replace(/\s/g, "");
    if (!cardNumberWithoutSpaces) {
      newErrors.cardNumber = "Card number is required";
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumberWithoutSpaces)) {
      newErrors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }

    if (!paymentData.expDate) {
      newErrors.expDate = "Expiry date is required";
      isValid = false;
    } else {
      const today = new Date();
      const expDate = new Date(paymentData.expDate);
      if (expDate < today) {
        newErrors.expDate = "Card has expired";
        isValid = false;
      }
    }

    if (!paymentData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
      isValid = false;
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const cartDetails = currentUser.cartDetails || [];

  const productsQuantity = cartDetails.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartDetails.reduce(
    (total, item) => total + item.quantity * (item.price?.cost || 0),
    0
  );

  const singleProductQuantity = productDetailsCart?.quantity || 0;
  const totalsingleProductPrice =
    (productDetailsCart?.price?.cost || 0) * singleProductQuantity;

  const paymentID = `${paymentData.cardNumber.slice(-4)}-${
    paymentData.expDate
      ? `${paymentData.expDate.slice(5, 7)}${paymentData.expDate.slice(2, 4)}`
      : "0000"
  }-${Date.now()}`;

  const paymentInfo = { id: paymentID, status: "Successful" };

  const multiOrderData = {
    buyer: currentUser._id,
    shippingData: currentUser.shippingData,
    orderedProducts: cartDetails,
    paymentInfo,
    productsQuantity,
    totalPrice,
  };

  const singleOrderData = {
    buyer: currentUser._id,
    shippingData: currentUser.shippingData,
    orderedProducts: productDetailsCart,
    paymentInfo,
    productsQuantity: singleProductQuantity,
    totalPrice: totalsingleProductPrice,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (productID) {
        if (!productDetailsCart) {
          setMessage("Product details not available");
          setShowPopup(true);
          setIsSubmitting(false);
          return;
        }
        dispatch(addStuff("newOrder", singleOrderData));
        dispatch(removeSpecificProduct(productID));
      } else {
        if (!cartDetails || cartDetails.length === 0) {
          setMessage("Your cart is empty");
          setShowPopup(true);
          setIsSubmitting(false);
          return;
        }
        dispatch(addStuff("newOrder", multiOrderData));
        dispatch(removeAllFromCart());
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setMessage("Failed to place order. Please try again.");
      setShowPopup(true);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Aftermath");
    } else if (status === "failed") {
      setMessage("Order Failed");
      setShowPopup(true);
      setIsSubmitting(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setIsSubmitting(false);
    }
  }, [status, navigate]);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <PaymentContainer>
        <FormTitle variant="h6">
          <CreditCard color="primary" /> Payment method
        </FormTitle>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="cardName"
                  label="Name on card"
                  fullWidth
                  autoComplete="cc-name"
                  variant="outlined"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                  InputProps={{
                    startAdornment: (
                      <Box
                        component="span"
                        sx={{ mr: 1, color: "text.secondary" }}
                      >
                        <CreditCard fontSize="small" color="action" />
                      </Box>
                    ),
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="cardNumber"
                  label="Card number"
                  type="text"
                  inputProps={{ maxLength: 19 }}
                  fullWidth
                  autoComplete="cc-number"
                  variant="outlined"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="expDate"
                  type="date"
                  helperText={errors.expDate || "Expiry date"}
                  fullWidth
                  autoComplete="cc-exp"
                  variant="outlined"
                  value={paymentData.expDate}
                  onChange={handleInputChange}
                  error={!!errors.expDate}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <Box
                        component="span"
                        sx={{ mr: 1, color: "text.secondary" }}
                      >
                        <CalendarMonth fontSize="small" color="action" />
                      </Box>
                    ),
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="cvv"
                  label="CVV"
                  type="password"
                  inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
                  helperText={
                    errors.cvv || "Last three digits on signature strip"
                  }
                  fullWidth
                  autoComplete="cc-csc"
                  variant="outlined"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  error={!!errors.cvv}
                  InputProps={{
                    startAdornment: (
                      <Box
                        component="span"
                        sx={{ mr: 1, color: "text.secondary" }}
                      >
                        <Lock fontSize="small" color="action" />
                      </Box>
                    ),
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ActionButton
                onClick={handleBack}
                sx={{ mr: 1 }}
                disabled={isSubmitting}
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Back
              </ActionButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ActionButton
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <ShoppingBag />
                  )
                }
              >
                {isSubmitting ? "Processing..." : "Place order"}
              </ActionButton>
            </motion.div>
          </Box>
        </form>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </PaymentContainer>
    </motion.div>
  );
};

export default PaymentForm;

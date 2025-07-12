import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  Grid, 
  CircularProgress, 
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  IconButton,
  Divider,
  Paper,
  Fade,
  Zoom,
  Tooltip
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from "framer-motion";

const defaultImage = "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg";

const CustomOrderApproval = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [orderToReject, setOrderToReject] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sellerId = storedUser?._id;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/CustomOrders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = (order) => {
    setSelectedOrder(order);
    setPrice(0);
    setPriceError(false);
    setModal(!modal);
  };

  const handleApproval = async () => {
    if (price <= 0) {
      setPriceError(true);
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/update-status/${selectedOrder._id}`,
        {
          status: "priced",
          price,
          vendorId: sellerId,
        }
      );
      fetchOrders();
      setModal(false);
    } catch (error) {
      console.error("Error updating order", error);
    }
  };

  const openRejectConfirm = (order) => {
    setOrderToReject(order);
    setConfirmReject(true);
  };

  const handleRejection = async () => {
    try {
      await axios.put(`http://localhost:5000/update-status/${orderToReject._id}`, {
        status: "rejected",
        vendorId: sellerId,
      });
      fetchOrders();
      setConfirmReject(false);
    } catch (error) {
      console.error("Error rejecting order", error);
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case "pending":
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: "medium" }} />;
      case "priced":
        return <Chip label="Priced" color="info" size="small" sx={{ fontWeight: "medium" }} />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" sx={{ fontWeight: "medium" }} />;
      default:
        return <Chip label={status} color="default" size="small" sx={{ fontWeight: "medium" }} />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f0f7ff"
        }}
      >
        <CircularProgress sx={{ color: "#1565c0" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "24px", bgcolor: "#f0f7ff", minHeight: "100vh" }}>
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
          WebkitTextFillColor: "transparent"
        }}
      >
        Custom Pottery Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: '12px',
            bgcolor: 'white',
            border: '1px solid #bbdefb'
          }}
        >
          <Typography variant="h6" color="#1976d2">
            No custom orders available at this time
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for new custom order requests
          </Typography>
        </Paper>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <motion.div variants={itemVariants}>
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
                        height: "250px",
                        overflow: "hidden",
                        background: "linear-gradient(to bottom, #e3f2fd, #ffffff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 2
                      }}
                    >
                      <img
                        src={order.image || defaultImage}
                        alt="Pottery"
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <EmailIcon sx={{ color: "#1976d2", mr: 1, fontSize: 20 }} />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: "medium", 
                            color: "#0d47a1",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {order.userEmail}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", mb: 2 }}>
                        <DescriptionIcon sx={{ color: "#1976d2", mr: 1, fontSize: 20, alignSelf: "flex-start", mt: 0.5 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#0d47a1",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {order.description}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Typography variant="body2" color="#1976d2" sx={{ mr: 1 }}>
                          Status:
                        </Typography>
                        {getStatusChip(order.status)}
                      </Box>
                      
                      {order.status === "pending" && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AttachMoneyIcon />}
                            onClick={() => toggleModal(order)}
                            sx={{
                              flex: 1,
                              fontWeight: "bold",
                              bgcolor: "#1565c0",
                              "&:hover": {
                                bgcolor: "#0d47a1",
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => openRejectConfirm(order)}
                            sx={{
                              flex: 1,
                              fontWeight: "bold",
                              borderColor: "#d32f2f",
                              color: "#d32f2f",
                              "&:hover": {
                                bgcolor: "#ffebee",
                                borderColor: "#c62828",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      
                      {order.status === "priced" && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AttachMoneyIcon sx={{ color: "#1976d2", mr: 1 }} />
                          <Typography variant="h6" color="#0d47a1" fontWeight="bold">
                            {order.price}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Price Approval Dialog */}
      <Dialog 
        open={modal} 
        onClose={() => setModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "1px solid #bbdefb",
            maxWidth: "400px",
            width: "100%"
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#f5f9ff", 
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" color="#0d47a1" fontWeight="bold">
            Approve Custom Order
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setModal(false)}
            sx={{ color: "#1976d2" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <DialogContentText color="#1976d2" sx={{ mb: 3 }}>
            Enter the price for this custom pottery order:
          </DialogContentText>
          
          <TextField
            autoFocus
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              if (Number(e.target.value) > 0) {
                setPriceError(false);
              }
            }}
            error={priceError}
            helperText={priceError ? "Price must be greater than 0" : ""}
            InputProps={{
              startAdornment: <AttachMoneyIcon sx={{ color: "#1976d2", mr: 1 }} />,
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: priceError ? "#d32f2f" : "#bbdefb",
                },
                "&:hover fieldset": {
                  borderColor: priceError ? "#d32f2f" : "#90caf9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: priceError ? "#d32f2f" : "#1976d2",
                },
              },
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setModal(false)}
            sx={{
              color: "#1976d2",
              "&:hover": {
                bgcolor: "#f0f7ff",
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApproval}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: "#1565c0",
              "&:hover": {
                bgcolor: "#0d47a1",
              },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Confirmation Dialog */}
      <Dialog
        open={confirmReject}
        onClose={() => setConfirmReject(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "1px solid #bbdefb",
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#ffebee" }}>
          <Typography variant="h6" color="#d32f2f" fontWeight="bold">
            Confirm Rejection
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Are you sure you want to reject this custom order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmReject(false)}
            sx={{
              color: "#1976d2",
              "&:hover": {
                bgcolor: "#f0f7ff",
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejection}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
          >
            Reject Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomOrderApproval;

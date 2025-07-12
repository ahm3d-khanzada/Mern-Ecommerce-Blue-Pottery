"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  TextField,
  Box,
  IconButton,
  Divider,
  Paper,
  Tabs,
  Tab,
} from "@mui/material"
import StoreIcon from "@mui/icons-material/Store"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import ImageIcon from "@mui/icons-material/Image"
import EmailIcon from "@mui/icons-material/Email"
import DescriptionIcon from "@mui/icons-material/Description"

const CustomSellerList = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [orderDetails, setOrderDetails] = useState({
    image: "",
    description: "",
    userEmail: "",
    vendorId: "",
  })
  const [activeTab, setActiveTab] = useState(0)
  const [formErrors, setFormErrors] = useState({
    image: false,
    description: false,
    userEmail: false,
  })

  useEffect(() => {
    axios
      .get("http://localhost:5000/EnableCustomized")
      .then((response) => {
        const filteredVendors = response.data.filter(
          (vendor) => vendor.isCustomizationEnabled && vendor.Approval_Status,
        )
        setVendors(filteredVendors)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error)
        setLoading(false)
      })
  }, [])

  const openOrderForm = (vendor) => {
    setSelectedVendor(vendor)
    setOrderDetails({
      image: "",
      description: "",
      userEmail: "",
      vendorId: vendor._id,
    })
    setActiveTab(0)
    setShowOrderForm(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setOrderDetails({ ...orderDetails, [name]: value })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      })
    }
  }

  const validateForm = () => {
    const errors = {
      image: !orderDetails.image,
      description: !orderDetails.description,
      userEmail: !orderDetails.userEmail || !/\S+@\S+\.\S+/.test(orderDetails.userEmail),
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/CustomizePottery", orderDetails)
      console.log("Order placed successfully:", response.data)
      alert("Customization request sent successfully!")
      setShowOrderForm(false)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to send request.")
    }
  }

  const handleTabChange = (event, newValue) => {
    // If switching to preview tab, validate form first
    if (newValue === 1) {
      if (!validateForm()) {
        return
      }
    }
    setActiveTab(newValue)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
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
        Custom Pottery Sellers
      </Typography>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3}>
          {vendors.map((vendor) => (
            <Grid item xs={12} sm={6} md={4} key={vendor._id}>
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
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          bgcolor: "#e3f2fd",
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <StoreIcon sx={{ color: "#1565c0" }} />
                      </Box>
                      <Typography variant="h6" color="#0d47a1">
                        {vendor.shopName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="#1976d2">
                        Seller
                      </Typography>
                      <Typography variant="body1" color="#0d47a1">
                        {vendor.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="#1976d2">
                        Email
                      </Typography>
                      <Typography variant="body1" color="#0d47a1">
                        {vendor.email}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ display: "flex", justifyContent: "center", padding: "16px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => openOrderForm(vendor)}
                      sx={{
                        fontWeight: "bold",
                        boxShadow: 3,
                        width: "100%",
                        bgcolor: "#1565c0",
                        "&:hover": {
                          bgcolor: "#0d47a1",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      Place Order
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Modal
        open={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        aria-labelledby="custom-order-modal"
        aria-describedby="custom-order-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 0,
            border: "1px solid #bbdefb",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              bgcolor: "#f5f9ff",
            }}
          >
            <Typography variant="h5" color="#0d47a1" fontWeight="bold">
              Custom Pottery Order
            </Typography>
            <IconButton onClick={() => setShowOrderForm(false)} size="small" sx={{ color: "#1976d2" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" color="#1976d2" sx={{ px: 3, pt: 2 }}>
            for {selectedVendor?.shopName}
          </Typography>

          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1565c0",
                },
                "& .Mui-selected": {
                  color: "#1565c0",
                },
              }}
            >
              <Tab icon={<EditIcon />} label="FORM" sx={{ textTransform: "none", fontWeight: "bold" }} />
              <Tab icon={<VisibilityIcon />} label="PREVIEW" sx={{ textTransform: "none", fontWeight: "bold" }} />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 ? (
              <Box component="form" noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="image"
                  label="Image Link"
                  name="image"
                  value={orderDetails.image}
                  onChange={handleChange}
                  error={formErrors.image}
                  helperText={formErrors.image ? "Image link is required" : ""}
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ mr: 1, color: "#1976d2" }} />,
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: formErrors.image ? "#d32f2f" : "#bbdefb",
                      },
                      "&:hover fieldset": {
                        borderColor: formErrors.image ? "#d32f2f" : "#90caf9",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: formErrors.image ? "#d32f2f" : "#1976d2",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={orderDetails.description}
                  onChange={handleChange}
                  error={formErrors.description}
                  helperText={formErrors.description ? "Description is required" : ""}
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ mr: 1, color: "#1976d2", alignSelf: "flex-start", mt: 1 }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: formErrors.description ? "#d32f2f" : "#bbdefb",
                      },
                      "&:hover fieldset": {
                        borderColor: formErrors.description ? "#d32f2f" : "#90caf9",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: formErrors.description ? "#d32f2f" : "#1976d2",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="userEmail"
                  label="Your Email"
                  name="userEmail"
                  type="email"
                  value={orderDetails.userEmail}
                  onChange={handleChange}
                  error={formErrors.userEmail}
                  helperText={formErrors.userEmail ? "Valid email is required" : ""}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "#1976d2" }} />,
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: formErrors.userEmail ? "#d32f2f" : "#bbdefb",
                      },
                      "&:hover fieldset": {
                        borderColor: formErrors.userEmail ? "#d32f2f" : "#90caf9",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: formErrors.userEmail ? "#d32f2f" : "#1976d2",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="vendorId"
                  label="Vendor ID"
                  name="vendorId"
                  value={orderDetails.vendorId}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    mb: 3,
                    bgcolor: "#f5f9ff",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#bbdefb",
                      },
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowOrderForm(false)}
                    sx={{
                      flex: 1,
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        borderColor: "#0d47a1",
                        bgcolor: "#f0f7ff",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => handleTabChange(null, 1)}
                    startIcon={<VisibilityIcon />}
                    sx={{
                      flex: 2,
                      bgcolor: "#42a5f5",
                      "&:hover": {
                        bgcolor: "#1976d2",
                      },
                    }}
                  >
                    Preview Order
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "8px",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography variant="h6" color="#0d47a1" gutterBottom>
                    Order Preview
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="#1976d2" gutterBottom>
                      Image Preview:
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "#f5f9ff",
                        borderRadius: "4px",
                        border: "1px dashed #90caf9",
                        mb: 1,
                        overflow: "hidden",
                      }}
                    >
                      {orderDetails.image ? (
                        <img
                          src={orderDetails.image || "/placeholder.svg"}
                          alt="Custom pottery preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL"
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No image provided
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Image URL: {orderDetails.image || "None"}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="#1976d2" gutterBottom>
                      Description:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: "#f5f9ff",
                        borderColor: "#90caf9",
                      }}
                    >
                      <Typography variant="body1">{orderDetails.description || "No description provided"}</Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="#1976d2" gutterBottom>
                      Contact Email:
                    </Typography>
                    <Typography variant="body1">{orderDetails.userEmail || "No email provided"}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="#1976d2" gutterBottom>
                      Vendor Information:
                    </Typography>
                    <Typography variant="body1">
                      <strong>Shop:</strong> {selectedVendor?.shopName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Vendor ID:</strong> {orderDetails.vendorId}
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab(0)}
                    startIcon={<EditIcon />}
                    sx={{
                      flex: 1,
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        borderColor: "#0d47a1",
                        bgcolor: "#f0f7ff",
                      },
                    }}
                  >
                    Edit Form
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<SendIcon />}
                    sx={{
                      flex: 2,
                      bgcolor: "#1565c0",
                      "&:hover": {
                        bgcolor: "#0d47a1",
                      },
                    }}
                  >
                    Submit Order
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default CustomSellerList


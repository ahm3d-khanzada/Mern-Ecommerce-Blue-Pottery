"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Avatar,
  Chip,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Badge,
} from "@mui/material"
import { CheckCircle as CheckCircleIcon, Store as StoreIcon, Email as EmailIcon } from "@mui/icons-material"
import { motion } from "framer-motion"

const ApprovalList = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmApprove, setConfirmApprove] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [filteredVendors, setFilteredVendors] = useState([])
  const [filter, setFilter] = useState("all") // "all", "approved", "pending"

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    if (filter === "all") {
      setFilteredVendors(vendors)
    } else if (filter === "approved") {
      setFilteredVendors(vendors.filter((vendor) => vendor.approved))
    } else if (filter === "pending") {
      setFilteredVendors(vendors.filter((vendor) => !vendor.approved))
    }
  }, [vendors, filter])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/Sellers")
      setVendors(res.data)
      setFilteredVendors(res.data)
    } catch (error) {
      console.error("Error fetching vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  const openApproveConfirm = (vendor) => {
    setSelectedVendor(vendor)
    setConfirmApprove(true)
  }

  const approveVendor = async () => {
    try {
      await axios.patch(`http://localhost:5000/Approved/${selectedVendor._id}`)
      setVendors(vendors.map((vendor) => (vendor._id === selectedVendor._id ? { ...vendor, approved: true } : vendor)))
      setConfirmApprove(false)
    } catch (error) {
      console.error("Error approving vendor:", error)
    }
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

  const pendingCount = vendors.filter((vendor) => !vendor.approved).length

  return (
    <Box sx={{ padding: "24px", bgcolor: "#f0f7ff", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mb: 2,
          fontWeight: "bold",
          background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Vendor Approval List
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Badge
            badgeContent={pendingCount}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontSize: 12, height: 20, minWidth: 20 } }}
          >
            <Typography variant="subtitle1" color="#1976d2">
              {vendors.length} Total Vendors
            </Typography>
          </Badge>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="All Vendors">
            <Chip
              label="All"
              variant={filter === "all" ? "filled" : "outlined"}
              color="primary"
              onClick={() => setFilter("all")}
              sx={{ fontWeight: "medium" }}
            />
          </Tooltip>
          <Tooltip title="Approved Vendors">
            <Chip
              label="Approved"
              variant={filter === "approved" ? "filled" : "outlined"}
              color="success"
              onClick={() => setFilter("approved")}
              icon={<CheckCircleIcon />}
              sx={{ fontWeight: "medium" }}
            />
          </Tooltip>
          <Tooltip title="Pending Approval">
            <Chip
              label="Pending"
              variant={filter === "pending" ? "filled" : "outlined"}
              color="warning"
              onClick={() => setFilter("pending")}
              sx={{ fontWeight: "medium" }}
            />
          </Tooltip>
        </Box>
      </Box>

      {filteredVendors.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            bgcolor: "white",
            border: "1px solid #bbdefb",
          }}
        >
          <Typography variant="h6" color="#1976d2">
            No vendors found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {filter === "all"
              ? "There are no vendors in the system"
              : filter === "approved"
                ? "There are no approved vendors"
                : "There are no pending vendors"}
          </Typography>
        </Paper>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {filteredVendors.map((vendor) => (
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
                    <Box
                      sx={{
                        bgcolor: "#e3f2fd",
                        pt: 4,
                        pb: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {vendor.approved && (
                        <Chip
                          label="Approved"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            fontWeight: "medium",
                          }}
                        />
                      )}

                      <Avatar
                        src={vendor.image || "/default-avatar.png"}
                        alt={vendor.name}
                        sx={{
                          width: 100,
                          height: 100,
                          border: "4px solid white",
                          boxShadow: 2,
                          mb: 2,
                        }}
                      />

                      <Typography variant="h6" color="#0d47a1" fontWeight="bold">
                        {vendor.name}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <StoreIcon sx={{ color: "#1976d2", mr: 1, fontSize: 20 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "medium",
                            color: "#0d47a1",
                          }}
                        >
                          {vendor.shopName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <EmailIcon sx={{ color: "#1976d2", mr: 1, fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#0d47a1",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {vendor.email}
                        </Typography>
                      </Box>

                      {!vendor.approved && (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<CheckCircleIcon />}
                          onClick={() => openApproveConfirm(vendor)}
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#1565c0",
                            "&:hover": {
                              bgcolor: "#0d47a1",
                            },
                          }}
                        >
                          Approve Vendor
                        </Button>
                      )}

                      {vendor.approved && (
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          disabled
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            fontWeight: "bold",
                            borderColor: "#bbdefb",
                            color: "#1976d2",
                          }}
                        >
                          Vendor Approved
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog
        open={confirmApprove}
        onClose={() => setConfirmApprove(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "1px solid #bbdefb",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#e8f5e9" }}>
          <Typography variant="h6" color="#2e7d32" fontWeight="bold">
            Confirm Approval
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Are you sure you want to approve <strong>{selectedVendor?.name}</strong> as a vendor? Their shop{" "}
            <strong>{selectedVendor?.shopName}</strong> will be visible to customers.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmApprove(false)}
            sx={{
              color: "#1976d2",
              "&:hover": {
                bgcolor: "#f0f7ff",
              },
            }}
          >
            Cancel
          </Button>
          <Button onClick={approveVendor} variant="contained" color="success" startIcon={<CheckCircleIcon />}>
            Approve Vendor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalList


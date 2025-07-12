// Edited

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  Home,
  ArrowBack,
  Person,
  Search,
  History,
  ShoppingCart,
  PersonSearch,
  SortByAlpha,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { getCustomers } from "../../../redux/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import styled from "styled-components";

// Motion components
const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
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

const cardVariants = {
  hover: {
    y: -5,
    boxShadow: "0px 10px 30px rgba(3, 197, 219, 0.2)",
    transition: { duration: 0.3 },
  },
};

const ShowCustomers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const customerID = params.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortedCustomers, setSortedCustomers] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  const { loading, customersList, responseCustomersList, specificProductData } =
    useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCustomers(customerID, "getInterestedCustomers"));
  }, [customerID, dispatch]);

  // Process customers data when it changes
  useEffect(() => {
    if (Array.isArray(customersList) && customersList.length > 0) {
      let filtered = [...customersList];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter((customer) =>
          customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort customers
      filtered.sort((a, b) => {
        if (sortDirection === "asc") {
          return a.customerName.localeCompare(b.customerName);
        } else {
          return b.customerName.localeCompare(a.customerName);
        }
      });

      setSortedCustomers(filtered);
    } else {
      setSortedCustomers([]);
    }
  }, [customersList, searchTerm, sortDirection]);

  // Get product name for breadcrumb
  const productName =
    specificProductData && specificProductData.length > 0
      ? specificProductData[0].productName
      : "Product";

  const customersColumns = [
    { id: "name", label: "Customer Name", minWidth: 170 },
    { id: "quantity", label: "Product Quantity", minWidth: 100 },
  ];

  const customersRows =
    sortedCustomers.length > 0
      ? sortedCustomers.map((customer) => ({
          name: customer.customerName,
          quantity: customer.quantity,
          id: customer.customerID,
        }))
      : [];

  const CustomersButtonHaver = ({ row }) => {
    return (
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <ViewHistoryButton
          startIcon={<History />}
          onClick={() => {
            console.log(row.name);
          }}
        >
          View Customer History
        </ViewHistoryButton>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#03c5db" }} />
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ py: 3 }}
    >
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 3,
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/Seller/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Seller/dashboard");
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5, fontSize: "1.2rem" }} />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/Seller/orders"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Seller/orders");
          }}
        >
          Orders
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/Seller/orders/product/${customerID}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/Seller/orders/product/${customerID}`);
          }}
        >
          {productName.length > 20
            ? productName.substring(0, 20) + "..."
            : productName}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          Customers
        </Typography>
      </Breadcrumbs>

      <MotionPaper
        variants={itemVariants}
        sx={{
          p: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          mb: 3,
          position: "relative",
        }}
      >
        {/* Decorative top bar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #03c5db, #f0e786)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonSearch sx={{ color: "#03c5db", mr: 1, fontSize: "2rem" }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "#1a365d",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Interested Customers
            </Typography>
          </Box>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <BackButton
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/Seller/orders/product/${customerID}`)}
            >
              Back to Product
            </BackButton>
          </motion.div>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search customers by name..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#03c5db" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#03c5db",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#03c5db",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Tooltip
                title={sortDirection === "asc" ? "Sort Z to A" : "Sort A to Z"}
              >
                <Button
                  variant="outlined"
                  startIcon={<SortByAlpha />}
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                  fullWidth
                  sx={{
                    borderColor: "#03c5db",
                    color: "#03c5db",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#02b1c5",
                      backgroundColor: "rgba(3, 197, 219, 0.05)",
                    },
                  }}
                >
                  Sort {sortDirection === "asc" ? "A to Z" : "Z to A"}
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {responseCustomersList ? (
          <EmptyState />
        ) : (
          <>
            {customersRows.length === 0 && searchTerm ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  px: 2,
                }}
              >
                <Search
                  sx={{ fontSize: 60, color: "rgba(0, 0, 0, 0.2)", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: "#1a365d",
                    textAlign: "center",
                  }}
                >
                  No Customers Found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    maxWidth: "400px",
                    mt: 1,
                  }}
                >
                  We couldn't find any customers matching "{searchTerm}". Try a
                  different search term.
                </Typography>
              </Box>
            ) : (
              <AnimatePresence>
                {customersRows.length > 0 ? (
                  <Box sx={{ overflowX: "auto" }}>
                    <TableTemplate
                      buttonHaver={CustomersButtonHaver}
                      columns={customersColumns}
                      rows={customersRows}
                    />
                  </Box>
                ) : (
                  <CustomerCardGrid>
                    {sortedCustomers.map((customer, index) => (
                      <MotionCard
                        key={customer.customerID}
                        variants={cardVariants}
                        whileHover="hover"
                        sx={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                          position: "relative",
                        }}
                      >
                        {/* Decorative top bar */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                              "linear-gradient(90deg, #03c5db, #f0e786)",
                          }}
                        />
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                mr: 2,
                                background:
                                  "linear-gradient(135deg, #03c5db, #0d47a1)",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              {customer.customerName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: "#1a365d",
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              >
                                {customer.customerName}
                              </Typography>
                              <Chip
                                icon={
                                  <ShoppingCart
                                    sx={{ fontSize: "1rem !important" }}
                                  />
                                }
                                label={`Quantity: ${customer.quantity}`}
                                size="small"
                                sx={{
                                  background:
                                    "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(13, 71, 161, 0.1))",
                                  border: "1px solid rgba(3, 197, 219, 0.3)",
                                  color: "#1a365d",
                                  fontWeight: 500,
                                  mt: 0.5,
                                }}
                              />
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <ViewHistoryButton
                                startIcon={<History />}
                                onClick={() => {
                                  console.log(customer.customerName);
                                }}
                                size="small"
                              >
                                View History
                              </ViewHistoryButton>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </MotionCard>
                    ))}
                  </CustomerCardGrid>
                )}
              </AnimatePresence>
            )}
          </>
        )}
      </MotionPaper>
    </MotionContainer>
  );
};

export default ShowCustomers;

const EmptyState = () => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 8,
      px: 2,
    }}
  >
    <Person sx={{ fontSize: 80, color: "rgba(0, 0, 0, 0.2)", mb: 2 }} />
    <Typography
      variant="h5"
      sx={{
        mb: 2,
        fontWeight: 600,
        color: "#1a365d",
        textAlign: "center",
      }}
    >
      No Customers Yet
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        textAlign: "center",
        maxWidth: "500px",
        mb: 4,
      }}
    >
      When customers show interest in this product, they will appear here.
    </Typography>
  </MotionBox>
);

const BackButton = styled(Button)`
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";
  box-shadow: 0 4px 8px rgba(3, 197, 219, 0.2);

  &:hover {
    background: linear-gradient(135deg, #02b1c5, #0a3d8f);
    box-shadow: 0 6px 12px rgba(3, 197, 219, 0.3);
  }
`;

const ViewHistoryButton = styled(Button)`
  background: linear-gradient(
    135deg,
    rgba(3, 197, 219, 0.1),
    rgba(13, 71, 161, 0.1)
  );
  color: #03c5db;
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(3, 197, 219, 0.3);
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-family: "Poppins, sans-serif";

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(3, 197, 219, 0.2),
      rgba(13, 71, 161, 0.2)
    );
    border: 1px solid rgba(3, 197, 219, 0.5);
  }
`;

const CustomerCardGrid = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  width: 100%;
`;

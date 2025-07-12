// Edited

import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Badge,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import AddedToCartSection from "../components/AddedToCartSection";
import OutForDeliverySection from "../components/OutForDeliverySection";
import styled from "styled-components";

// Motion components
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

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

const tabPanelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const emptyStateVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
};

// Sample data for badge counts - in a real app, this would come from your API
const sampleCounts = {
  addedToCart: 3,
  outForDelivery: 2,
  completed: 0,
  cancelled: 0,
};

const ShowOrders = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState(sampleCounts);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <MotionPaper
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          background: "white",
          position: "relative",
          mt: 3,
          mb: 3,
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
            zIndex: 1,
          }}
        />

        <Typography
          variant="h5"
          component="h1"
          sx={{
            p: 3,
            pt: 4,
            fontWeight: 600,
            color: "#1a365d",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Order Management
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="order status tabs"
            variant={isTablet ? "scrollable" : "standard"}
            scrollButtons={isTablet ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                textTransform: "none",
                minHeight: "64px",
                fontSize: isMobile ? "0.8rem" : "0.9rem",
              },
              "& .Mui-selected": {
                color: "#03c5db",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#03c5db",
                height: "3px",
                borderRadius: "1.5px",
              },
            }}
          >
            <Tab
              label={
                <Badge
                  badgeContent={counts.addedToCart}
                  color="primary"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#03c5db",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <TabLabel>
                    <ShoppingCart
                      sx={{ mr: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    />
                    {!isMobile && "Added To Cart"}
                  </TabLabel>
                </Badge>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge
                  badgeContent={counts.outForDelivery}
                  color="primary"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#03c5db",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <TabLabel>
                    <LocalShipping
                      sx={{ mr: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    />
                    {!isMobile && "Out For Delivery"}
                  </TabLabel>
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Badge
                  badgeContent={counts.completed}
                  color="success"
                  max={99}
                  showZero
                >
                  <TabLabel>
                    <CheckCircle
                      sx={{ mr: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    />
                    {!isMobile && "Completed Orders"}
                  </TabLabel>
                </Badge>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Badge
                  badgeContent={counts.cancelled}
                  color="error"
                  max={99}
                  showZero
                >
                  <TabLabel>
                    <Cancel
                      sx={{ mr: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    />
                    {!isMobile && "Cancelled Orders"}
                  </TabLabel>
                </Badge>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          <CustomTabPanel value={value} index={0} key="panel-0">
            {loading ? <LoadingState /> : <AddedToCartSection />}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} key="panel-1">
            {loading ? <LoadingState /> : <OutForDeliverySection />}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2} key="panel-2">
            {loading ? (
              <LoadingState />
            ) : (
              <EmptyState
                icon={
                  <CheckCircle
                    sx={{ fontSize: 70, color: "rgba(76, 175, 80, 0.7)" }}
                  />
                }
                title="No Completed Orders"
                message="When orders are completed, they will appear here"
              />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3} key="panel-3">
            {loading ? (
              <LoadingState />
            ) : (
              <EmptyState
                icon={
                  <Cancel
                    sx={{ fontSize: 70, color: "rgba(244, 67, 54, 0.7)" }}
                  />
                }
                title="No Cancelled Orders"
                message="When orders are cancelled, they will appear here"
              />
            )}
          </CustomTabPanel>
        </AnimatePresence>
      </MotionPaper>
    </Container>
  );
};

export default ShowOrders;

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <MotionBox
          variants={tabPanelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          sx={{ p: 3 }}
        >
          {children}
        </MotionBox>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `order-tab-${index}`,
    "aria-controls": `order-tabpanel-${index}`,
  };
};

const LoadingState = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 8,
    }}
  >
    <CircularProgress
      size={60}
      sx={{
        color: "#03c5db",
        mb: 3,
      }}
    />
    <Typography
      variant="h6"
      sx={{
        color: "#1a365d",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Loading orders...
    </Typography>
  </Box>
);

const EmptyState = ({ icon, title, message }) => (
  <MotionBox
    variants={emptyStateVariants}
    initial="hidden"
    animate="visible"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 6,
      px: 2,
    }}
  >
    {icon}
    <Typography
      variant="h5"
      sx={{
        mt: 3,
        mb: 1,
        fontWeight: 600,
        color: "#1a365d",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {title}
    </Typography>

    
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        textAlign: "center",
        maxWidth: "400px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {message}
    </Typography>
  </MotionBox>
);

const TabLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

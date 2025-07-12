// Edited 

import { Grid, Box, Typography } from "@mui/material";
import SalesCard from "../components/SalesCard";
import SalesChart from "../components/SalesChart";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Motion components
const MotionGrid = motion(Grid);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4,
      duration: 0.5,
    },
  },
};

const SellerHomePage = ({ stats }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ padding: "16px" }}>
      <Box mb={4}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "#1a365d",
              mb: 1,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(26, 54, 93, 0.7)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Welcome back! Here's an overview of your store performance
          </Typography>
        </motion.div>
      </Box>

      <MotionGrid
        container
        spacing={3}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <MotionGrid item xs={12} sm={6} md={3} variants={itemVariants}>
          <SalesCard title="Weekly Sales" total={stats?.WeeklySales || 0} color="primary" icon={"ant-design:carry-out-filled"} />
        </MotionGrid>

        <MotionGrid item xs={12} sm={6} md={3} variants={itemVariants}>
          <SalesCard title="Feature Products" total={stats?.FeatureProducts || 0} color="success" icon={"ant-design:shopping-cart-outlined"} />
        </MotionGrid>

        <MotionGrid item xs={12} sm={6} md={3} variants={itemVariants}>
          <SalesCard title="Ongoing Orders" total={stats?.OngoingOrders || 0} color="warning" icon={"material-symbols:data-exploration"} />
        </MotionGrid>

        <MotionGrid item xs={12} sm={6} md={3} variants={itemVariants}>
          <SalesCard
            title="Cancelled Orders"
            total={stats?.CancelledOrders || 0}
            color="error"
            icon={"material-symbols:free-cancellation-rounded"}
          />
        </MotionGrid>

        <MotionGrid item xs={12} lg={6} variants={chartVariants}>
          <SalesChart type="line" stats={stats} />
        </MotionGrid>

        <MotionGrid item xs={12} lg={6} variants={chartVariants}>
          <SalesChart type="bar" stats={stats} />
        </MotionGrid>
      </MotionGrid>
    </Box>
  );
};

export default SellerHomePage;
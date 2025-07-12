// Edited
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const HeroSection = ({ scrollToProducts }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/Custom-seller/list"); // Replace with your desired route
  };

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <MotionBox
      ref={ref}
      component="section"
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #03c5db, #0d47a1)",
        color: "white",
      }}
    >
      {/* Animated background elements */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Floating circles */}
      {[...Array(10)].map((_, i) => (
        <MotionBox
          key={i}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0.1 + Math.random() * 0.2,
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            width: 20 + Math.random() * 100,
            height: 20 + Math.random() * 100,
            borderRadius: "50%",
            background: "white",
            zIndex: 1,
          }}
        />
      ))}

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <MotionBox
          style={{ y, opacity }}
          sx={{
            textAlign: "center",
            px: 2,
          }}
        >
          <MotionTypography
            variant="h1"
            component="h1"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              mb: 2,
              fontFamily: "Poppins, sans-serif",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Discover Handcrafted Beauty
          </MotionTypography>

          <MotionTypography
            variant="h5"
            component="p"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            sx={{
              fontWeight: 400,
              mb: 6,
              maxWidth: "800px",
              mx: "auto",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Explore our collection of unique, handcrafted pottery and artisanal
            products
          </MotionTypography>

          <MotionButton
            component={motion.button}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToProducts}
            endIcon={<ArrowDownward />}
            sx={{
              background: "white",
              color: "#03c5db",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              padding: "12px 32px",
              fontSize: "1.1rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                background: "white",
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Explore Products
          </MotionButton>
          <MotionButton
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigation} // Navigate to the new page
            endIcon={<ArrowUpward />}
            sx={{
              background: "white",
              color: "#03c5db",
              borderRadius: "8px",
              textTransform: "none",
              marginLeft: "14px",
              fontWeight: 600,
              padding: "12px 32px",
              fontSize: "1.1rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                background: "white",
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Custom Sellers
          </MotionButton>
        </MotionBox>
      </Container>

      {/* Scroll indicator */}
      <MotionBox
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <ArrowDownward sx={{ fontSize: 40 }} />
      </MotionBox>
    </MotionBox>
  );
};

export default HeroSection;

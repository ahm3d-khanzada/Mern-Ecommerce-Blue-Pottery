import { useState } from "react";
import axios from "axios";
import { Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const CustomizationToggle = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sellerId = storedUser?._id;
  const [isCustomizationEnabled, setIsCustomizationEnabled] = useState(
    JSON.parse(localStorage.getItem("isCustomizationEnabled")) || false
  );

  const handleToggle = async () => {
    try {
      const newStatus = !isCustomizationEnabled;
      setIsCustomizationEnabled(newStatus);
      localStorage.setItem("isCustomizationEnabled", JSON.stringify(newStatus));

      await axios.patch(
        `http://localhost:5000/CustomizationEnabling/${sellerId}`,
        {
          isCustomizationEnabled: newStatus,
        }
      );
    } catch (error) {
      console.error("Error updating customization status:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          color: "#1a365d",
        }}
      >
        Customization Settings
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: "rgba(26, 54, 93, 0.7)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Seller ID: {sellerId}
      </Typography>

      <Button
        variant="contained"
        onClick={handleToggle}
        sx={{
          background: isCustomizationEnabled
            ? "linear-gradient(135deg, #03c5db, #1a365d)"
            : "linear-gradient(135deg, #ff6b6b, #ff4757)",
          color: "white",
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": {
            opacity: 0.9,
          },
        }}
      >
        {isCustomizationEnabled
          ? "Disable Customization"
          : "Enable Customization"}
      </Button>

      <Typography
        variant="body1"
        sx={{
          mt: 2,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          color: isCustomizationEnabled ? "#03c5db" : "#ff6b6b",
        }}
      >
        Customization is {isCustomizationEnabled ? "Enabled ✅" : "Disabled ❌"}
      </Typography>
    </Box>
  );
};

export default CustomizationToggle;

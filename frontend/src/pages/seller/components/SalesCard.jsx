// Edited
import { alpha, styled } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material";
import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

// Motion components
const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Animation variants
const cardVariants = {
  hover: {
    y: -8,
    boxShadow: "0 12px 24px rgba(3, 197, 219, 0.15)",
    transition: { duration: 0.3 },
  },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      repeatDelay: 1,
    },
  },
};

const SalesCard = ({ title, total, color, icon }) => {
  // Map the color to our blue pottery theme
  const colorMap = {
    primary: { light: "#03c5db", dark: "#03c5db" },
    success: { light: "#4caf50", dark: "#2e7d32" },
    warning: { light: "#ff9800", dark: "#ed6c02" },
    error: { light: "#f44336", dark: "#d32f2f" },
  };

  const themeColor = colorMap[color] || colorMap.primary;

  return (
    <MotionCard
      variants={cardVariants}
      whileHover="hover"
      sx={{
        py: 5,
        boxShadow: "0 4px 20px rgba(3, 197, 219, 0.1)",
        textAlign: "center",
        color: "#1a365d",
        borderRadius: "16px",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 245, 250, 0.9))",
        border: "1px solid rgba(3, 197, 219, 0.1)",
        position: "relative",
        overflow: "hidden",
        height: "100%",
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
          background: `linear-gradient(90deg, ${themeColor.light}, #f0e786)`,
        }}
      />

      <MotionBox
        variants={iconVariants}
        whileHover="hover"
        initial="initial"
        sx={{
          margin: "auto",
          display: "flex",
          borderRadius: "50%",
          alignItems: "center",
          width: 64,
          height: 64,
          justifyContent: "center",
          marginBottom: 3,
          color: "white",
          backgroundImage: `linear-gradient(135deg, ${themeColor.light}, ${themeColor.dark})`,
          boxShadow: `0 8px 16px ${alpha(themeColor.light, 0.24)}`,
        }}
      >
        <Iconify icon={icon} width={32} height={32} />
      </MotionBox>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Data start={0} end={total} duration={2.5} separator="," />

        <Typography
          variant="subtitle2"
          sx={{
            opacity: 0.72,
            mt: 1,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>
      </motion.div>
    </MotionCard>
  );
};

export default SalesCard;

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

const Data = styled(CountUp)`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.2;
  letter-spacing: 0em;
  background: linear-gradient(135deg, #03c5db, #1a365d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

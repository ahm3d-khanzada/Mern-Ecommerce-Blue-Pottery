// Edited 
import { SpeedDial, SpeedDialAction, Box, useTheme, useMediaQuery } from "@mui/material"
import TuneIcon from "@mui/icons-material/Tune"
import { motion } from "framer-motion"
import styled from "styled-components"

// Motion components
const MotionSpeedDial = motion(SpeedDial)

// Animation variants
const speedDialVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 20px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
}

const SpeedDialTemplate = ({ actions }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box sx={{ position: "fixed", bottom: isMobile ? 16 : 24, right: isMobile ? 16 : 24, zIndex: 1000 }}>
      <MotionSpeedDial
        ariaLabel="Action menu"
        sx={{
          "& .MuiFab-primary": {
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
          },
        }}
        icon={<TuneIcon />}
        direction="up"
        FabProps={{
          sx: {
            bgcolor: "#03c5db",
            "&:hover": {
              bgcolor: "#02a0b3",
            },
          },
        }}
        variants={speedDialVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {actions.map((action) => (
          <StyledSpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
            FabProps={{
              sx: {
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "rgba(3, 197, 219, 0.1)",
                },
              },
            }}
            tooltipOpen={isMobile}
          />
        ))}
      </MotionSpeedDial>
    </Box>
  )
}

export default SpeedDialTemplate

const StyledSpeedDialAction = styled(SpeedDialAction)`
  .MuiSpeedDialAction-staticTooltipLabel {
    background: linear-gradient(135deg, rgba(3, 197, 219, 0.9), rgba(13, 71, 161, 0.9));
    color: white;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    padding: 6px 12px;
    min-width: 100px;
    text-align: center;
  }
  
  .MuiSpeedDialAction-fab {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 15px rgba(3, 197, 219, 0.2);
    }
  }
`


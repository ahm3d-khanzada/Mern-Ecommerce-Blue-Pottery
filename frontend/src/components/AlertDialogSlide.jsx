"use client";

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  Warning,
  DeleteForever,
  Info,
  Error,
  CheckCircle,
} from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Animation variants
const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const AlertDialogSlide = ({
  dialog,
  showDialog,
  setShowDialog,
  taskHandler,
  type = "warning",
}) => {
  const handleClose = () => {
    setShowDialog(false);
  };

  // Determine icon and colors based on dialog type
  const getDialogStyles = () => {
    switch (type) {
      case "delete":
        return {
          icon: <DeleteForever sx={{ fontSize: 40, color: "#f44336" }} />,
          color: "#f44336",
          gradient: "linear-gradient(135deg, #f44336, #e91e63)",
          buttonText: "Yes, Delete",
        };
      case "info":
        return {
          icon: <Info sx={{ fontSize: 40, color: "#03c5db" }} />,
          color: "#03c5db",
          gradient: "linear-gradient(135deg, #03c5db, #0d47a1)",
          buttonText: "Confirm",
        };
      case "success":
        return {
          icon: <CheckCircle sx={{ fontSize: 40, color: "#4caf50" }} />,
          color: "#4caf50",
          gradient: "linear-gradient(135deg, #4caf50, #8bc34a)",
          buttonText: "Continue",
        };
      case "error":
        return {
          icon: <Error sx={{ fontSize: 40, color: "#f44336" }} />,
          color: "#f44336",
          gradient: "linear-gradient(135deg, #f44336, #d32f2f)",
          buttonText: "Acknowledge",
        };
      case "warning":
      default:
        return {
          icon: <Warning sx={{ fontSize: 40, color: "#ff9800" }} />,
          color: "#ff9800",
          gradient: "linear-gradient(135deg, #ff9800, #ff5722)",
          buttonText: "Yes, Proceed",
        };
    }
  };

  const dialogStyles = getDialogStyles();

  return (
    <Dialog
      open={showDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "8px",
          maxWidth: "500px",
          width: "100%",
          overflow: "visible",
        },
      }}
    >
      <IconContainer>
        <motion.div variants={iconVariants} initial="hidden" animate="visible">
          {dialogStyles.icon}
        </motion.div>
      </IconContainer>

      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "#1a365d",
          fontFamily: "Poppins, sans-serif",
          pb: 1,
          pt: 3,
          textAlign: "center",
        }}
      >
        {dialog}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          sx={{
            color: "text.secondary",
            fontFamily: "Poppins, sans-serif",
            textAlign: "center",
          }}
        >
          You won't be able to recover it back. Please confirm your decision.
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{ display: "flex", justifyContent: "center", px: 2, pb: 3, gap: 2 }}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <ConfirmButton
            onClick={() => {
              handleClose();
              taskHandler();
            }}
            $gradient={dialogStyles.gradient}
          >
            {dialogStyles.buttonText}
          </ConfirmButton>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialogSlide;

const IconContainer = styled(Box)`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #757575;
  padding: 8px 20px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #eeeeee;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${(props) =>
    props.$gradient || "linear-gradient(135deg, #03c5db, #0d47a1)"};
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 8px rgba(3, 197, 219, 0.2);

  &:hover {
    background: ${(props) =>
      props.$gradient || "linear-gradient(135deg, #02b1c5, #0a3d8f)"};
    box-shadow: 0 6px 12px rgba(3, 197, 219, 0.3);
  }
`;

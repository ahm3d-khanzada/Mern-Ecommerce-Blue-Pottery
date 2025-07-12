// Edited
import { useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Logout,
  Person,
  Settings,
  Dashboard,
  Store,
  YouTube,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import styled from "styled-components";

// Motion components
const MotionIconButton = motion(IconButton);
const MotionMenuItem = motion(MenuItem);
const MotionAvatar = motion(Avatar);

// Animation variants
const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: "0px 5px 15px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const menuItemVariants = {
  hover: {
    backgroundColor: "rgba(3, 197, 219, 0.08)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings" arrow>
          <MotionIconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <MotionAvatar
              sx={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #03c5db, #f0e786)",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#1a365d",
              }}
            >
              {String(currentUser.name).charAt(0)}
            </MotionAvatar>
          </MotionIconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 15px rgba(0,0,0,0.15))",
            mt: 1.5,
            borderRadius: "12px",
            minWidth: "200px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              background: "linear-gradient(135deg, #03c5db, #f0e786)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center" }}>
          <MotionAvatar
            sx={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #03c5db, #f0e786)",
              color: "#1a365d",
              mr: 1.5,
            }}
          >
            {String(currentUser.name).charAt(0)}
          </MotionAvatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#1a365d",
                lineHeight: 1.2,
              }}
            >
              {currentUser.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
              }}
            >
              {currentUser.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.1)" }} />

        <MotionMenuItem
          onClick={() => handleNavigation("/Seller/dashboard")}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ListItemIcon>
            <Dashboard fontSize="small" sx={{ color: "#03c5db" }} />
          </ListItemIcon>
          <MenuItemText>Dashboard</MenuItemText>
        </MotionMenuItem>

        <MotionMenuItem
          onClick={() => handleNavigation("/Seller/profile")}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: "#03c5db" }} />
          </ListItemIcon>
          <MenuItemText>Profile</MenuItemText>
        </MotionMenuItem>

        <MotionMenuItem
          onClick={() => handleNavigation("/Seller/products")}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ListItemIcon>
            <Store fontSize="small" sx={{ color: "#03c5db" }} />
          </ListItemIcon>
          <MenuItemText>My Products</MenuItemText>
        </MotionMenuItem>
        <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.1)" }} />
        <MotionMenuItem
          onClick={() => handleNavigation("/DisplayVideo")}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ListItemIcon>
            <YouTube fontSize="small" sx={{ color: "#03c5db" }} />
          </ListItemIcon>
          <MenuItemText>Reels</MenuItemText>
        </MotionMenuItem>

        <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.1)" }} />

        <MotionMenuItem
          onClick={() => handleNavigation("/Logout")}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#f44336" }} />
          </ListItemIcon>
          <MenuItemText sx={{ color: "#f44336" }}>Logout</MenuItemText>
        </MotionMenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;

const MenuItemText = styled(Typography)`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
`;

// Edited
import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";

import WidgetsIcon from "@mui/icons-material/Widgets";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { TrackChanges } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSelector } from "react-redux";
import { ManageAccounts, UploadFile } from "@mui/icons-material";

// Motion components
const MotionListItemButton = motion(ListItemButton);
const MotionListItemIcon = motion(ListItemIcon);

// Animation variants
const listItemVariants = {
  hover: {
    backgroundColor: "rgba(3, 197, 219, 0.08)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.5 },
  },
};

const SideBar = () => {
  const location = useLocation();
  const { currentRole } = useSelector((state) => state.user);

  return (
    <>
      <React.Fragment>
        <MotionListItemButton
          component={Link}
          to="/"
          sx={
            location.pathname === "/" ||
            location.pathname === "/Seller/dashboard"
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <WidgetsIcon
              sx={{
                color:
                  location.pathname === "/" ||
                  location.pathname === "/Seller/dashboard"
                    ? "#03c5db"
                    : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight:
                location.pathname === "/" ||
                location.pathname === "/Seller/dashboard"
                  ? 600
                  : 400,
            }}
          />
        </MotionListItemButton>

        <MotionListItemButton
          component={Link}
          to="/Seller/products"
          sx={
            location.pathname.startsWith("/Seller/products")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <ShoppingCartIcon
              sx={{
                color: location.pathname.startsWith("/Seller/products")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Products"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/Seller/products")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        <MotionListItemButton
          component={Link}
          to="/Seller/orders"
          sx={
            location.pathname.startsWith("/Seller/orders")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <PendingActionsIcon
              sx={{
                color: location.pathname.startsWith("/Seller/orders")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Orders"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/Seller/orders")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        {currentRole === "Shopcart" && (
          <MotionListItemButton
            component={Link}
            to="/Seller/shopcart"
            sx={
              location.pathname.startsWith("/Seller/shopcart")
                ? styles.currentStyle
                : styles.normalStyle
            }
            whileHover="hover"
            whileTap="tap"
            variants={listItemVariants}
          >
            <MotionListItemIcon
              variants={iconVariants}
              whileHover="hover"
              initial="initial"
            >
              <AdminPanelSettingsIcon
                sx={{
                  color: location.pathname.startsWith("/Seller/shopcart")
                    ? "#03c5db"
                    : "rgba(26, 54, 93, 0.7)",
                }}
              />
            </MotionListItemIcon>
            <ListItemText
              primary="Shopcart"
              primaryTypographyProps={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: location.pathname.startsWith("/Seller/shopcart")
                  ? 600
                  : 400,
              }}
            />
          </MotionListItemButton>
        )}
      </React.Fragment>

      <StyledDivider />

      <React.Fragment>
        <MotionListItemButton
          component={Link}
          to="/Seller/custom/list"
          sx={
            location.pathname.startsWith("/Seller/custom/list")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <LocalMallIcon
              sx={{
                color: location.pathname.startsWith("/Seller/custom/list")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Custom List"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/Seller/custom/list")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.2)" }} />
        <MotionListItemButton
          component={Link}
          to="/uploadVideo"
          sx={
            location.pathname.startsWith("/uploadVideo")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <UploadFile
              sx={{
                color: location.pathname.startsWith("/uploadVideo")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Reel Upload"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/uploadVideo")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        <MotionListItemButton
          component={Link}
          to="/VideoManagement"
          sx={
            location.pathname.startsWith("/VideoManagement")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <ManageAccounts
              sx={{
                color: location.pathname.startsWith("/VideoManagement")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Reel Management"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/VideoManagement")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>
        <Divider sx={{ my: 1, borderColor: "rgba(3, 197, 219, 0.2)" }} />

        {currentRole === "admin" && (
          <MotionListItemButton
            component={Link}
            to="/Admin/Approval/list"
            sx={
              location.pathname.startsWith("/Admin/Approval/list")
                ? styles.currentStyle
                : styles.normalStyle
            }
            whileHover="hover"
            whileTap="tap"
            variants={listItemVariants}
          >
            <MotionListItemIcon
              variants={iconVariants}
              whileHover="hover"
              initial="initial"
            >
              <LocalMallIcon
                sx={{
                  color: location.pathname.startsWith("/Admin/Approval/list")
                    ? "#03c5db"
                    : "rgba(26, 54, 93, 0.7)",
                }}
              />
            </MotionListItemIcon>
            <ListItemText
              primary="Seller Approval"
              primaryTypographyProps={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: location.pathname.startsWith("/Admin/Approval/list")
                  ? 600
                  : 400,
              }}
            />
          </MotionListItemButton>
        )}

        <MotionListItemButton
          component={Link}
          to="/Order-status-Seller"
          sx={
            location.pathname.startsWith("/Order-status-Seller")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <TrackChanges
              sx={{
                color: location.pathname.startsWith("/Order-status-Seller")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Update Tracking"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/Order-status-Seller")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        <MotionListItemButton
          component={Link}
          to="/Seller/profile"
          sx={
            location.pathname.startsWith("/Seller/profile")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <AccountCircleIcon
              sx={{
                color: location.pathname.startsWith("/Seller/profile")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/Seller/profile")
                ? 600
                : 400,
            }}
          />
        </MotionListItemButton>

        <MotionListItemButton
          component={Link}
          to="/logout"
          sx={
            location.pathname.startsWith("/logout")
              ? styles.currentStyle
              : styles.normalStyle
          }
          whileHover="hover"
          whileTap="tap"
          variants={listItemVariants}
        >
          <MotionListItemIcon
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
          >
            <LogoutIcon
              sx={{
                color: location.pathname.startsWith("/logout")
                  ? "#03c5db"
                  : "rgba(26, 54, 93, 0.7)",
              }}
            />
          </MotionListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname.startsWith("/logout") ? 600 : 400,
            }}
          />
        </MotionListItemButton>
      </React.Fragment>
    </>
  );
};

export default SideBar;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
  background: linear-gradient(
    90deg,
    rgba(3, 197, 219, 0.2),
    rgba(240, 231, 134, 0.2)
  );
  height: 1px;
`;

const styles = {
  normalStyle: {
    color: "rgba(26, 54, 93, 0.7)",
    backgroundColor: "transparent",
    borderRadius: "8px",
    margin: "4px 8px",
    transition: "all 0.3s ease",
  },
  currentStyle: {
    color: "#03c5db",
    backgroundColor: "rgba(3, 197, 219, 0.08)",
    borderRadius: "8px",
    margin: "4px 8px",
    transition: "all 0.3s ease",
  },
};

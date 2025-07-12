import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Email, Person, Store, CalendarToday } from "@mui/icons-material";
import CustomizationToggle from "../components/CustomizationToggle"; // Import the toggle component

// Motion components
const MotionPaper = motion(Paper);
const MotionAvatar = motion(Avatar);
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
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

const avatarVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 20px rgba(3, 197, 219, 0.5)",
    transition: {
      duration: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.4,
    },
  },
  hover: {
    y: -5,
    boxShadow: "0px 10px 30px rgba(3, 197, 219, 0.2)",
    transition: {
      duration: 0.3,
    },
  },
};

const SellerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data for demonstration
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { label: "Products", value: "24" },
    { label: "Orders", value: "156" },
    { label: "Revenue", value: "$4,320" },
    { label: "Rating", value: "4.8/5" },
  ];

  return (
    <ProfileContainer>
      <MotionPaper
        elevation={0}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          background: "transparent",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {/* Header Section with Background */}
        <HeaderSection>
          <MotionBox
            variants={itemVariants}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(3, 197, 219, 0.8), rgba(240, 231, 134, 0.8))",
              zIndex: 0,
            }}
          />

          {/* Profile Info */}
          <ProfileInfo>
            <MotionAvatar
              variants={avatarVariants}
              whileHover="hover"
              sx={{
                width: isMobile ? 100 : 140,
                height: isMobile ? 100 : 140,
                fontSize: isMobile ? "3rem" : "4rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #fff, #f0f0f0)",
                color: "#03c5db",
                border: "4px solid white",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              }}
            >
              {currentUser ? currentUser.name[0].toUpperCase() : ""}
            </MotionAvatar>

            <MotionBox
              variants={itemVariants}
              sx={{ zIndex: 1, textAlign: "center" }}
            >
              <MotionTypography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: "white",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  mb: 1,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {currentUser ? currentUser.name : ""}
              </MotionTypography>

              <MotionTypography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                }}
              >
                {currentUser ? currentUser.role : ""} Account
              </MotionTypography>
            </MotionBox>
          </ProfileInfo>
        </HeaderSection>

        {/* Details Section */}
        <DetailsSection>
          <Grid container spacing={3}>
            {/* Profile Details Card */}
            <Grid item xs={12} md={6}>
              <MotionCard
                variants={cardVariants}
                whileHover="hover"
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
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
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <MotionTypography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "#1a365d",
                    }}
                  >
                    Account Information
                  </MotionTypography>

                  <InfoItem>
                    <Person sx={{ color: "#03c5db", mr: 2 }} />
                    <InfoLabel>Full Name:</InfoLabel>
                    <InfoValue>{currentUser ? currentUser.name : ""}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <Email sx={{ color: "#03c5db", mr: 2 }} />
                    <InfoLabel>Email:</InfoLabel>
                    <InfoValue>
                      {currentUser ? currentUser.email : ""}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <Store sx={{ color: "#03c5db", mr: 2 }} />
                    <InfoLabel>Role:</InfoLabel>
                    <InfoValue>{currentUser ? currentUser.role : ""}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <CalendarToday sx={{ color: "#03c5db", mr: 2 }} />
                    <InfoLabel>Joined:</InfoLabel>
                    <InfoValue>{joinDate}</InfoValue>
                  </InfoItem>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Stats Card */}
            <Grid item xs={12} md={6}>
              <MotionCard
                variants={cardVariants}
                whileHover="hover"
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
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
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <MotionTypography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "#1a365d",
                    }}
                  >
                    Store Statistics
                  </MotionTypography>

                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <MotionBox
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.6 + index * 0.1,
                            duration: 0.3,
                          }}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            borderRadius: "8px",
                            background:
                              "linear-gradient(135deg, rgba(3, 197, 219, 0.05), rgba(240, 231, 134, 0.05))",
                            border: "1px solid rgba(3, 197, 219, 0.1)",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              background:
                                "linear-gradient(135deg, #03c5db, #1a365d)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              mb: 1,
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(26, 54, 93, 0.7)",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </MotionBox>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>

          {/* Customization Toggle Section */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <MotionCard
              variants={cardVariants}
              whileHover="hover"
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                position: "relative",
                overflow: "hidden",
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
                }}
              />

              <CardContent sx={{ p: 3 }}>
                <CustomizationToggle />
              </CardContent>
            </MotionCard>
          </Grid>
        </DetailsSection>
      </MotionPaper>
    </ProfileContainer>
  );
};

export default SellerProfile;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const HeaderSection = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  width: 100%;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
`;

const ProfileInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const DetailsSection = styled(Box)`
  padding: 24px;
  background: white;
  border-radius: 0 0 16px 16px;
  width: 100%;
`;

const InfoItem = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(3, 197, 219, 0.1);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const InfoLabel = styled(Typography)`
  font-weight: 600;
  color: #1a365d;
  margin-right: 8px;
  font-family: "Poppins", sans-serif;
  min-width: 80px;
`;

const InfoValue = styled(Typography)`
  color: rgba(26, 54, 93, 0.8);
  font-family: "Poppins", sans-serif;
`;

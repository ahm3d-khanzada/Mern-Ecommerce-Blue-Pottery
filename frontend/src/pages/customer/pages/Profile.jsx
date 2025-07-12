"use client"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Paper, Typography, Avatar, Container, Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import ShippingPage from "../components/ShippingPage"

const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 20px",
  background: "linear-gradient(135deg, #0077b6, #00a8cc)",
  minHeight: "100vh",
  justifyContent: "center",
}))

const ProfileHeader = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "30px 20px",
  backgroundColor: "#e3f2fd",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  width: "90%",
  maxWidth: "500px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
  },
}))

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: "100px",
  height: "100px",
  background: "linear-gradient(135deg, #005f73, #0a9396)",
  color: "white",
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "20px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  border: "4px solid white",
}))

const ProfileName = styled(Typography)(({ theme }) => ({
  padding: "10px",
  fontWeight: "bold",
  color: "#023047",
  fontSize: "28px",
  position: "relative",
  marginBottom: "5px",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "40px",
    height: "3px",
    backgroundColor: "#0077b6",
    borderRadius: "2px",
  },
}))

const ProfileText = styled(Typography)(({ theme }) => ({
  margin: "8px 0",
  color: "#333",
  fontStyle: "italic",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& strong": {
    marginRight: "5px",
    color: "#0077b6",
  },
}))

const ShippingContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

const ShippingPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(6),
  padding: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
}))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <ProfileContainer>
        <motion.div variants={itemVariants}>
          <ProfileHeader elevation={3}>
            <ProfileAvatar>{currentUser ? currentUser.name[0].toUpperCase() : ""}</ProfileAvatar>
            <ProfileName variant="h4">{currentUser ? currentUser.name : ""}</ProfileName>
            <ProfileText variant="h6">
              <strong>Email:</strong> {currentUser ? currentUser.email : ""}
            </ProfileText>
            <ProfileText variant="h6">
              <strong>Role:</strong> {currentUser ? currentUser.role : ""}
            </ProfileText>
          </ProfileHeader>
        </motion.div>
      </ProfileContainer>

      <ShippingContainer component="main" maxWidth="sm">
        <motion.div variants={itemVariants}>
          <ShippingPaper variant="outlined">
            <ShippingPage profile="Profile" />
          </ShippingPaper>
        </motion.div>
      </ShippingContainer>
    </motion.div>
  )
}

export default Profile

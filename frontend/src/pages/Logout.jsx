// Edited
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { authLogout } from "../redux/userSlice"
import styled from "styled-components"
import { updateCustomer } from "../redux/userHandle"
import { motion, AnimatePresence } from "framer-motion"
import { Box, Typography, Button, Container, Paper, Avatar, useMediaQuery, useTheme, IconButton } from "@mui/material"
import { ArrowBack, ExitToApp, LockOpen, Home } from "@mui/icons-material"

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
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
}

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
}

const Logout = () => {
  const { currentUser, currentRole } = useSelector((state) => state.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentRole === "Customer") {
      dispatch(updateCustomer(currentUser, currentUser._id))
    }
  }, [currentRole, currentUser, dispatch])

  const handleLogout = () => {
    setIsLoggingOut(true)

    // Simulate logout process with animation
    setTimeout(() => {
      setShowConfetti(true)

      setTimeout(() => {
        dispatch(authLogout())
        navigate("/")
      }, 1500)
    }, 1000)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(240, 231, 134, 0.1))",
        position: "relative",
        overflow: "hidden",
        padding: isMobile ? "16px" : "32px",
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(3, 197, 219, 0.2), rgba(240, 231, 134, 0.2))",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(240, 231, 134, 0.2), rgba(3, 197, 219, 0.2))",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="logout-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            width: "100%",
            maxWidth: "500px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div variants={cardVariants}>
            <LogoutCard elevation={8}>
              {/* Top decorative pattern */}
              <DecorativePattern />

              <motion.div variants={itemVariants}>
                <AvatarContainer>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <StyledAvatar>
                      {currentUser && currentUser.name ? String(currentUser.name).charAt(0) : "U"}
                    </StyledAvatar>
                  </motion.div>
                </AvatarContainer>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #03c5db, #f0e786)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    fontSize: isMobile ? "1.75rem" : "2.25rem",
                  }}
                >
                  {currentUser && currentUser.name ? currentUser.name : "User"}
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: "#555",
                    mb: 4,
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    maxWidth: "80%",
                    mx: "auto",
                  }}
                >
                  Are you sure you want to log out of your Blue Pottery account?
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <ButtonContainer>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <LogoutButtonLogout
                      onClick={handleLogout}
                      startIcon={isLoggingOut ? null : <ExitToApp />}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <motion.div
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              style={{ marginRight: "8px" }}
                            >
                              <LockOpen fontSize="small" />
                            </motion.div>
                            Logging out...
                          </Box>
                        </motion.div>
                      ) : (
                        "Log Out"
                      )}
                    </LogoutButtonLogout>
                  </motion.div>

                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <LogoutButtonCancel onClick={handleCancel} startIcon={<ArrowBack />} disabled={isLoggingOut}>
                      Cancel
                    </LogoutButtonCancel>
                  </motion.div>
                </ButtonContainer>
              </motion.div>

              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              >
                <Box
                  component="img"
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64CB509D-8C31-43D7-A7A5-C3232663B9F1-removebg-preview-susrl2AOxsVi9jGY4kXu0RSBFFMkbA.png"
                  alt="Blue Pottery Logo"
                  sx={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
                  }}
                />
              </motion.div>

              {/* Home button */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={() => navigate("/")}
                  sx={{
                    color: "#03c5db",
                    background: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Home />
                </IconButton>
              </motion.div>
            </LogoutCard>
          </motion.div>

          {/* Confetti effect when logging out */}
          {showConfetti && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: -100,
                    x: Math.random() * window.innerWidth,
                    opacity: 1,
                    rotate: 0,
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    width: Math.random() * 15 + 5,
                    height: Math.random() * 15 + 5,
                    borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                    background: i % 2 === 0 ? "#03c5db" : "#f0e786",
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                />
              ))}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  )
}

export default Logout

const LogoutCard = styled(Paper)`
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 24px;
  position: relative;
  overflow: visible;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 600px) {
    padding: 40px 24px;
  }
`

const DecorativePattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(135deg, #03c5db, #f0e786);
  border-radius: 24px 24px 0 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    right: 0;
    height: 40px;
    background: repeating-linear-gradient(
      90deg,
      rgba(3, 197, 219, 0.1),
      rgba(3, 197, 219, 0.1) 15px,
      rgba(240, 231, 134, 0.1) 15px,
      rgba(240, 231, 134, 0.1) 30px
    );
  }
`

const AvatarContainer = styled(Box)`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
`

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #03c5db, #f0e786);
  box-shadow: 0 8px 30px rgba(3, 197, 219, 0.3);
  color: #1a365d;
  border: 4px solid white;
  
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
`

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
`

const LogoutButtonLogout = styled(Button)`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  color: white;
  background: linear-gradient(135deg, #f44336, #ff9800);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #d32f2f, #f57c00);
  }
  
  &.Mui-disabled {
    background: linear-gradient(135deg, #f44336, #ff9800);
    opacity: 0.7;
    color: white;
  }
`

const LogoutButtonCancel = styled(Button)`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  color: white;
  background: linear-gradient(135deg, #03c5db, #f0e786);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #02b1c5, #e8df6d);
  }
  
  &.Mui-disabled {
    background: linear-gradient(135deg, #03c5db, #f0e786);
    opacity: 0.7;
    color: white;
  }
`


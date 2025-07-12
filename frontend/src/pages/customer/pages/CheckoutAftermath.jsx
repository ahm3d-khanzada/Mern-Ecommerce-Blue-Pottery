import { useEffect } from "react"
import { motion } from "framer-motion"
import { Container, Paper, Typography, Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import { LightPurpleButton } from "../../../utils/buttonStyles"
import { KeyboardDoubleArrowLeft, CheckCircle } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"

const StyledContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(5),
  },
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(to bottom right, #ffffff, #f5f9ff)",
}))

const SuccessIcon = styled(Box)(({ theme }) => ({
  margin: "0 auto 24px",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #4ade80, #22c55e)",
  boxShadow: "0 8px 16px rgba(34, 197, 94, 0.3)",
}))

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: "#111827",
}))

const Subtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#4b5563",
  maxWidth: "500px",
  margin: "0 auto 32px",
}))

const StyledButton = styled(LightPurpleButton)(({ theme }) => ({
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}))

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const CheckoutAftermath = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Trigger confetti effect when component mounts
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <StyledContainer component="main" maxWidth="sm">
        <StyledPaper variant="outlined">
          <motion.div variants={itemVariants}>
            <SuccessIcon>
              <CheckCircle sx={{ fontSize: 48, color: "white" }} />
            </SuccessIcon>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Title variant="h4">Thank you for your order!</Title>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Subtitle variant="subtitle1">
              Your order has been successfully placed. We have emailed your order confirmation, and will send you an
              update when your order has shipped.
            </Subtitle>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <StyledButton onClick={() => navigate("/")} startIcon={<KeyboardDoubleArrowLeft />}>
              Back to Home
            </StyledButton>
          </motion.div>
        </StyledPaper>
      </StyledContainer>
    </motion.div>
  )
}

export default CheckoutAftermath

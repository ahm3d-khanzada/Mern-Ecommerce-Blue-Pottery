"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import { ShoppingBag, LocalShipping, Payment } from "@mui/icons-material"

import ShippingPage from "../components/ShippingPage"
import PaymentForm from "../components/PaymentForm"
import OrderSummary from "../components/OrderSummary"

const steps = ["Shipping address", "Review your order", "Payment details"]
const stepIcons = [<LocalShipping key="shipping" />, <ShoppingBag key="shoppingbag" />, <Payment key="payment" />]

const StyledContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #2196F3, #21CBF3)",
  },
}))

const StyledStepper = styled(Stepper)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(5),
  "& .MuiStepLabel-root": {
    "& .MuiStepLabel-label": {
      fontWeight: 500,
      "&.Mui-active": {
        fontWeight: 700,
        color: theme.palette.primary.main,
      },
      "&.Mui-completed": {
        fontWeight: 500,
        color: theme.palette.success.main,
      },
    },
  },
  "& .MuiStepIcon-root": {
    width: "35px",
    height: "35px",
    transition: "all 0.3s ease",
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: theme.palette.primary.main,
    filter: "drop-shadow(0 0 3px rgba(33, 150, 243, 0.5))",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: theme.palette.success.main,
  },
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.divider,
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.success.main,
  },
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 700,
  textAlign: "center",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "3px",
    background: "linear-gradient(90deg, #2196F3, #21CBF3)",
    borderRadius: "2px",
  },
}))

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
}

const CheckoutSteps = () => {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    window.scrollTo(0, 0)
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <StyledContainer component="main" maxWidth="sm">
        <StyledPaper variant="outlined">
          <StyledTypography component="h1" variant="h4">
            Checkout
          </StyledTypography>
          <StyledStepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={() => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: activeStep === index ? 1.1 : 1,
                        opacity: 1,
                        color: activeStep === index ? "#2196F3" : activeStep > index ? "#4caf50" : "#bdbdbd",
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {stepIcons[index]}
                    </motion.div>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </StyledStepper>
          <motion.div key={activeStep} initial="hidden" animate="visible" exit="exit" variants={stepVariants}>
            {activeStep === 0 && <ShippingPage handleNext={handleNext} />}
            {activeStep === 1 && <OrderSummary handleNext={handleNext} handleBack={handleBack} />}
            {activeStep === 2 && <PaymentForm handleBack={handleBack} />}
          </motion.div>
        </StyledPaper>
      </StyledContainer>
    </motion.div>
  )
}

export default CheckoutSteps

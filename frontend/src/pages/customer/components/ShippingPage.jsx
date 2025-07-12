"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { Box, Button, Collapse, Stack, styled } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { updateCustomer } from "../../../redux/userHandle"
import { KeyboardArrowDown, KeyboardArrowUp, LocationOn, Phone, Home } from "@mui/icons-material"
import { BlueButton, GreenButton } from "../../../utils/buttonStyles"
import { useNavigate } from "react-router-dom"

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: "12px 0",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: "rgba(0, 119, 182, 0.05)",
  border: "1px solid rgba(0, 119, 182, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 119, 182, 0.1)",
    transform: "translateX(5px)",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  },
}))

const FormContainer = styled(Box)(({ theme }) => ({
  padding: "24px",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
}

const ShippingPage = ({ handleNext, profile }) => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const shippingData = currentUser.shippingData

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phoneNo: "",
  })

  const [errors, setErrors] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phoneNo: "",
  })

  const [showTab, setShowTab] = useState(false)
  const buttonText = showTab ? "Cancel" : "Edit"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateInputs = () => {
    const newErrors = {}
    let isValid = true

    if (formData.address.trim() === "") {
      newErrors.address = "Address is required"
      isValid = false
    }

    if (formData.city.trim() === "") {
      newErrors.city = "City is required"
      isValid = false
    }

    if (formData.state.trim() === "") {
      newErrors.state = "State is required"
      isValid = false
    }

    if (formData.country.trim() === "") {
      newErrors.country = "Country is required"
      isValid = false
    }

    if (formData.pinCode.trim() === "") {
      newErrors.pinCode = "Pin Code is required"
      isValid = false
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Pin Code should be a 6-digit number"
      isValid = false
    }

    if (formData.phoneNo.trim() === "") {
      newErrors.phoneNo = "Phone Number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Phone Number should be a 10-digit number"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [country, setCountry] = useState("")
  const [state, setState] = useState("")
  const [phoneNo, setPhoneNo] = useState("")

  const [pinCodeError, setPinCodeError] = useState(false)
  const [phoneNoError, setPhoneNoError] = useState(false)

  useEffect(() => {
    if (shippingData) {
      setAddress(shippingData.address || "")
      setCity(shippingData.city || "")
      setPinCode(shippingData.pinCode || "")
      setCountry(shippingData.country || "")
      setState(shippingData.state || "")
      setPhoneNo(shippingData.phoneNo || "")
    }
  }, [shippingData])

  useEffect(() => {
    // Initialize form data from current user when component mounts
    if (shippingData) {
      setFormData({
        address: shippingData.address || "",
        city: shippingData.city || "",
        state: shippingData.state || "",
        country: shippingData.country || "",
        pinCode: shippingData.pinCode || "",
        phoneNo: shippingData.phoneNo || "",
      })
    }
  }, [shippingData])

  const updateShippingData = (shippingData) => {
    const updatedUser = { ...currentUser, shippingData: shippingData }
    dispatch(updateCustomer(updatedUser, currentUser._id))
  }

  const handleSubmit = () => {
    if (validateInputs()) {
      updateShippingData(formData)
      handleNext()
    }
  }

  const profileSubmitHandler = () => {
    if (validateInputs()) {
      updateShippingData(formData)
    }
  }

  const editHandler = (event) => {
    event.preventDefault()

    let hasError = false

    if (isNaN(pinCode) || pinCode.length !== 6) {
      setPinCodeError(true)
      hasError = true
    } else {
      setPinCodeError(false)
    }

    if (isNaN(phoneNo) || phoneNo.length !== 10) {
      setPhoneNoError(true)
      hasError = true
    } else {
      setPhoneNoError(false)
    }

    if (!address.trim()) {
      hasError = true
    }

    if (!city.trim()) {
      hasError = true
    }

    if (!state.trim()) {
      hasError = true
    }

    if (!country.trim()) {
      hasError = true
    }

    if (!hasError) {
      const fields = { address, city, state, country, pinCode, phoneNo }
      updateShippingData(fields)
      setShowTab(false)
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {shippingData && Object.keys(shippingData).length > 0 ? (
        <React.Fragment>
          <motion.div variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <StyledTypography variant="h6">
                <Home color="primary" /> {shippingData && shippingData.address}
              </StyledTypography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StyledTypography variant="h6">
                <LocationOn color="primary" /> {shippingData && shippingData.city}, {shippingData && shippingData.state}
                , {shippingData && shippingData.country}, {shippingData && shippingData.pinCode}
              </StyledTypography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StyledTypography variant="h6">
                <Phone color="primary" /> {shippingData && shippingData.phoneNo}
              </StyledTypography>
            </motion.div>

            {profile ? (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton
                    variant="contained"
                    onClick={() => setShowTab(!showTab)}
                    startIcon={showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  >
                    {buttonText}
                  </ActionButton>
                </motion.div>
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <GreenButton onClick={() => navigate("/profile")}>Change</GreenButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton variant="contained" onClick={handleNext}>
                    Next
                  </ActionButton>
                </motion.div>
              </Box>
            )}

            <AnimatePresence>
              {showTab && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Collapse in={showTab} timeout="auto">
                    <Box sx={{ mt: 3 }}>
                      <FormContainer>
                        <form onSubmit={editHandler}>
                          <Stack spacing={3}>
                            <StyledTextField
                              fullWidth
                              label="Address"
                              value={address}
                              onChange={(event) => setAddress(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <StyledTextField
                              fullWidth
                              label="City"
                              value={city}
                              onChange={(event) => setCity(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <StyledTextField
                              fullWidth
                              label="Zip / Postal code"
                              type="number"
                              value={pinCode}
                              error={pinCodeError}
                              helperText={pinCodeError && "Pin Code should be a 6-digit number"}
                              onChange={(event) => setPinCode(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <StyledTextField
                              fullWidth
                              label="Country"
                              value={country}
                              onChange={(event) => setCountry(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <StyledTextField
                              fullWidth
                              label="State/Province/Region"
                              value={state}
                              onChange={(event) => setState(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <StyledTextField
                              fullWidth
                              label="Phone number"
                              type="number"
                              value={phoneNo}
                              error={phoneNoError}
                              helperText={phoneNoError && "Phone Number should be a 10-digit number"}
                              onChange={(event) => setPhoneNo(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Stack>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <BlueButton fullWidth size="large" sx={{ mt: 3 }} variant="contained" type="submit">
                              Update
                            </BlueButton>
                          </motion.div>
                        </form>
                      </FormContainer>
                    </Box>
                  </Collapse>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Shipping address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  autoComplete="shipping address-line1"
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="shipping address-level2"
                  variant="outlined"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="pinCode"
                  name="pinCode"
                  label="Zip / Postal code"
                  type="number"
                  fullWidth
                  autoComplete="shipping postal-code"
                  variant="outlined"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  error={!!errors.pinCode}
                  helperText={errors.pinCode}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  autoComplete="shipping country"
                  variant="outlined"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={!!errors.country}
                  helperText={errors.country}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  id="state"
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  variant="outlined"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  required
                  id="phoneNo"
                  name="phoneNo"
                  label="Phone number"
                  type="number"
                  fullWidth
                  autoComplete="shipping Phone-number"
                  variant="outlined"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                />
              </motion.div>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            {profile ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ActionButton variant="contained" onClick={profileSubmitHandler}>
                  Submit
                </ActionButton>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ActionButton variant="contained" onClick={handleSubmit}>
                  Next
                </ActionButton>
              </motion.div>
            )}
          </Box>
        </React.Fragment>
      )}
    </motion.div>
  )
}

export default ShippingPage

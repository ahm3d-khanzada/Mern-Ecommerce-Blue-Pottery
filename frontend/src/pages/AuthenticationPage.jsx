// Edited
import { useEffect, useState, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
} from "@mui/icons-material";
import { authUser } from "../redux/userHandle";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as THREE from "three";

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
    transition: { duration: 0.5 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.03,
    boxShadow: "0px 5px 15px rgba(3, 197, 219, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.98 },
};

// 3D Vase Model Component
const BlueVase = ({ setLoaded }) => {
  const vaseRef = useRef();
  const texture = useLoader(
    TextureLoader,
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64CB509D-8C31-43D7-A7A5-C3232663B9F1-removebg-preview-susrl2AOxsVi9jGY4kXu0RSBFFMkbA.png"
  );

  // Create a custom material with the blue pottery texture
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.3,
    metalness: 0.1,
  });

  useEffect(() => {
    if (texture) {
      setLoaded(true);
    }
  }, [texture, setLoaded]);

  useFrame((state) => {
    if (vaseRef.current) {
      vaseRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group>
      <mesh ref={vaseRef} material={material} castShadow receiveShadow>
        <cylinderGeometry
          args={[0.7, 0.5, 2.5, 32, 1, false, 0, Math.PI * 2]}
        />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
};

// Fallback loading component for 3D scene
const LoadingFallback = () => (
  <Html center>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      <CircularProgress color="inherit" size={40} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading 3D Vase...
      </Typography>
    </Box>
  </Html>
);

// Main Authentication Component
const AuthenticationPage = ({ mode: initialMode, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [vaseLoaded, setVaseLoaded] = useState(false);

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [shopNameError, setShopNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "ForgotPassword") {
      // Handle forgot password logic
      if (!resetEmail) {
        setEmailError(true);
        return;
      }
      setLoader(true);
      // Simulate email sending
      setTimeout(() => {
        setResetEmailSent(true);
        setLoader(false);
        setMessage("Reset email sent successfully!");
        setShowPopup(true);
      }, 1500);
      return;
    }

    if (mode === "ResetPassword") {
      // Handle reset password logic
      if (!resetCode || !newPassword || !confirmPassword) {
        setMessage("All fields are required");
        setShowPopup(true);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordsMatch(false);
        return;
      }

      setLoader(true);
      // Simulate password reset
      setTimeout(() => {
        setLoader(false);
        setMessage("Password reset successfully!");
        setShowPopup(true);
        setMode("Login");
      }, 1500);
      return;
    }

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    if (mode === "Register") {
      const name = event.target.userName.value;

      if (!name) {
        if (!name) setUserNameError(true);
        return;
      }

      if (role === "Seller") {
        const shopName = event.target.shopName.value;

        if (!shopName) {
          if (!shopName) setShopNameError(true);
          return;
        }

        const sellerFields = { name, email, password, role, shopName };
        dispatch(authUser(sellerFields, role, mode));
      } else {
        const customerFields = { name, email, password, role };
        dispatch(authUser(customerFields, role, mode));
      }
    } else if (mode === "Login") {
      const fields = { email, password };
      dispatch(authUser(fields, role, mode));
    }
    setLoader(true);
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "userName") setUserNameError(false);
    if (name === "shopName") setShopNameError(false);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (confirmPassword) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(newPassword === e.target.value);
  };

  useEffect(() => {
    if (status === "success" && currentRole !== null) {
      navigate("/");
    } else if (status === "failed") {
      setMessage(
        response?.message || error?.message || "An unexpected error occurred"
      );
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage(
        error?.response?.data?.message || error?.message || "Network Error"
      );
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  // Render different forms based on mode
  const renderForm = () => {
    switch (mode) {
      case "ForgotPassword":
        return (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <motion.div variants={itemVariants}>
              <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setEmailError(false);
                }}
                error={emailError}
                helperText={emailError && "Email is required"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#03c5db" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledButton
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </StyledButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <BackButton
                startIcon={<ArrowBack />}
                onClick={() => setMode("Login")}
              >
                Back to Login
              </BackButton>
            </motion.div>
          </Box>
        );

      case "ResetPassword":
        return (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <motion.div variants={itemVariants}>
              <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
                Enter the code sent to your email and create a new password.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="resetCode"
                label="Reset Code"
                name="resetCode"
                variant="outlined"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type={toggle ? "text" : "password"}
                id="newPassword"
                variant="outlined"
                value={newPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={toggle ? "text" : "password"}
                id="confirmPassword"
                variant="outlined"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!passwordsMatch}
                helperText={!passwordsMatch && "Passwords do not match"}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledButton
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </StyledButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <BackButton
                startIcon={<ArrowBack />}
                onClick={() => setMode("Login")}
              >
                Back to Login
              </BackButton>
            </motion.div>
          </Box>
        );

      case "Login":
        return (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordError && "Password is required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <StyledFormControlLabel
                  control={<StyledCheckbox value="remember" />}
                  label="Remember me"
                />
                <ForgotPasswordLink onClick={() => setMode("ForgotPassword")}>
                  Forgot password?
                </ForgotPasswordLink>
              </Grid>
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledButton
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </StyledButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Don't have an account?
                  </Typography>
                </Grid>
                <Grid item>
                  <StyledLink onClick={() => setMode("Register")}>
                    Sign up
                  </StyledLink>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        );

      case "Register":
        return (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Enter your name"
                name="userName"
                autoComplete="name"
                autoFocus
                variant="outlined"
                error={userNameError}
                helperText={userNameError && "Name is required"}
                onChange={handleInputChange}
              />
            </motion.div>

            {role === "Seller" && (
              <motion.div variants={itemVariants}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="shopName"
                  label="Create your shop name"
                  name="shopName"
                  autoComplete="off"
                  variant="outlined"
                  error={shopNameError}
                  helperText={shopNameError && "Shop name is required"}
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordError && "Password is required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StyledButton
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </StyledButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Already have an account?
                  </Typography>
                </Grid>
                <Grid item>
                  <StyledLink onClick={() => setMode("Login")}>
                    Log in
                  </StyledLink>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        );

      default:
        return null;
    }
  };

  // Popup component for notifications
  const Popup = ({ message, showPopup, setShowPopup }) => {
    const handleClose = () => {
      setShowPopup(false);
      if (resetEmailSent && mode === "ForgotPassword") {
        setMode("ResetPassword");
      }
    };

    return (
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <Alert
              severity={message.includes("successfully") ? "success" : "error"}
              onClose={handleClose}
              sx={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                background: message.includes("successfully")
                  ? "linear-gradient(135deg, #03c5db, #4caf50)"
                  : "linear-gradient(135deg, #f44336, #ff9800)",
                color: "white",
                "& .MuiAlert-icon": {
                  color: "white",
                },
              }}
            >
              {message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa, #e4e8f0)",
        position: "relative",
      }}
    >
      <CssBaseline />

      {/* 3D Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity: vaseLoaded ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={<LoadingFallback />}>
            <BlueVase setLoaded={setVaseLoaded} />
            <Environment preset="city" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
      </Box>

      {/* Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "450px",
          zIndex: 1,
          padding: "0 16px",
        }}
      >
        <Card
          elevation={8}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "6px",
              background: "linear-gradient(135deg, #03c5db, #f0e786)",
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                style={{ textAlign: "center" }}
              >
                <Box
                  component="img"
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64CB509D-8C31-43D7-A7A5-C3232663B9F1-removebg-preview-susrl2AOxsVi9jGY4kXu0RSBFFMkbA.png"
                  alt="Blue Pottery Logo"
                  sx={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    mb: 2,
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                  }}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{ textAlign: "center", marginBottom: "24px" }}
              >
                <StyledTypography>
                  {mode === "ForgotPassword"
                    ? "Forgot Password"
                    : mode === "ResetPassword"
                    ? "Reset Password"
                    : `${role} ${mode}`}
                </StyledTypography>

                <StyledSubtitle variant="body1">
                  {mode === "ForgotPassword"
                    ? "Recover your account access"
                    : mode === "ResetPassword"
                    ? "Create a new password"
                    : mode === "Login"
                    ? "Welcome back! Please enter your details"
                    : role === "Seller"
                    ? "Create your own shop by registering as a seller"
                    : "Register now to explore and buy products"}
                </StyledSubtitle>
              </motion.div>

              {renderForm()}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Branding Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          zIndex: 1,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "rgba(0,0,0,0.6)",
            fontWeight: 500,
            textShadow: "0 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          © {new Date().getFullYear()} Blue Pottery • Handcrafted with care
        </Typography>
      </Box>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default AuthenticationPage;

// Styled components with the blue pottery theme
const StyledLink = styled.span`
  text-decoration: none;
  color: #03c5db;
  font-weight: 500;
  cursor: pointer;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(135deg, #03c5db, #f0e786);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const ForgotPasswordLink = styled.span`
  text-decoration: none;
  color: #03c5db;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #02a0b3;
    text-decoration: underline;
  }
`;

const StyledTypography = styled.h4`
  margin: 0;
  font-weight: 600;
  font-size: 2.25rem;
  line-height: 1.2;
  letter-spacing: 0.00735em;
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  text-align: center;
`;

const StyledSubtitle = styled(Typography)`
  text-align: center;
  color: #666;
  font-size: 1rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;

  & .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #03c5db;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #03c5db;
      border-width: 2px;
    }
  }

  & .MuiInputLabel-root.Mui-focused {
    color: #03c5db;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(3, 197, 219, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #02b1c5, #0a3d8f);
    box-shadow: 0 6px 15px rgba(3, 197, 219, 0.3);
  }
`;

const BackButton = styled(Button)`
  color: #666;
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;

  &:hover {
    background-color: rgba(3, 197, 219, 0.08);
  }
`;

const StyledCheckbox = styled(Checkbox)`
  color: #03c5db;

  &.Mui-checked {
    color: #03c5db;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  & .MuiFormControlLabel-label {
    color: #666;
    font-size: 0.875rem;
  }
`;

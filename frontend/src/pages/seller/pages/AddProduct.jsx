import { useEffect, useState, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import Popup from "../../../components/Popup";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userHandle";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  AddPhotoAlternate,
  Title,
  Description,
  AttachMoney,
  LocalOffer,
  Category,
  Bookmark,
  ShortText,
  CloudUpload,
  Delete,
  Info,
  LocalShipping,
  Inventory,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

// Sample categories for blue pottery
const potteryCategories = [
  "Vases",
  "Plates",
  "Bowls",
  "Cups & Mugs",
  "Decorative Items",
  "Wall Hangings",
  "Planters",
  "Lamps & Lighting",
  "Tableware Sets",
].filter(Boolean); // Remove empty strings

// Sample subcategories
const potterySubcategories = {
  Vases: ["Flower Vases", "Decorative Vases", "Floor Vases", "Mini Vases"],
  Plates: ["Dinner Plates", "Dessert Plates", "Wall Plates", "Serving Plates"],
  Bowls: ["Soup Bowls", "Serving Bowls", "Decorative Bowls", "Fruit Bowls"],
  "Cups & Mugs": ["Coffee Mugs", "Tea Cups", "Espresso Cups", "Travel Mugs"],
  "Decorative Items": [
    "Figurines",
    "Sculptures",
    "Ornaments",
    "Candle Holders",
  ],
  "Wall Hangings": [
    "Wall Plates",
    "Tile Art",
    "Framed Pottery",
    "Decorative Panels",
  ],
  Planters: [
    "Indoor Planters",
    "Outdoor Planters",
    "Hanging Planters",
    "Succulent Planters",
  ],
  "Lamps & Lighting": [
    "Table Lamps",
    "Floor Lamps",
    "Pendant Lights",
    "Candle Holders",
  ],
  "Tableware Sets": ["Dinner Sets", "Tea Sets", "Serving Sets", "Mixed Sets"],
};

const defaultPotteryImages = [
  "/images/bluepottery/bp1.jpg",
  "/images/bluepottery/bp2.jpg",
  "/images/bluepottery/bp3.jpg",
  "/images/bluepottery/bp4.jpg",
  "/images/bluepottery/bp5.jpg",
  "/images/bluepottery/bp6.jpg",
].filter(Boolean); // Remove empty strings

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

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

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(3, 197, 219, 0.2)",
    transition: {
      duration: 0.3,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 15px rgba(3, 197, 219, 0.3)",
    transition: {
      duration: 0.3,
    },
  },
  tap: { scale: 0.95 },
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { currentUser, status, response, error } = useSelector(
    (state) => state.user
  );

  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [isHandmade, setIsHandmade] = useState(true);
  const [isInStock, setIsInStock] = useState(true);
  const [inventoryQuantity, setInventoryQuantity] = useState("100"); // New field for inventory quantity
  const seller = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [showSampleImages, setShowSampleImages] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState("99"); // New field for shipping cost

  // Add new state variables for specifications
  const [color, setColor] = useState("Blue");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("Ceramic");

  // Set a random default blue pottery image
  const [defaultImage] = useState(
    defaultPotteryImages[
      Math.floor(Math.random() * defaultPotteryImages.length)
    ]
  );

  // Update subcategories when category changes
  useEffect(() => {
    if (category && potterySubcategories[category]) {
      setAvailableSubcategories(potterySubcategories[category]);
      // Reset subcategory if the current one isn't valid for the new category
      if (
        subcategory &&
        !potterySubcategories[category].includes(subcategory)
      ) {
        setSubcategory("");
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [category, subcategory]);

  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    category,
    description,
    tagline,
    seller,
    isHandmade,
    isInStock,
    quantity: Number.parseInt(inventoryQuantity, 10), // Add inventory quantity
    shipping_cost: freeShipping ? 0 : Number.parseInt(shippingCost, 10), // Add shipping cost
    color,
    dimensions,
    material,
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // Validate form
    if (
      Number.parseFloat(mrp) < 0 ||
      Number.parseFloat(cost) < 0 ||
      Number.parseFloat(discountPercent) < 0 ||
      Number.parseFloat(discountPercent) > 100 ||
      Number.parseFloat(mrp) < Number.parseFloat(cost) ||
      Number.parseInt(inventoryQuantity) < 0 ||
      (!freeShipping && Number.parseInt(shippingCost) < 0)
    ) {
      setMessage("Please correct the errors in the form");
      setShowPopup(true);
      return;
    }

    setLoader(true);
    console.log(fields);
    dispatch(addStuff("ProductCreate", fields));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, response, error]);

  // Reset preview loaded state when image URL changes
  useEffect(() => {
    setPreviewLoaded(false);
  }, [productImage]);

  const handleImageLoad = () => {
    setPreviewLoaded(true);
  };

  const handleImageError = () => {
    setPreviewLoaded(true); // Still mark as loaded to remove spinner
  };

  // Handle sample image selection
  const selectSampleImage = (imageUrl) => {
    setProductImage(imageUrl);
    setShowSampleImages(false);
  };

  // Dropzone for drag and drop image upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a local URL for the file
      const localUrl = URL.createObjectURL(file);

      // Set the image URL and mark as loaded
      setProductImage(localUrl);
      setPreviewLoaded(true);

      // In a real implementation with backend, you would do:
      // const formData = new FormData();
      // formData.append('file', file);
      // fetch('/api/upload', { method: 'POST', body: formData })
      //   .then(response => {
      //     setProductImage(data.url);
      //     setPreviewLoaded(true);
      //   });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  return (
    <AnimatePresence>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <MotionCard
          variants={itemVariants}
          sx={{
            maxWidth: 1000,
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* Decorative top bar */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #03c5db, #f0e786)",
              borderRadius: "16px 16px 0 0",
            }}
          />

          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "#1a365d",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Add New Blue Pottery Product
            </Typography>

            <Grid container spacing={4}>
              {/* Image Preview Section */}
              <Grid item xs={12} md={4}>
                <MotionBox
                  variants={itemVariants}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 500,
                      color: "#1a365d",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Product Image Preview
                  </Typography>

                  {/* Drag & Drop Zone */}
                  <MotionPaper
                    {...getRootProps()}
                    variants={imageVariants}
                    whileHover="hover"
                    sx={{
                      width: "100%",
                      height: 200,
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: isDragActive
                        ? "linear-gradient(135deg, rgba(3, 197, 219, 0.1), rgba(240, 231, 134, 0.1))"
                        : "linear-gradient(135deg, rgba(3, 197, 219, 0.05), rgba(240, 231, 134, 0.05))",
                      border: isDragActive
                        ? "2px dashed #03c5db"
                        : "1px solid rgba(3, 197, 219, 0.1)",
                      mb: 2,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <input {...getInputProps()} />

                    {!previewLoaded && productImage && (
                      <CircularProgress
                        size={40}
                        sx={{
                          position: "absolute",
                          color: "#03c5db",
                        }}
                      />
                    )}

                    {isDragActive ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          color: "#03c5db",
                        }}
                      >
                        <CloudUpload sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2">
                          Drop the image here...
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <ProductImage
                          src={productImage || defaultImage}
                          alt="Product Preview"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          style={{
                            opacity: previewLoaded || !productImage ? 1 : 0,
                            transition: "opacity 0.3s ease",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />

                        {!productImage && (
                          <Box
                            sx={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              padding: "10px",
                              borderRadius: "8px",
                            }}
                          >
                            <CloudUpload
                              sx={{ fontSize: 30, color: "#03c5db", mb: 1 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ textAlign: "center" }}
                            >
                              Drag & drop an image
                              <br />
                              or click to browse
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </MotionPaper>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      width: "100%",
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setShowSampleImages(!showSampleImages)}
                      sx={{
                        borderColor: "#03c5db",
                        color: "#03c5db",
                        "&:hover": {
                          borderColor: "#03c5db",
                          backgroundColor: "rgba(3, 197, 219, 0.05)",
                        },
                      }}
                    >
                      {showSampleImages ? "Hide Samples" : "Sample Images"}
                    </Button>

                    {productImage && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => setProductImage("")}
                        startIcon={<Delete />}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>

                  {/* Sample Images Gallery */}
                  {showSampleImages && (
                    <Box
                      sx={{
                        width: "100%",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 1,
                          color: "rgba(26, 54, 93, 0.7)",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Click to select a sample image:
                      </Typography>

                      <Grid container spacing={1}>
                        // Render sample images with unique keys
                        {defaultPotteryImages.map((img, index) => (
                          <Grid item xs={6} key={img || `img-${index}`}>
                            <Box
                              component={motion.div}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              sx={{
                                height: 80,
                                borderRadius: "8px",
                                overflow: "hidden",
                                cursor: "pointer",
                                border:
                                  productImage === img
                                    ? "2px solid #03c5db"
                                    : "1px solid rgba(0,0,0,0.1)",
                              }}
                              onClick={() => selectSampleImage(img)}
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Sample ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color: "rgba(26, 54, 93, 0.6)",
                      textAlign: "center",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Drag & drop an image, select a sample, or enter a URL
                  </Typography>
                </MotionBox>
              </Grid>

              {/* Form Section */}
              <Grid item xs={12} md={8}>
                <form onSubmit={submitHandler}>
                  <Stack spacing={3}>
                    <MotionBox variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        label="Product Image URL"
                        value={productImage}
                        onChange={(event) =>
                          setProductImage(event.target.value)
                        }
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddPhotoAlternate sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Enter URL or use drag & drop above"
                      />
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        label="Product Name"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Title sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="e.g. Blue Pottery Handcrafted Vase"
                      />
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ alignSelf: "flex-start", mt: 1.5 }}
                            >
                              <Description sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Describe your blue pottery product in detail..."
                      />
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="MRP"
                            value={mrp}
                            onChange={(event) => setMrp(event.target.value)}
                            required
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoney sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                            }}
                            error={
                              mrp < 0 ||
                              (cost &&
                                Number.parseFloat(mrp) <
                                  Number.parseFloat(cost))
                            }
                            helperText={
                              mrp < 0
                                ? "MRP cannot be negative"
                                : cost &&
                                  Number.parseFloat(mrp) <
                                    Number.parseFloat(cost)
                                ? "MRP should be greater than cost"
                                : ""
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="Cost"
                            value={cost}
                            onChange={(event) => setCost(event.target.value)}
                            required
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoney sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                            }}
                            error={cost < 0}
                            helperText={
                              cost < 0 ? "Cost cannot be negative" : ""
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="Discount %"
                            value={discountPercent}
                            onChange={(event) =>
                              setDiscountPercent(event.target.value)
                            }
                            required
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalOffer sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            error={discountPercent < 0 || discountPercent > 100}
                            helperText={
                              discountPercent < 0
                                ? "Discount cannot be negative"
                                : discountPercent > 100
                                ? "Discount cannot exceed 100%"
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            select
                            label="Category"
                            value={category}
                            onChange={(event) =>
                              setCategory(event.target.value)
                            }
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Category sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                            }}
                            error={category === ""}
                            helperText={
                              category === "" && "Please select a category"
                            }
                          >
                            // Render MenuItems with fallback keys
                            {potteryCategories.map((option, index) => (
                              <MenuItem
                                key={option || `cat-${index}`}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </StyledTextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            select
                            label="Subcategory"
                            value={subcategory}
                            onChange={(event) =>
                              setSubcategory(event.target.value)
                            }
                            required
                            disabled={!category}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Bookmark sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                            }}
                            error={category && subcategory === ""}
                            helperText={
                              category
                                ? subcategory === ""
                                  ? "Please select a subcategory"
                                  : ""
                                : "Select a category first"
                            }
                          >
                            {availableSubcategories.map((option, index) => (
                              <MenuItem
                                key={option || `subcat-${index}`}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </StyledTextField>
                        </Grid>
                      </Grid>
                    </MotionBox>

                    {/* Inventory and Shipping Section */}
                    <MotionBox variants={itemVariants}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            label="Inventory Quantity"
                            value={inventoryQuantity}
                            onChange={(event) =>
                              setInventoryQuantity(event.target.value)
                            }
                            required
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Inventory sx={{ color: "#03c5db" }} />
                                </InputAdornment>
                              ),
                            }}
                            error={inventoryQuantity < 0}
                            helperText={
                              inventoryQuantity < 0
                                ? "Quantity cannot be negative"
                                : ""
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={freeShipping}
                                  onChange={(e) =>
                                    setFreeShipping(e.target.checked)
                                  }
                                  sx={{
                                    color: "#03c5db",
                                    "&.Mui-checked": {
                                      color: "#03c5db",
                                    },
                                  }}
                                />
                              }
                              label="Free Shipping"
                            />

                            {!freeShipping && (
                              <StyledTextField
                                fullWidth
                                label="Shipping Cost"
                                value={shippingCost}
                                onChange={(event) =>
                                  setShippingCost(event.target.value)
                                }
                                required
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LocalShipping
                                        sx={{ color: "#03c5db" }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                error={shippingCost < 0}
                                helperText={
                                  shippingCost < 0
                                    ? "Shipping cost cannot be negative"
                                    : ""
                                }
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          mt: 2,
                          color: "#1a365d",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Product Specifications
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="Color"
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="e.g. Blue, Red, Green"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="Dimensions"
                            value={dimensions}
                            onChange={(event) =>
                              setDimensions(event.target.value)
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="e.g. 10x5x3 inches"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            label="Material"
                            value={material}
                            onChange={(event) =>
                              setMaterial(event.target.value)
                            }
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="e.g. Ceramic, Clay, Porcelain"
                          />
                        </Grid>
                      </Grid>
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        label="Tagline"
                        value={tagline}
                        onChange={(event) => setTagline(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ShortText sx={{ color: "#03c5db" }} />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="e.g. Handcrafted with traditional Jaipur techniques"
                      />
                    </MotionBox>

                    {/* Product Options Checkboxes */}
                    <MotionBox
                      variants={itemVariants}
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isHandmade}
                            onChange={(e) => setIsHandmade(e.target.checked)}
                            sx={{
                              color: "#03c5db",
                              "&.Mui-checked": {
                                color: "#03c5db",
                              },
                            }}
                          />
                        }
                        label="Handmade"
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isInStock}
                            onChange={(e) => setIsInStock(e.target.checked)}
                            sx={{
                              color: "#03c5db",
                              "&.Mui-checked": {
                                color: "#03c5db",
                              },
                            }}
                          />
                        }
                        label="In Stock"
                      />

                      <Tooltip title="When enabled, shipping will be free for customers">
                        <IconButton
                          size="small"
                          sx={{ color: "rgba(0,0,0,0.5)" }}
                        >
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </MotionBox>

                    <StyledMotionButton
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={loader}
                    >
                      {loader ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress
                            size={24}
                            sx={{ color: "white", mr: 1 }}
                          />
                          <span>Adding Product...</span>
                        </Box>
                      ) : (
                        "Add Blue Pottery Product"
                      )}
                    </StyledMotionButton>
                  </Stack>
                </form>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>
      </MotionBox>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </AnimatePresence>
  );
};

export default AddProduct;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 8px;

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

  & .MuiInputLabel-root {
    font-family: "Poppins", sans-serif;
  }

  & .MuiInputBase-input {
    font-family: "Poppins", sans-serif;
  }
`;

const StyledMotionButton = styled(motion.button)`
  background: linear-gradient(135deg, #03c5db, #0d47a1);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 10px rgba(3, 197, 219, 0.2);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

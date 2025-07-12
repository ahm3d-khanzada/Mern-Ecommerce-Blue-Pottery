// Edited
import {
  Box,
  Typography,
  Grid,
  Chip,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { motion } from "framer-motion";

// Motion components
const MotionBox = motion(Box);

// Update the ProductsFilter component to pass filter values back to parent component
const ProductsFilter = ({
  categories,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  productOptions,
  setProductOptions,
  ratingFilter,
  setRatingFilter,
}) => {
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleOptionChange = (option, checked) => {
    setProductOptions({
      ...productOptions,
      [option]: checked,
    });
  };

  const handleRatingChange = (rating, checked) => {
    setRatingFilter({
      ...ratingFilter,
      [rating]: checked,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setCategoryFilter(category)}
              variant={categoryFilter === category ? "filled" : "outlined"}
              sx={{
                borderColor: "#03c5db",
                color: categoryFilter === category ? "white" : "#03c5db",
                backgroundColor:
                  categoryFilter === category ? "#03c5db" : "transparent",
                "&:hover": {
                  backgroundColor:
                    categoryFilter === category
                      ? "#02b1c5"
                      : "rgba(3, 197, 219, 0.05)",
                },
              }}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={500}
            sx={{
              color: "#03c5db",
              "& .MuiSlider-thumb": {
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0px 0px 0px 8px rgba(3, 197, 219, 0.16)",
                },
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2">${priceRange[0]}</Typography>
            <Typography variant="body2">${priceRange[1]}</Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product Options
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={productOptions.inStock}
                onChange={(e) =>
                  handleOptionChange("inStock", e.target.checked)
                }
                sx={{
                  color: "#03c5db",
                  "&.Mui-checked": {
                    color: "#03c5db",
                  },
                }}
              />
            }
            label="In Stock Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={productOptions.freeShipping}
                onChange={(e) =>
                  handleOptionChange("freeShipping", e.target.checked)
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
          <FormControlLabel
            control={
              <Checkbox
                checked={productOptions.handmade}
                onChange={(e) =>
                  handleOptionChange("handmade", e.target.checked)
                }
                sx={{
                  color: "#03c5db",
                  "&.Mui-checked": {
                    color: "#03c5db",
                  },
                }}
              />
            }
            label="Handmade Only"
          />
        </FormGroup>
      </Grid>

      <Grid item xs={12} md={3}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Ratings
        </Typography>
        <FormGroup>
          {[5, 4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={ratingFilter[rating]}
                  onChange={(e) => handleRatingChange(rating, e.target.checked)}
                  sx={{
                    color: "#03c5db",
                    "&.Mui-checked": {
                      color: "#03c5db",
                    },
                  }}
                />
              }
              label={`${rating} Stars & Above`}
            />
          ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default ProductsFilter;

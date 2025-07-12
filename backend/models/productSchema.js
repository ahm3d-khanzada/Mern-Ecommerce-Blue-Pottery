const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      mrp: {
        type: Number,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      discountPercent: {
        type: Number,
        default: 0,
      },
    },
    subcategory: {
      type: String,
    },
    productImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 100,
    },
    // New fields for product status
    isInStock: {
      type: Boolean,
      default: true,
    },
    isHandmade: {
      type: Boolean,
      default: true,
    },
    // Shipping cost field (0 for free shipping)
    shipping_cost: {
      type: Number,
      default: 0,
    },
    // Product specifications as key-value pairs
    specifications: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    // Default specifications
    color: {
      type: String,
      default: "Blue",
    },
    dimensions: {
      type: String,
    },
    material: {
      type: String,
      default: "Ceramic",
    },
    reviews: [
      {
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("product", productSchema)


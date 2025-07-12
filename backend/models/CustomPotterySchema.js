const mongoose = require("mongoose");

const CustomPotterySchema = new mongoose.Schema(
  {
    image: { type: String },
    description: { type: String, required: true },
    userEmail: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    status: {
      type: String,
      enum: ["pending", "priced", "rejected"],
      default: "pending",
    },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomPottery", CustomPotterySchema);

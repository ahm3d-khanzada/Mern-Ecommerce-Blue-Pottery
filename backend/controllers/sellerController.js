const bcrypt = require("bcrypt");
const Seller = require("../models/sellerSchema.js");
const Order = require("../models/orderSchema.js");
const Product = require("../models/productSchema.js");
const { createNewToken } = require("../utils/token.js");

const sellerRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const seller = new Seller({
      ...req.body,
      password: hashedPass,
    });

    const existingSellerByEmail = await Seller.findOne({
      email: req.body.email,
    });
    const existingShop = await Seller.findOne({ shopName: req.body.shopName });

    if (existingSellerByEmail) {
      res.send({ message: "Email already exists" });
    } else if (existingShop) {
      res.send({ message: "Shop name already exists" });
    } else {
      let result = await seller.save();
      result.password = undefined;

      const token = createNewToken(result._id);

      result = {
        ...result._doc,
        token: token,
      };

      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const sellerLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    let seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).send({ message: "User not found" });
    }

    const validated = await bcrypt.compare(password, seller.password);
    if (!validated) {
      return res.status(401).send({ message: "Invalid password" });
    }

    if (!seller.Approval_Status) {
      return res
        .status(403)
        .send({ message: "Admin didn't approve your account yet" });
    }

    const token = createNewToken(seller._id);

    seller.password = undefined;
    seller = {
      ...seller._doc,
      token,
    };

    res.send(seller);
  } catch (error) {
    console.error("Error in seller login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const sellerStats = async (req, res) => {
  try {
    const sellerId = req.params.id; // Extract seller ID from URL
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Get Weekly Sales (Last 7 Days) - Orders where seller's product was sold
    const weeklySales = await Order.countDocuments({
      "orderedProducts.seller": sellerId, // Match seller ID inside the array
      createdAt: {
        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    });

    // Get Ongoing and Cancelled Orders for this Seller
    const ongoingOrders = await Order.countDocuments({
      "orderedProducts.seller": sellerId,
      orderStatus: "Processing",
    });

    const cancelledOrders = await Order.countDocuments({
      "orderedProducts.seller": sellerId,
      orderStatus: "Cancelled",
    });

    const featureProducts = await Product.countDocuments({
      seller: sellerId,
    });

    const stats = {
      WeeklySales: weeklySales,
      OngoingOrders: ongoingOrders,
      FeatureProducts: featureProducts,
      CancelledOrders: cancelledOrders,
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Sellers = async (req, res) => {
  try {
    const vendors = await Seller.find({ Approval_Status: false }); // Filtering sellers with isApproved = false
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approved = async (req, res) => {
  try {
    const vendor = await Seller.findByIdAndUpdate(
      req.params.id,
      { Approval_Status: true },
      { new: true }
    );
    res.json({ message: "Vendor approved successfully", vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const UpdateCustomization = async (req, res) => {
  try {
    const { isCustomizationEnabled } = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      { isCustomizationEnabled },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({
      message: "Customization status updated successfully",
      updatedSeller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sellerRegister,
  sellerLogIn,
  Sellers,
  approved,
  UpdateCustomization,
  sellerStats,
};

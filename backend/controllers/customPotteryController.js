const CustomPottery = require("../models/CustomPotterySchema.js");
const Order = require("../models/orderSchema.js");
const Seller = require("../models/sellerSchema.js");
//const nodemailer = require("nodemailer");
// Submit customization request
const customize = async (req, res) => {
  try {
    const { image, description, userEmail, vendorId } = req.body;

    const pottery = new CustomPottery({
      image,
      description,
      userEmail,
      vendorId,
    });

    await pottery.save();
    res.status(201).json({ message: "Customization request sent!", pottery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const CustomizedEnabled = async (req, res) => {
  try {
    const Customvendors = await Seller.find({ isCustomizationEnabled: true });
    res.json(Customvendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const CustomOrders = async (req, res) => {
  try {
    const Customorder = await CustomPottery.find({ status: "pending" });
    res.json(Customorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, price, vendorId } = req.body;
    const pottery = await CustomPottery.findById(req.params.id);
    if (!pottery)
      return res.status(404).json({ message: "Custom Pottery not found" });
    const vendor = await Seller.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (status === "priced" && (!price || price <= 0)) {
      return res
        .status(400)
        .json({ message: "Price is required for approval" });
    }

    pottery.status = status;
    pottery.price = status === "priced" ? price : 0;
    pottery.vendorId = vendorId;
    await pottery.save();

    res.json({
      message: `Order ${
        status === "priced" ? "approved with price" : "rejected"
      }`,
      pottery,
      updatedBy: vendor.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const CustomPricedOrders = async (req, res) => {
  try {
    const Custompricedorder = await CustomPottery.find({ status: "priced" });
    res.json(Custompricedorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Email Notification Function
// const sendEmailNotification = (userEmail, status, price) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "your-email@gmail.com",
//       pass: "your-email-password",
//     },
//   });

//   const subject = status === "priced" ? "Your Customization Request is Approved" : "Your Customization Request is Rejected";
//   const message = status === "priced"
//     ? `Your request has been approved with a price of $${price}. Please proceed with checkout.`
//     : "Unfortunately, your request has been rejected.";

//   const mailOptions = {
//     from: "your-email@gmail.com",
//     to: userEmail,
//     subject: subject,
//     text: message,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) console.log(error);
//     else console.log("Email sent: " + info.response);
//   });
// };

module.exports = {
  customize,
  CustomizedEnabled,
  updateStatus,
  CustomOrders,
  CustomPricedOrders,
};

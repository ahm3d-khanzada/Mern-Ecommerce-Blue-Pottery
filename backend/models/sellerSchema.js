const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Seller"
    },
    shopName: {
        type: String,
        unique: true,
        required: true
    },
    Approval_Status: {
        type: Boolean,
        default: false,
    },
    isCustomizationEnabled: 
    {   type: Boolean,
        default: false 
},


});

module.exports = mongoose.model("seller", sellerSchema)
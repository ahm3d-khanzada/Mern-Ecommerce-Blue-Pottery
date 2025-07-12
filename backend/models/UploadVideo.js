const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoHash: {
        type: String,
        required: true // IPFS hash of the uploaded video
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UploadVideo", videoSchema);

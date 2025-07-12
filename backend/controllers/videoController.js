const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Video = require("../models/UploadVideo");
const IpfsService = require("../services/services");

// Define the uploads directory path
const uploadsDir = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the folder if it doesn't exist
  console.log("Uploads directory created:", uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Append a timestamp to the filename
  },
});

const upload = multer({ storage });

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File saved at:", req.file.path); // Log the file path for debugging

    const { title, description, sellerId } = req.body;
    if (!title || !sellerId) {
      fs.unlinkSync(req.file.path); // Delete the file if required fields are missing
      return res.status(400).json({ message: "Title and Seller ID are required" });
    }

    // Upload video to IPFS using IpfsService
    const ipfsHash = await IpfsService.uploadFileToIpfs(req.file.path, req.file.originalname);

    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    // Store video metadata in MongoDB
    const newVideo = new Video({
      title,
      description,
      videoHash: ipfsHash,
      sellerId,
    });
    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      ipfsHash,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file) fs.unlinkSync(req.file.path); // Delete the file if an error occurs
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const DisplayVideo = async (req, res) => {
  try {
      const videos = await Video.find().populate("sellerId", "shopName");

      const responseVideos = videos.map(video => ({
          _id: video._id,
          title: video.title,
          description: video.description,
          videoHash: video.videoHash,
          sellerShopName: video.sellerId ? video.sellerId.shopName : "Unknown Seller",
          likes: video.likes,
          createdAt: video.createdAt
      }));

      res.json(responseVideos);
  } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Error fetching videos", error });
  }
};

const DisplayUserVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const videos = await Video.find({ sellerId : userId }); // Fetch videos uploaded by the user
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};

// Delete a video uploaded by a specific user
const DeleteUserVideo = async (req, res) => {
  try {
    const { userId, videoId } = req.params; // User ID and video ID

    if (!userId || !videoId) return res.status(400).json({ message: "User ID and Video ID are required" });

    const video = await Video.findOne({ _id: videoId, sellerId: userId });

    if (!video) return res.status(404).json({ message: "Video not found or not owned by user" });

    await Video.findByIdAndDelete(videoId);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error });
  }
};

// Update a video uploaded by a specific user
const UpdateUserVideo = async (req, res) => {
  try {
    const { userId, videoId, title, description } = req.body; // User ID, video ID, and updated fields

    if (!userId || !videoId) return res.status(400).json({ message: "User ID and Video ID are required" });

    const video = await Video.findOne({ _id: videoId, sellerId: userId });

    if (!video) return res.status(404).json({ message: "Video not found or not owned by user" });

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { title, description },
      { new: true } // Return updated document
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error });
  }
};

const LikeVideo = async (req, res) => {
  try {
    const { id } = req.params; // Video ID
    const { userId } = req.body; // User ID (customer or seller)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const hasLiked = video.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike: Remove user ID from `likedBy`
      video.likedBy = video.likedBy.filter((user) => user.toString() !== userId);
    } else {
      // Like: Add user ID to `likedBy`
      video.likedBy.push(userId);
    }

    // Update like count
    video.likes = video.likedBy.length;
    await video.save();

    res.json({ 
      message: hasLiked ? "Like removed" : "Like added", 
      likes: video.likes,
      likedBy: video.likedBy,
    });


  } catch (error) {
    res.status(500).json({ message: "Error updating likes", error });
  }
};





module.exports = {
  upload,
  uploadVideo,
  DisplayVideo,
  LikeVideo,
  DeleteUserVideo,
  UpdateUserVideo,
  DisplayUserVideo
};
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Film,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from "react-feather";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sellerId = storedUser?._id;

  useEffect(() => {
    // Load previously uploaded videos from localStorage if available
    const savedVideos = localStorage.getItem("uploadedVideos");
    if (savedVideos) {
      setUploadedVideos(JSON.parse(savedVideos));
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        setVideo(selectedFile);
        setVideoPreview(URL.createObjectURL(selectedFile));
      } else {
        showNotification("Please select a valid video file", "error");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setVideo(droppedFile);
        setVideoPreview(URL.createObjectURL(droppedFile));
      } else {
        showNotification("Please drop a valid video file", "error");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video || !title.trim()) {
      showNotification("Please provide a title and select a video", "error");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sellerId", sellerId);

    try {
      setIsUploading(true);
      setProgress(0);

      const response = await axios.post(
        "http://localhost:5000/video/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      // Handle successful upload
      const newVideo = response.data;
      const updatedVideos = [...uploadedVideos, newVideo];
      setUploadedVideos(updatedVideos);

      // Save to localStorage
      localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos));

      showNotification("Video uploaded successfully!", "success");
      resetForm();
    } catch (error) {
      console.error("Upload Error:", error);
      showNotification(
        error.response?.data?.message || "Upload failed. Please try again.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideo(null);
    setVideoPreview(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateHash = (hash) => {
    if (!hash) return "";
    return hash.length > 12
      ? `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`
      : hash;
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Upload Video</h2>
        <p>Share your videos with the world</p>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
          <button
            className="close-notification"
            onClick={() => setNotification({ ...notification, show: false })}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="upload-content">
        <div className="upload-form-container">
          <form onSubmit={handleUpload} className="upload-form">
            <div
              className={`drop-area ${dragActive ? "active" : ""} ${
                videoPreview ? "has-preview" : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {videoPreview ? (
                <div className="video-preview-container">
                  <video
                    className="video-preview"
                    controls
                    src={videoPreview}
                  ></video>
                  <button
                    type="button"
                    className="remove-preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideo(null);
                      setVideoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="drop-content">
                  <Upload size={40} className="upload-icon" />
                  <h3>Drag & Drop your video here</h3>
                  <p>or click to browse files</p>
                  <span className="file-types">
                    Supported formats: MP4, WebM, MOV
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="file-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Video Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your video"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video (optional)"
                className="form-textarea"
                rows={4}
              />
            </div>

            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  <span>Uploading: {progress}%</span>
                  {progress === 100 && (
                    <span className="processing">Processing video...</span>
                  )}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="upload-button"
                disabled={isUploading || !video}
              >
                {isUploading ? (
                  <span className="uploading">
                    <Clock size={16} className="loading-icon" />
                    Uploading...
                  </span>
                ) : (
                  <span>
                    <Upload size={16} />
                    Upload Video
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="upload-history">
          <div
            className="history-header"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="history-title">
              <Film size={18} />
              <h3>Upload History</h3>
            </div>
            <button className="toggle-history">
              {showHistory ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {showHistory && (
            <div className="history-content">
              {uploadedVideos.length === 0 ? (
                <div className="empty-history">
                  <FileText size={32} />
                  <p>No videos uploaded yet</p>
                </div>
              ) : (
                <div className="history-list">
                  {uploadedVideos.map((video, index) => (
                    <div key={index} className="history-item">
                      <div className="history-item-content">
                        <h4>{video.title}</h4>
                        <p className="history-description">
                          {video.description || "No description"}
                        </p>
                        <div className="history-meta">
                          <span className="history-date">
                            {video.createdAt
                              ? formatDate(video.createdAt)
                              : "Recently uploaded"}
                          </span>
                          <a
                            href={`https://ipfs.io/ipfs/${video.videoHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="history-link"
                          >
                            {truncateHash(video.videoHash)}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .upload-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .upload-header h2 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #262626;
        }

        .upload-header p {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          animation: slideIn 0.3s ease;
          position: relative;
        }

        .notification.success {
          background-color: #e3f8e7;
          color: #1e7c34;
        }

        .notification.error {
          background-color: #fde8e8;
          color: #e02424;
        }

        .close-notification {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          padding: 0;
          color: inherit;
          opacity: 0.7;
        }

        .close-notification:hover {
          opacity: 1;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .upload-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 992px) {
          .upload-content {
            grid-template-columns: 3fr 2fr;
          }
        }

        .upload-form-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .upload-form {
          padding: 24px;
        }

        .drop-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 24px;
          background-color: #f9f9f9;
          position: relative;
        }

        .drop-area:hover {
          border-color: #0095f6;
          background-color: #f0f9ff;
        }

        .drop-area.active {
          border-color: #0095f6;
          background-color: #e6f7ff;
        }

        .drop-area.has-preview {
          padding: 0;
          border: none;
          background: none;
        }

        .drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          color: #0095f6;
          margin-bottom: 8px;
        }

        .drop-area h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .drop-area p {
          margin: 0;
          color: #666;
        }

        .file-types {
          font-size: 12px;
          color: #888;
          margin-top: 8px;
        }

        .file-input {
          display: none;
        }

        .video-preview-container {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }

        .video-preview {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          background-color: black;
          display: block;
        }

        .remove-preview {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .remove-preview:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0095f6;
          box-shadow: 0 0 0 2px rgba(0, 149, 246, 0.2);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .progress-container {
          margin-bottom: 24px;
        }

        .progress-bar {
          height: 8px;
          background-color: #eee;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background-color: #0095f6;
          transition: width 0.3s ease;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #666;
        }

        .processing {
          color: #0095f6;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-button,
        .upload-button {
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .cancel-button {
          background-color: white;
          color: #666;
          border: 1px solid #ddd;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .upload-button {
          background-color: #0095f6;
          color: white;
          border: none;
        }

        .upload-button:hover:not(:disabled) {
          background-color: #0077c5;
        }

        .upload-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .uploading {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading-icon {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .upload-history {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .history-header {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-title h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .toggle-history {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .history-content {
          max-height: 500px;
          overflow-y: auto;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #888;
          text-align: center;
        }

        .empty-history p {
          margin-top: 12px;
        }

        .history-list {
          padding: 0;
        }

        .history-item {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          transition: background-color 0.2s ease;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-item:hover {
          background-color: #f9f9f9;
        }

        .history-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .history-description {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .history-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #888;
        }

        .history-link {
          color: #0095f6;
          text-decoration: none;
          font-family: monospace;
        }

        .history-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .upload-header h2 {
            font-size: 24px;
          }

          .drop-area {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-button,
          .upload-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoUpload;

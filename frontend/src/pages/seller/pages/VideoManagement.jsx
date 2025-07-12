"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash, AlertCircle, CheckCircle, Film, Upload, Search, X, Eye } from "react-feather"

const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [updatedTitle, setUpdatedTitle] = useState("")
  const [updatedDescription, setUpdatedDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [previewVideo, setPreviewVideo] = useState(null)

  // Get stored user data
  const storedUser = JSON.parse(localStorage.getItem("user"))
  const userId = storedUser?._id

  useEffect(() => {
    if (userId) {
      fetchVideos()
    } else {
      console.error("User ID is missing.")
      setLoading(false)
    }
  }, [userId])

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await axios.post("http://localhost:5000/video/User", { userId })
      setVideos(response.data)
    } catch (error) {
      console.error("Error fetching videos:", error)
      showNotification("Failed to load videos. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(`http://localhost:5000/video/Remove/${userId}/${videoId}`)

      // Update the state by filtering out the deleted video
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId))
      showNotification("Video deleted successfully", "success")
      setConfirmDelete(null)
    } catch (error) {
      console.error("Error deleting video:", error.response?.data || error.message)
      showNotification("Failed to delete video. Please try again.", "error")
    }
  }

  // Open modal for editing
  const openEditModal = (video) => {
    setEditingVideo(video)
    setUpdatedTitle(video.title)
    setUpdatedDescription(video.description)
    setModalVisible(true)
  }

  // Update video details
  const updateVideo = async () => {
    try {
      if (!updatedTitle.trim()) {
        showNotification("Title cannot be empty", "error")
        return
      }

      const response = await axios.put("http://localhost:5000/video/Update", {
        userId,
        videoId: editingVideo._id,
        title: updatedTitle,
        description: updatedDescription,
      })

      setVideos(videos.map((video) => (video._id === editingVideo._id ? response.data : video)))

      setModalVisible(false)
      showNotification("Video updated successfully", "success")
    } catch (error) {
      console.error("Error updating video:", error)
      showNotification("Failed to update video. Please try again.", "error")
    }
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="video-management">
      <div className="management-header">
        <h2>My Videos</h2>
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your videos...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="empty-state">
          <Film size={48} />
          <h3>No videos found</h3>
          {searchTerm ? (
            <p>No videos match your search. Try different keywords or clear your search.</p>
          ) : (
            <div>
              <p>You haven't uploaded any videos yet.</p>
              <a href="/upload" className="upload-link">
                <Upload size={16} />
                Upload your first video
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail" onClick={() => setPreviewVideo(video)}>
                <video className="thumbnail-video">
                  <source src={`https://ipfs.io/ipfs/${video.videoHash}`} type="video/mp4" />
                </video>
                <div className="play-overlay">
                  <Eye size={24} />
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
              </div>
              <div className="video-actions">
                <button className="action-button edit" onClick={() => openEditModal(video)}>
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="action-button delete" onClick={() => setConfirmDelete(video._id)}>
                  <Trash size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Video</h3>
              <button className="close-button" onClick={() => setModalVisible(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Enter video description"
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setModalVisible(false)}>
                Cancel
              </button>
              <button className="update-button" onClick={updateVideo}>
                Update Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-button" onClick={() => setConfirmDelete(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this video? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="delete-button" onClick={() => deleteVideo(confirmDelete)}>
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="modal-overlay" onClick={() => setPreviewVideo(null)}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{previewVideo.title}</h3>
              <button className="close-button" onClick={() => setPreviewVideo(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-container">
              <video controls autoPlay className="preview-video">
                <source src={`https://ipfs.io/ipfs/${previewVideo.videoHash}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="preview-info">
              <p>{previewVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .video-management {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }

        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .management-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .search-container {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .search-input {
          width: 100%;
          padding: 10px 36px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #0095f6;
          box-shadow: 0 0 0 2px rgba(0, 149, 246, 0.2);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }

        .notification.success {
          background-color: #e3f8e7;
          color: #1e7c34;
        }

        .notification.error {
          background-color: #fde8e8;
          color: #e02424;
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

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 149, 246, 0.2);
          border-radius: 50%;
          border-top-color: #0095f6;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px 0;
          color: #666;
        }

        .empty-state h3 {
          margin: 16px 0;
          font-weight: 600;
        }

        .upload-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 10px 20px;
          background-color: #0095f6;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .upload-link:hover {
          background-color: #0077c5;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .video-card {
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .video-thumbnail {
          position: relative;
          height: 180px;
          overflow: hidden;
          cursor: pointer;
        }

        .thumbnail-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          color: white;
        }

        .video-thumbnail:hover .play-overlay {
          opacity: 1;
        }

        .video-info {
          padding: 16px;
        }

        .video-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-description {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-actions {
          display: flex;
          padding: 0 16px 16px;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .action-button.edit {
          background-color: #e3f2fd;
          color: #0077c5;
        }

        .action-button.edit:hover {
          background-color: #bbdefb;
        }

        .action-button.delete {
          background-color: #fde8e8;
          color: #e02424;
        }

        .action-button.delete:hover {
          background-color: #fbd5d5;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          animation: modalFadeIn 0.3s ease;
        }

        .preview-modal {
          max-width: 800px;
        }

        .confirm-modal {
          max-width: 400px;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .close-button:hover {
          background-color: #f3f4f6;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #eee;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #0095f6;
          box-shadow: 0 0 0 2px rgba(0, 149, 246, 0.2);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .cancel-button {
          padding: 10px 16px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background-color: white;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background-color: #f3f4f6;
        }

        .update-button, .delete-button {
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .update-button {
          background-color: #0095f6;
          color: white;
        }

        .update-button:hover {
          background-color: #0077c5;
        }

        .delete-button {
          background-color: #e02424;
          color: white;
        }

        .delete-button:hover {
          background-color: #c81e1e;
        }

        .preview-container {
          width: 100%;
        }

        .preview-video {
          width: 100%;
          max-height: 60vh;
          object-fit: contain;
          background-color: black;
        }

        .preview-info {
          padding: 16px 20px;
        }

        .preview-info p {
          margin: 0;
          line-height: 1.6;
          color: #333;
        }

        @media (max-width: 768px) {
          .management-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-container {
            width: 100%;
          }

          .video-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default VideoManagement


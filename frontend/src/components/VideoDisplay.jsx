"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Share, Heart, ChevronUp, ChevronDown, User, Copy, Facebook, Twitter, Mail, Send } from "lucide-react"
import "./VideoDisplay.css"

const VideoDisplay = () => {
  const [videos, setVideos] = useState([])
  const [popoverOpen, setPopoverOpen] = useState(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRefs = useRef([])
  const feedRef = useRef(null)
  const [doubleTapLike, setDoubleTapLike] = useState(null)
  const [lastTap, setLastTap] = useState(0)

  // Get user from Redux store
  const currentUser = useSelector((state) => state.user.currentUser)
  const userId = currentUser?._id

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/video/Display")

        setVideos(
          response.data.map((video) => ({
            ...video,
            likedBy: video.likedBy || [], // Ensure likedBy is always an array
            isLiked: (video.likedBy || []).includes(userId),
          })),
        )
      } catch (error) {
        console.error("Error fetching videos:", error)
      }
    }
    fetchVideos()
  }, [userId])

  useEffect(() => {
    // Initialize video refs array
    videoRefs.current = videoRefs.current.slice(0, videos.length)

    // Add intersection observer for video playback
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target
          video.play().catch((err) => console.log("Autoplay prevented:", err))

          // Find the index of the current video
          const index = videoRefs.current.findIndex((ref) => ref === video)
          if (index !== -1) {
            setCurrentVideoIndex(index)
          }
        } else {
          entry.target.pause()
        }
      })
    }, options)

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video)
    })

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video)
      })
    }
  }, [videos])

  const handleLike = async (id, isLiked, event) => {
    if (event) {
      event.stopPropagation()
    }

    if (!userId) {
      alert("You must be logged in to like videos!")
      return
    }

    try {
      const response = await axios.patch(`http://localhost:5000/video/like/${id}`, { userId })

      // Update videos state with the correct like count from API
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === id
            ? {
                ...video,
                likes: response.data.likes, // Use the likes count from API response
                isLiked: !isLiked,
              }
            : video,
        ),
      )
    } catch (error) {
      console.error("Error updating like:", error)
      alert("Failed to update like")
    }
  }

  const handleTap = (id, isLiked) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!isLiked) {
        handleLike(id, isLiked)
        setDoubleTapLike(id)
        setTimeout(() => setDoubleTapLike(null), 1000)
      }
    }

    setLastTap(now)
  }

  const handleCopy = (videoUrl, event) => {
    if (event) {
      event.stopPropagation()
    }

    navigator.clipboard.writeText(videoUrl)
    // Show toast instead of alert for better UX
    const toast = document.createElement("div")
    toast.className = "copy-toast"
    toast.textContent = "Link copied!"
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("show")
      setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }, 10)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleScroll = (direction) => {
    const newIndex =
      direction === "next" ? Math.min(currentVideoIndex + 1, videos.length - 1) : Math.max(currentVideoIndex - 1, 0)

    setCurrentVideoIndex(newIndex)

    // Scroll to the video
    videoRefs.current[newIndex]?.parentElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const toggleSharePopover = (id, event) => {
    if (event) {
      event.stopPropagation()
    }
    setPopoverOpen(popoverOpen === id ? null : id)
  }

  return (
    <div className={`reels-container ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="reels-header">
        <div className="brand-logo">
          <span className="logo-text">Reels</span>
        </div>
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>

      <div className="reels-feed" ref={feedRef}>
        {videos.length > 0 && (
          <>
            <button
              className={`nav-button prev-button ${currentVideoIndex === 0 ? "hidden" : ""}`}
              onClick={() => handleScroll("prev")}
            >
              <ChevronUp size={20} />
            </button>

            <button
              className={`nav-button next-button ${currentVideoIndex === videos.length - 1 ? "hidden" : ""}`}
              onClick={() => handleScroll("next")}
            >
              <ChevronDown size={20} />
            </button>
          </>
        )}

        <AnimatePresence>
          {videos.map((video, index) => {
            const shareUrl = `https://ipfs.io/ipfs/${video.videoHash}`
            const sellerName = video.sellerShopName || "Creator"

            return (
              <motion.div
                key={video._id}
                className="reel-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="video-container">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    loop
                    playsInline
                    muted
                    className="reel-video"
                    onClick={(e) => {
                      if (e.target.paused) {
                        e.target.play()
                      } else {
                        e.target.pause()
                      }
                    }}
                    onTouchStart={() => handleTap(video._id, video.isLiked)}
                  >
                    <source src={shareUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {doubleTapLike === video._id && (
                    <div className="heart-animation active">
                      <Heart size={80} fill="#ff375f" />
                    </div>
                  )}

                  <div className="video-overlay">
                    <div className="video-info">
                      <div className="user-info">
                        <div className="avatar">
                          <User size={16} />
                        </div>
                        <span className="username">{sellerName}</span>
                      </div>

                      <h5 className="video-title">{video.title}</h5>
                      <p className="video-description">{video.description}</p>
                    </div>
                  </div>

                  {/* Desktop action buttons */}
                  <div className="desktop-actions">
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      className={`action-button like-button ${video.isLiked ? "" : "liked"}`}
                      onClick={(e) => handleLike(video._id, video.isLiked, e)}
                    >
                      <Heart size={28} fill={video.isLiked ? "#ff375f" : "none"} />
                      <span className="action-count">{video.likes || 0}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      className="action-button share-button"
                      onClick={(e) => toggleSharePopover(video._id, e)}
                    >
                      <Share size={28} />
                    </motion.button>
                  </div>

                  {/* Mobile action buttons */}
                  <div className="mobile-actions">
                    <div className="mobile-actions-container">
                      <motion.button
                        whileTap={{ scale: 1.2 }}
                        className={`action-button like-button ${video.isLiked ? "" : "liked"}`}
                        onClick={(e) => handleLike(video._id, video.isLiked, e)}
                      >
                        <Heart size={24} fill={video.isLiked ? "#ff375f" : "none"} />
                        <span className="action-count">{video.likes || 0}</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 1.2 }}
                        className="action-button share-button"
                        onClick={(e) => toggleSharePopover(video._id, e)}
                      >
                        <Share size={24} />
                      </motion.button>
                    </div>
                  </div>

                  {popoverOpen === video._id && (
                    <motion.div
                      className="share-popover"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="share-buttons">
                        <button
                          className="share-icon whatsapp"
                          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank")}
                        >
                          <Send size={20} />
                        </button>

                        <button
                          className="share-icon email"
                          onClick={() =>
                            window.open(
                              `mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(shareUrl)}`,
                              "_blank",
                            )
                          }
                        >
                          <Mail size={20} />
                        </button>

                        <button
                          className="share-icon facebook"
                          onClick={() =>
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                              "_blank",
                            )
                          }
                        >
                          <Facebook size={20} />
                        </button>

                        <button
                          className="share-icon twitter"
                          onClick={() =>
                            window.open(
                              `https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(shareUrl)}`,
                              "_blank",
                            )
                          }
                        >
                          <Twitter size={20} />
                        </button>

                        <button className="share-icon clipboard" onClick={(e) => handleCopy(shareUrl, e)}>
                          <Copy size={20} />
                        </button>
                      </div>
                      <button className="close-share" onClick={() => setPopoverOpen(null)}>
                        Close
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VideoDisplay


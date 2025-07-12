// Edited 
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { underControl } from "../redux/userSlice"
import MuiAlert from "@mui/material/Alert"
import { Snackbar, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

const MotionAlert = motion(MuiAlert)

const Popup = ({ message, setShowPopup, showPopup, duration = 2000 }) => {
  const dispatch = useDispatch()

  const vertical = "top"
  const horizontal = "right"

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return
    setShowPopup(false)
    dispatch(underControl())
  }

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false)
        dispatch(underControl())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [showPopup, dispatch, setShowPopup, duration])

  return (
    <AnimatePresence>
      {showPopup && (
        <Snackbar
          open={showPopup}
          autoHideDuration={duration}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
        >
          <MotionAlert
            onClose={handleClose}
            severity={
              message.includes("Success") ? "success" : "error"
            }
            sx={{
              width: "100%",
              background: message.includes("Success")
                ? "linear-gradient(135deg, #03c5db, #4caf50)"
                : "linear-gradient(135deg, #f44336, #ff9800)",
              color: "white",
              boxShadow: message.includes("Success")
                ? "0 4px 20px rgba(3, 197, 219, 0.3)"
                : "0 4px 20px rgba(244, 67, 54, 0.3)",
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {message}
          </MotionAlert>
        </Snackbar>
      )}
    </AnimatePresence>
  )
}

export default Popup
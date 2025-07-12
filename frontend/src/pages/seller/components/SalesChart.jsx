// Edited 
import { Button, Card, CardActions, CardContent, CardHeader, Divider, SvgIcon, Box, Typography } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Chart from "react-apexcharts"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"

// Motion components
const MotionCard = motion(Card)
const MotionButton = motion(Button)

// Animation variants
const cardVariants = {
  hover: {
    boxShadow: "0 8px 30px rgba(3, 197, 219, 0.15)",
    y: -5,
    transition: { duration: 0.3 },
  },
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
}

const SalesChart = ({ type, stats }) => {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Generate chart data based on stats
  const chartData = {
    options: {
      chart: {
        id: "sales-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
          autoSelected: "zoom",
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      xaxis: {
        categories: ["Week 1", "Week 2", "Week 3", "Week 4"], // Example weeks
      },
      yaxis: {
        title: {
          text: "Sales",
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
      },
      colors: ["#03c5db", "#f0e786"],
    },
    series: [
      {
        name: "Weekly Sales",
        data: stats?.WeeklySales ? [stats.WeeklySales] : [0], // Use Weekly Sales data
      },
      {
        name: "Added to Cart",
        data: stats?.AddedToCart ? [stats.AddedToCart] : [0], // Use Added to Cart data
      },
      {
        name: "Ongoing Orders",
        data: stats?.OngoingOrders ? [stats.OngoingOrders] : [0], // Use Ongoing Orders data
      },
      {
        name: "Cancelled Orders",
        data: stats?.CancelledOrders ? [stats.CancelledOrders] : [0], // Use Cancelled Orders data
      },
    ],
  }

  return (
    <MotionCard
      variants={cardVariants}
      whileHover="hover"
      sx={{
        background: "linear-gradient(135deg, rgba(3, 197, 219, 0.05), rgba(240, 231, 134, 0.05))",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(3, 197, 219, 0.1)",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Decorative top bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #03c5db, #f0e786)",
        }}
      />

      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#1a365d",
            }}
          >
            {type === "line" ? "Sales Trend" : "Monthly Revenue"}
          </Typography>
        }
        action={
          <MotionButton
            color="inherit"
            size="small"
            startIcon={
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isRefreshing
                    ? {
                        duration: 1,
                        repeat: 1,
                        ease: "linear",
                      }
                    : {}
                }
              >
                <SvgIcon
                  fontSize="small"
                  sx={{
                    color: "#03c5db",
                  }}
                >
                  <RefreshIcon />
                </SvgIcon>
              </motion.div>
            }
            onClick={handleRefresh}
            sx={{
              color: "#1a365d",
              "&:hover": {
                backgroundColor: "rgba(3, 197, 219, 0.08)",
              },
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Refresh
          </MotionButton>
        }
        sx={{ pb: 0 }}
      />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 310,
          pt: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ResponsiveChart
            options={chartData.options}
            series={chartData.series}
            type={type}
            height="100%"
          />
        </motion.div>
      </CardContent>

      <StyledDivider />

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <MotionButton
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small" sx={{ color: "#03c5db" }}>
              <ArrowForwardIcon />
            </SvgIcon>
          }
          size="small"
          onClick={() => navigate("/Seller/orders")}
          sx={{
            color: "#1a365d",
            "&:hover": {
              backgroundColor: "rgba(3, 197, 219, 0.08)",
            },
          }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          View Details
        </MotionButton>
      </CardActions>
    </MotionCard>
  )
}

export default SalesChart

const ResponsiveChart = styled(Chart)`
    width: 100%;
    height: 100%;
`

const StyledDivider = styled(Divider)`
    margin: 0;
    background: linear-gradient(90deg, rgba(3, 197, 219, 0.1), rgba(240, 231, 134, 0.1));
    height: 1px;
`
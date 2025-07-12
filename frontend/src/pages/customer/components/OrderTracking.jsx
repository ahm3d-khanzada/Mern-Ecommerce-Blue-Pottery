import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Truck,
  Package,
  ShoppingCart,
  Box,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Define the statuses array
const statuses = [
  { label: "Order Placed", icon: ShoppingCart },
  { label: "Packed", icon: Box },
  { label: "Shipped", icon: Package },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle },
];

export default function OrderTrackingComplete() {
  // State for the demo selector
  const [selectedStatus, setSelectedStatus] = useState("Order Placed");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // State for the actual tracking component
  const [currentStatus, setCurrentStatus] = useState(selectedStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId] = useState("ORD-12345");

  // Effect to simulate API call when selected status changes
  useEffect(() => {
    // Simulating API call to fetch order status
    setIsLoading(true);
    const fetchOrderStatus = async () => {
      try {
        // For demo purposes, we'll simulate different statuses
        const statusIndex = Math.min(
          statuses.findIndex((s) => s.label === selectedStatus) + 1,
          statuses.length - 1
        );
        const fetchedStatus = statuses[statusIndex].label;

        setTimeout(() => {
          setCurrentStatus(fetchedStatus);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching order status:", error);
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId, selectedStatus]);

  const currentStatusIndex = statuses.findIndex(
    (s) => s.label === currentStatus
  );

  return (
    <div className="container py-5 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-primary">
            Order Tracking Demo
          </h1>
          <p className="text-muted">
            Track the status of your order in real-time
          </p>
        </div>

        {/* Status Selector */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between p-4 bg-light rounded-lg mb-4">
          <span className="font-weight-bold mb-2 mb-md-0">
            Set initial status:
          </span>
          <Dropdown
            isOpen={isSelectOpen}
            toggle={() => setIsSelectOpen(!isSelectOpen)}
          >
            <DropdownToggle caret className="w-100 w-md-auto">
              {selectedStatus}
            </DropdownToggle>
            <DropdownMenu className="w-100">
              {statuses.map((status) => (
                <DropdownItem
                  key={status.label}
                  onClick={() => {
                    setSelectedStatus(status.label);
                    setIsSelectOpen(false);
                  }}
                >
                  {status.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Order Tracking Card */}
        <Card className="shadow-sm border-0">
          <CardBody className="p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="d-flex justify-content-between w-100 align-items-center mb-4">
                <CardTitle tag="h2" className="m-0">
                  Order #{orderId}
                </CardTitle>
                <span
                  className={`badge p-2 ${
                    isLoading ? "bg-secondary" : "bg-primary"
                  } text-white`}
                >
                  {isLoading ? "Updating..." : currentStatus}
                </span>
              </div>

              <div className="relative w-100 my-4">
                {/* Progress bar */}
                <div className="position-absolute top-50 start-0 w-100 h-1 bg-light -translate-y-1/2" />
                <motion.div
                  className="position-absolute top-50 start-0 h-1 bg-primary -translate-y-1/2"
                  initial={{ width: "0%" }}
                  animate={{
                    width: isLoading
                      ? `${(currentStatusIndex / (statuses.length - 1)) * 100}%`
                      : `${
                          (currentStatusIndex / (statuses.length - 1)) * 100
                        }%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Status icons */}
                <div className="position-relative d-flex justify-content-between align-items-center">
                  {statuses.map((status, index) => {
                    const isActive = currentStatusIndex >= index;
                    const isPrevious = currentStatusIndex > index;
                    const Icon = status.icon;

                    return (
                      <div
                        key={status.label}
                        className="d-flex flex-column align-items-center z-index-10"
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{
                            scale: isActive ? 1 : 0.8,
                            opacity: isActive ? 1 : 0.6,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: isLoading ? 0 : index * 0.1,
                          }}
                          className={`rounded-circle shadow-sm d-flex align-items-center justify-content-center ${
                            isPrevious
                              ? "bg-primary text-white"
                              : isActive
                              ? "bg-primary bg-opacity-10 text-primary border-2 border-primary"
                              : "bg-light text-muted"
                          }`}
                          style={{ width: "48px", height: "48px" }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>

                        <motion.span
                          className={`mt-2 small fw-medium ${
                            isActive ? "text-primary" : "text-muted"
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: isLoading ? 0 : index * 0.1 + 0.2,
                          }}
                        >
                          {status.label}
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-100 mt-4">
                <h3 className="h5 fw-semibold mb-3">Order Details</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <p className="small text-muted mb-1">
                        Estimated Delivery
                      </p>
                      <p className="mb-0 fw-semibold">March 28 - April 2</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <p className="small text-muted mb-1">Shipping Method</p>
                      <p className="mb-0 fw-semibold">Express Shipping</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-100 d-flex justify-content-end mt-4">
                <Button
                  onClick={() => {
                    // For demo purposes, advance to next status
                    const nextIndex = Math.min(
                      currentStatusIndex + 1,
                      statuses.length - 1
                    );
                    setCurrentStatus(statuses[nextIndex].label);
                  }}
                  color="primary"
                  disabled={currentStatusIndex === statuses.length - 1}
                >
                  {currentStatusIndex === statuses.length - 1
                    ? "Delivered"
                    : "Update Status"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

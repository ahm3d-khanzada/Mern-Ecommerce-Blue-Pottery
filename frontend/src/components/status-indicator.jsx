import { Package2, Truck, CheckCircle, Clock, X } from "lucide-react";

const STATUS_CONFIG = [
  { value: "Processing", label: "Processing", icon: Clock, color: "#f0ad4e" },
  { value: "Packed", label: "Packed", icon: Package2, color: "#5bc0de" },
  { value: "Shipped", label: "Shipped", icon: Truck, color: "#0275d8" },
  {
    value: "Delivered",
    label: "Delivered",
    icon: CheckCircle,
    color: "#5cb85c",
  },
];

// Add Cancelled status separately since it's not part of the normal flow
const CANCELLED_STATUS = {
  value: "Cancelled",
  label: "Cancelled",
  icon: X,
  color: "#d9534f",
};

const StatusIndicator = ({ currentStatus, readOnly = false }) => {
  // If order is cancelled, show special cancelled status
  if (currentStatus === "Cancelled") {
    return (
      <div className="d-flex flex-column align-items-center p-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-2"
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: CANCELLED_STATUS.color,
            color: "white",
          }}
        >
          <CANCELLED_STATUS.icon size={32} />
        </div>
        <h5 className="text-danger">Order Cancelled</h5>
        <p className="text-muted text-center">
          This order has been cancelled and will not be processed further.
        </p>
      </div>
    );
  }

  // Find the index of the current status
  const currentStatusIndex = STATUS_CONFIG.findIndex(
    (s) => s.value === currentStatus
  );

  return (
    <div className="position-relative">
      {/* Progress bar */}
      <div
        className="position-absolute top-50 start-0 w-100"
        style={{
          height: "4px",
          backgroundColor: "#e9ecef",
          transform: "translateY(-50%)",
        }}
      />

      <div
        className="position-absolute top-50 start-0"
        style={{
          height: "4px",
          backgroundColor: "#0275d8",
          width: `${(currentStatusIndex / (STATUS_CONFIG.length - 1)) * 100}%`,
          transform: "translateY(-50%)",
          transition: "width 0.5s ease-in-out",
        }}
      />

      {/* Status icons */}
      <div
        className="d-flex justify-content-between position-relative"
        style={{ padding: "0 12px" }}
      >
        {STATUS_CONFIG.map((status, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const Icon = status.icon;

          return (
            <div
              key={status.value}
              className="d-flex flex-column align-items-center"
              style={{ zIndex: 1 }}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${
                  isCurrent ? "border border-3 border-primary" : ""
                }`}
                style={{
                  width: isCurrent ? "48px" : "40px",
                  height: isCurrent ? "48px" : "40px",
                  backgroundColor: isActive ? status.color : "#e9ecef",
                  color: isActive ? "white" : "#6c757d",
                  transition: "all 0.3s ease",
                }}
              >
                <Icon size={isCurrent ? 24 : 20} />
              </div>
              <span
                className={`mt-2 small ${isActive ? "fw-bold" : "text-muted"}`}
                style={{ fontSize: isCurrent ? "0.9rem" : "0.8rem" }}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusIndicator;


import { useState } from "react"
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap"
import { ShoppingCart, Package2, Truck, CheckCircle, Clock } from "lucide-react"
import StatusIndicator from "../../../components/status-indicator"

const ORDER_STATUSES = [
  { value: "Processing", label: "Processing", icon: Clock, color: "warning" },
  { value: "Packed", label: "Packed", icon: Package2, color: "info" },
  { value: "Shipped", label: "Shipped", icon: Truck, color: "primary" },
  { value: "Delivered", label: "Delivered", icon: CheckCircle, color: "success" },
  { value: "Cancelled", label: "Cancelled", icon: ShoppingCart, color: "danger" },
]

const SellerOrderView = ({ orderId, currentStatus, onStatusUpdate, loading }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState)

  const currentStatusObj = ORDER_STATUSES.find((status) => status.value === currentStatus) || ORDER_STATUSES[0]

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col xs="12" md="6">
          <h4 className="mb-3 mb-md-0">
            Order #{orderId}
            <Badge color={currentStatusObj.color} className="ms-2 py-2 px-3">
              {currentStatus}
            </Badge>
          </h4>
        </Col>
        <Col xs="12" md="6" className="text-md-end">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="primary" caret disabled={loading}>
              Update Status
            </DropdownToggle>
            <DropdownMenu end>
              {ORDER_STATUSES.map((status) => (
                <DropdownItem
                  key={status.value}
                  onClick={() => onStatusUpdate(status.value)}
                  active={status.value === currentStatus}
                >
                  <span className="d-flex align-items-center">
                    <status.icon size={16} className="me-2" />
                    {status.label}
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

      <Card className="mb-4 border-0 shadow-sm">
        <CardBody>
          <h5 className="mb-3">Order Status Timeline</h5>
          <StatusIndicator currentStatus={currentStatus} />
        </CardBody>
      </Card>

      <Row className="mt-4">
        <Col xs="12" md="6">
          <Card className="h-100 border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">Status Management</h5>
              <p className="text-muted">
                As a seller, you can update the order status to keep your customer informed about their purchase.
              </p>
              <div className="d-grid gap-2">
                {ORDER_STATUSES.map((status) => (
                  <Button
                    key={status.value}
                    color={status.value === currentStatus ? status.color : "light"}
                    className={`text-start d-flex align-items-center ${status.value === currentStatus ? "text-white" : ""}`}
                    onClick={() => onStatusUpdate(status.value)}
                    disabled={loading || status.value === currentStatus}
                  >
                    <status.icon size={18} className="me-2" />
                    <span>Mark as {status.label}</span>
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" md="6" className="mt-3 mt-md-0">
          <Card className="h-100 border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">Customer View</h5>
              <p className="text-muted">This is how your customer sees the current order status:</p>
              <div className="p-3 bg-light rounded">
                <StatusIndicator currentStatus={currentStatus} readOnly />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SellerOrderView


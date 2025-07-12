import { Row, Col, Card, CardBody, Badge } from "reactstrap"
import StatusIndicator from "../../../components/status-indicator"

const CustomerOrderView = ({ orderId, currentStatus, loading }) => {
  // Determine badge color based on status
  let badgeColor = "secondary"

  switch (currentStatus) {
    case "Processing":
      badgeColor = "warning"
      break
    case "Packed":
      badgeColor = "info"
      break
    case "Shipped":
      badgeColor = "primary"
      break
    case "Delivered":
      badgeColor = "success"
      break
    case "Cancelled":
      badgeColor = "danger"
      break
    default:
      badgeColor = "secondary"
  }

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col>
          <h4>
            Order #{orderId}
            <Badge color={badgeColor} className="ms-2 py-2 px-3">
              {currentStatus}
            </Badge>
          </h4>
        </Col>
      </Row>

      <Card className="mb-4 border-0 shadow-sm">
        <CardBody>
          <h5 className="mb-3">Your Order Status</h5>
          <StatusIndicator currentStatus={currentStatus} readOnly />
        </CardBody>
      </Card>

      <Row className="mt-4">
        <Col xs="12" md="6">
          <Card className="h-100 border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">Delivery Information</h5>
              <p className="text-muted mb-1">Current Status:</p>
              <p className="fw-bold">{currentStatus}</p>

              {currentStatus === "Shipped" && (
                <>
                  <p className="text-muted mb-1 mt-3">Estimated Delivery:</p>
                  <p className="fw-bold">3-5 business days</p>
                </>
              )}

              {currentStatus === "Delivered" && (
                <>
                  <p className="text-muted mb-1 mt-3">Delivered On:</p>
                  <p className="fw-bold">{new Date().toLocaleDateString()}</p>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" md="6" className="mt-3 mt-md-0">
          <Card className="h-100 border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">Status Updates</h5>
              <p className="text-muted">
                We'll keep you informed about your order status. You'll receive notifications when your order status
                changes.
              </p>

              {currentStatus === "Processing" && (
                <p className="fst-italic">Your order is being processed by the seller.</p>
              )}

              {currentStatus === "Packed" && (
                <p className="fst-italic">Your order has been packed and is ready for shipping.</p>
              )}

              {currentStatus === "Shipped" && <p className="fst-italic">Your order is on its way to you!</p>}

              {currentStatus === "Delivered" && <p className="fst-italic">Your order has been delivered. Enjoy!</p>}

              {currentStatus === "Cancelled" && <p className="fst-italic">Your order has been cancelled.</p>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CustomerOrderView


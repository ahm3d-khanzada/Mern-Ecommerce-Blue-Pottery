"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap"
import SellerOrderView from "../pages/seller/pages/seller-order-view"
import CustomerOrderView from "../pages/customer/pages/customer-order-view"
import LoadingSpinner from "./loading-spinner"
import { getOrderStatus, updateOrderStatus } from "../redux/userHandle"

const OrderStatusDashboard = () => {
  const [orderStatus, setOrderStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [orderFound, setOrderFound] = useState(false)

  const dispatch = useDispatch()
  const { isLoggedIn, currentRole } = useSelector((state) => state.user)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) {
      setError("Please enter an order ID")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const status = await dispatch(getOrderStatus(searchInput))
      if (status) {
        setOrderId(searchInput)
        setOrderStatus(status)
        setOrderFound(true)
        setError(null)
      } else {
        setError("Order not found. Please check the order ID and try again.")
        setOrderFound(false)
      }
    } catch (err) {
      console.error("Error fetching order status:", err)
      setError("Failed to load order status. Please try again.")
      setOrderFound(false)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!orderId) {
      setError("No order selected. Please search for an order first.")
      return
    }

    try {
      setLoading(true)
      const success = await dispatch(updateOrderStatus(orderId, newStatus))
      if (success) {
        setOrderStatus(newStatus)
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
      } else {
        setError("Failed to update order status. Please try again.")
      }
    } catch (err) {
      console.error("Error updating order status:", err)
      setError("Failed to update order status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-primary text-white">
              <h3 className="m-0">Order Status Dashboard</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSearch}>
                <FormGroup className="mb-4">
                  <Label for="orderIdSearch" className="fw-bold">
                    Search Order
                  </Label>
                  <div className="d-flex">
                    <Input
                      type="text"
                      id="orderIdSearch"
                      placeholder="Enter Order ID"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="me-2"
                    />
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </FormGroup>
              </Form>

              {error && (
                <Alert color="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {updateSuccess && (
                <Alert color="success" className="mb-4">
                  Order status updated successfully!
                </Alert>
              )}

              {loading && <LoadingSpinner />}

              {orderFound && isLoggedIn && (
                <>
                  {(currentRole === "Seller" || currentRole === "admin" || currentRole === "Shopcart") && (
                    <SellerOrderView
                      orderId={orderId}
                      currentStatus={orderStatus}
                      onStatusUpdate={handleStatusUpdate}
                      loading={loading}
                    />
                  )}

                  {currentRole === "Customer" && (
                    <CustomerOrderView orderId={orderId} currentStatus={orderStatus} loading={loading} />
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderStatusDashboard


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Home from "./pages/Home";
import ViewProduct from "./pages/ViewProduct";
import Navbar from "./pages/Navbar";
import AuthenticationPage from "./pages/AuthenticationPage";
import SellerDashboard from "./pages/seller/SellerDashboard";
import CustomerSearch from "./pages/customer/pages/CustomerSearch";
import Products from "./components/Products";
import CustomerOrders from "./pages/customer/pages/CustomerOrders";
import CheckoutSteps from "./pages/customer/pages/CheckoutSteps";
import Profile from "./pages/customer/pages/Profile";
import Logout from "./pages/Logout";
import { getProducts } from "./redux/userHandle";
import { isTokenValid } from "./redux/userSlice";
import CheckoutAftermath from "./pages/customer/pages/CheckoutAftermath";
import ViewOrder from "./pages/customer/pages/ViewOrder";
import CustomSellerList from "./pages/customer/pages/CustomSellerList";
import CustomOrder from "./pages/customer/pages/CustomOrder";
import VideoDisplay from "./components/VideoDisplay";
import OrderStatusDashboard from "./components/order-status-dashboard";

import ChatbotPortal from "./components/ChatbotPortal"; // ✅ Portal import
const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, currentToken, currentRole, productData } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getProducts());

    if (currentToken) {
      dispatch(isTokenValid());
    }
  }, [dispatch, currentToken]);

  return (
    <BrowserRouter>
      {!isLoggedIn && currentRole === null && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route
              path="/Products"
              element={<Products productData={productData} />}
            />
            <Route path="/product/view/:id" element={<ViewProduct />} />
            <Route path="/Search" element={<CustomerSearch mode="Mobile" />} />
            <Route
              path="/ProductSearch"
              element={<CustomerSearch mode="Desktop" />}
            />
            <Route
              path="/Customerregister"
              element={<AuthenticationPage mode="Register" role="Customer" />}
            />
            <Route
              path="/Customerlogin"
              element={<AuthenticationPage mode="Login" role="Customer" />}
            />
            <Route
              path="/Sellerregister"
              element={<AuthenticationPage mode="Register" role="Seller" />}
            />
            <Route
              path="/Sellerlogin"
              element={<AuthenticationPage mode="Login" role="Seller" />}
            />
          </Routes>
        </>
      )}

      {isLoggedIn && currentRole === "Customer" && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route
              path="/Products"
              element={<Products productData={productData} />}
            />
            <Route path="/product/view/:id" element={<ViewProduct />} />
            <Route path="/Search" element={<CustomerSearch mode="Mobile" />} />
            <Route
              path="/ProductSearch"
              element={<CustomerSearch mode="Desktop" />}
            />
            <Route path="/Checkout" element={<CheckoutSteps />} />
            <Route path="/product/buy/:id" element={<CheckoutSteps />} />
            <Route path="/Aftermath" element={<CheckoutAftermath />} />
            <Route path="/DisplayVideo" element={<VideoDisplay />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Orders" element={<CustomerOrders />} />
            <Route path="/order/view/:id" element={<ViewOrder />} />
            <Route path="/Custom-seller/list" element={<CustomSellerList />} />
            <Route path="/Custom-Order/list" element={<CustomOrder />} />
            <Route path="/Order-status-Customer" element={<OrderStatusDashboard />} />
            <Route path="/Logout" element={<Logout />} />
          </Routes>
          <ChatbotPortal /> {/* ✅ Floating Chatbot via Portal */}
        </>
      )}

      {isLoggedIn &&
        (currentRole === "Seller" ||
          currentRole === "admin" ||
          currentRole === "Shopcart") && (
          <>
            <SellerDashboard />
          </>
        )}
    </BrowserRouter>
  );
};

export default App;

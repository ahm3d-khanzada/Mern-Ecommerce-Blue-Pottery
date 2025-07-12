"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderStatus } from "../redux/userHandle";
import { motion, AnimatePresence } from "framer-motion";

// Icons as components
const BotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8"></path>
    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
    <path d="M2 14h2"></path>
    <path d="M20 14h2"></path>
    <path d="M15 13v2"></path>
    <path d="M9 13v2"></path>
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16 16 2 2 4-4"></path>
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
    <path d="M16.5 9.4 7.55 4.24"></path>
    <polyline points="3.29 7 12 12 20.71 7"></polyline>
    <line x1="12" y1="22" x2="12" y2="12"></line>
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

const MinimizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14h6v6"></path>
    <path d="M20 10h-6V4"></path>
    <path d="m14 10 7-7"></path>
    <path d="m3 21 7-7"></path>
  </svg>
);

const PotteryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2h12v2H6z"></path>
    <path d="M6 4c0 8.4 3.8 12 6 12 1.8 0 6-3.6 6-12"></path>
    <path d="M6 4v16h12V4"></path>
  </svg>
);

// Update the EnhancedOrderChatbot component to handle the case when setIsCartOpen is not a function
const EnhancedOrderChatbot = ({ setIsCartOpen }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Safe version of setIsCartOpen
  const safeSetIsCartOpen = (value) => {
    if (typeof setIsCartOpen === "function") {
      setIsCartOpen(value);
    } else {
      console.log(
        "setIsCartOpen is not a function, would set cart open to:",
        value
      );
    }
  };

  // Get user and cart info from Redux store
  const { currentUser, cartDetails } = useSelector((state) => ({
    currentUser: state.user?.currentUser || null,
    cartDetails: state.user?.currentUser?.cartDetails || [],
  }));

  const cartItemCount = cartDetails?.length || 0;

  // Format price helper
  const formatPrice = (price) =>
    `Rs.${new Intl.NumberFormat("en-PK").format(price || 0)}`;

  // Calculate cart total
  const cartTotal = cartDetails.reduce((total, item) => {
    return total + (item.price?.cost || 0) * (item.quantity || 1);
  }, 0);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: currentUser?.name
            ? `Hello ${currentUser.name}! Welcome to Blue Crafts Fusions. How can I help you today? You can ask about Multan pottery, check your order status, view your cart, or place a new order.`
            : "Hello! Welcome to Blue Crafts Fusions. How can I help you today? You can ask about Multan pottery, check your order status, view your cart, or place a new order.",
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentUser, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [messages, isOpen, isMinimized, activeTab]);

  // Function to check order status
  const checkOrderStatus = async (orderNum) => {
    if (!orderNum.trim()) return;

    setIsLoading(true);
    try {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: `Check order #${orderNum}`,
          timestamp: new Date(),
        },
      ]);

      // Call your existing getOrderStatus function
      const status = await dispatch(getOrderStatus(orderNum));

      // Add response message
      if (status) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `
            <div class="order-status-card">
              <div class="order-status-header">
                <span class="order-id">Order #${orderNum}</span>
                <span class="status-badge ${status.toLowerCase()}">${status}</span>
              </div>
              <div class="order-status-details">
                <div class="status-timeline">
                  <div class="timeline-item ${
                    status === "Processing" ||
                    status === "Packed" ||
                    status === "Shipped" ||
                    status === "Delivered"
                      ? "active"
                      : ""
                  }">
                    <div class="timeline-icon"></div>
                    <div class="timeline-text">Processing</div>
                  </div>
                  <div class="timeline-item ${
                    status === "Packed" ||
                    status === "Shipped" ||
                    status === "Delivered"
                      ? "active"
                      : ""
                  }">
                    <div class="timeline-icon"></div>
                    <div class="timeline-text">Packed</div>
                  </div>
                  <div class="timeline-item ${
                    status === "Shipped" || status === "Delivered"
                      ? "active"
                      : ""
                  }">
                    <div class="timeline-icon"></div>
                    <div class="timeline-text">Shipped</div>
                  </div>
                  <div class="timeline-item ${
                    status === "Delivered" ? "active" : ""
                  }">
                    <div class="timeline-icon"></div>
                    <div class="timeline-text">Delivered</div>
                  </div>
                </div>
                <div class="order-message">
                  ${
                    status === "Processing"
                      ? "Your order is being processed by our team."
                      : ""
                  }
                  ${
                    status === "Packed"
                      ? "Your order has been packed and is ready for shipping."
                      : ""
                  }
                  ${
                    status === "Shipped"
                      ? "Your order is on its way to you! Expected delivery in 3-5 days."
                      : ""
                  }
                  ${
                    status === "Delivered"
                      ? "Your order has been delivered. Enjoy your purchase!"
                      : ""
                  }
                  ${
                    status === "Cancelled"
                      ? "Your order has been cancelled. Please contact support for more information."
                      : ""
                  }
                </div>
              </div>
            </div>
          `,
            timestamp: new Date(),
            isHtml: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `Sorry, I couldn't find order #${orderNum}. Please check the order number and try again.`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Sorry, there was an error checking the order status. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setOrderNumber("");
    }
  };

  // Handle order status form submission
  const handleOrderStatusCheck = (e) => {
    e.preventDefault();
    checkOrderStatus(orderNumber);
  };

  // Handle cart query
  const handleCartQuery = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "What's in my cart?",
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      if (cartItemCount > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `
          <div class="cart-summary-card">
            <div class="cart-header">
              <div class="cart-title">Your Shopping Cart</div>
            </div>
            <div class="cart-details">
              <div class="cart-item-count">${cartItemCount} item${
              cartItemCount !== 1 ? "s" : ""
            } in cart</div>
              <div class="cart-total">Total: ${formatPrice(cartTotal)}</div>
              ${cartDetails
                .map(
                  (item, index) => `
                <div class="cart-item" key="${index}">
                  <div class="item-image">
                    <img src="${
                      item.productImage || "/placeholder.svg?height=40&width=40"
                    }" alt="${item.productName || "Product"}" />
                  </div>
                  <div class="item-details">
                    <div class="item-name">${
                      item.productName || "Product"
                    }</div>
                    <div class="item-meta">
                      <span class="item-quantity">Qty: ${
                        item.quantity || 1
                      }</span>
                      <span class="item-price">${formatPrice(
                        (item.price?.cost || 0) * (item.quantity || 1)
                      )}</span>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="cart-actions">
              <button class="view-cart-btn" onclick="window.viewCartAction()">View Full Cart</button>
              <button class="checkout-btn" onclick="window.checkoutAction()">Checkout Now</button>
            </div>
          </div>
        `,
            timestamp: new Date(),
            isHtml: true,
          },
        ]);

        // Define global functions for the buttons
        window.viewCartAction = () => {
          safeSetIsCartOpen(true);
          setIsOpen(false);
        };

        window.checkoutAction = () => {
          safeSetIsCartOpen(false);
          window.location.href = "/Checkout";
        };
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Your cart is currently empty. Browse our beautiful Multan pottery collection to add items to your cart!",
            timestamp: new Date(),
          },
        ]);
      }
    }, 500);
  };

  // Handle greeting
  const handleGreeting = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "Hi",
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Hello! Welcome to Blue Crafts Fusions. How can I assist you today? You can ask about our Multan pottery collection, check your orders, view your cart, or get help with placing an order.",
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  // Handle Multan pottery info request
  const handleMultanPotteryInfo = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "Tell me about Multan pottery",
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `
          <div class="info-card pottery-info">
            <div class="info-header">
              <div class="info-title">Multan Pottery - A Rich Heritage</div>
            </div>
            <div class="pottery-content">
              <div class="pottery-image">
                <img src="/placeholder.svg?height=150&width=200" alt="Multan Pottery" />
              </div>
              <div class="pottery-description">
                <p>Multan pottery is one of Pakistan's most distinguished craft traditions, dating back over 5,000 years to the Indus Valley Civilization. The city of Multan in Punjab province is renowned for its distinctive blue pottery (Nila Kashi) featuring intricate floral and geometric patterns.</p>
                
                <h4>Key Features:</h4>
                <ul>
                  <li><strong>Blue & White Designs:</strong> Characterized by cobalt blue patterns on a white background</li>
                  <li><strong>Hand-Painted:</strong> Each piece is meticulously hand-crafted and painted</li>
                  <li><strong>Traditional Techniques:</strong> Uses centuries-old methods passed down through generations</li>
                  <li><strong>Unique Glazing:</strong> Special glazing techniques that create a distinctive shine</li>
                </ul>
                
                <p>Our collection features authentic Multan pottery pieces created by master artisans, preserving this cultural heritage while bringing timeless beauty to your home.</p>
              </div>
            </div>
            <div class="pottery-categories">
              <div class="category">
                <div class="category-name">Vases</div>
              </div>
              <div class="category">
                <div class="category-name">Plates</div>
              </div>
              <div class="category">
                <div class="category-name">Bowls</div>
              </div>
              <div class="category">
                <div class="category-name">Decorative Items</div>
              </div>
            </div>
          </div>
        `,
          timestamp: new Date(),
          isHtml: true,
        },
      ]);
    }, 800);
  };

  // Handle order info request
  const handleOrderInfo = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "How do I place an order?",
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `
          <div class="info-card">
            <div class="info-header">
              <div class="info-title">How to Place an Order</div>
            </div>
            <div class="info-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Browse our Multan pottery collection and add items to your cart</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Review your cart and proceed to checkout</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Enter your shipping and payment information</div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-text">Confirm your order and receive an order confirmation</div>
              </div>
            </div>
            <div class="info-footer">
              Need more help? Our customer service team is available 24/7.
            </div>
          </div>
        `,
          timestamp: new Date(),
          isHtml: true,
        },
      ]);
    }, 500);
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);

    // Process the message
    setTimeout(() => {
      let botResponse =
        "I'm not sure how to help with that. You can ask about Multan pottery, check your order status, view your cart, or get information about placing an order.";
      let isHtml = false;

      // Check for Multan pottery query
      if (/multan|pottery|blue pottery|ceramics|craft/i.test(userMessage)) {
        botResponse = `
          <div class="info-card pottery-info">
            <div class="info-header">
              <div class="info-title">Multan Pottery - A Rich Heritage</div>
            </div>
            <div class="pottery-content">
              <div class="pottery-image">
                <img src="/placeholder.svg?height=150&width=200" alt="Multan Pottery" />
              </div>
              <div class="pottery-description">
                <p>Multan pottery is one of Pakistan's most distinguished craft traditions, dating back over 5,000 years to the Indus Valley Civilization. The city of Multan in Punjab province is renowned for its distinctive blue pottery (Nila Kashi) featuring intricate floral and geometric patterns.</p>
                
                <h4>Key Features:</h4>
                <ul>
                  <li><strong>Blue & White Designs:</strong> Characterized by cobalt blue patterns on a white background</li>
                  <li><strong>Hand-Painted:</strong> Each piece is meticulously hand-crafted and painted</li>
                  <li><strong>Traditional Techniques:</strong> Uses centuries-old methods passed down through generations</li>
                  <li><strong>Unique Glazing:</strong> Special glazing techniques that create a distinctive shine</li>
                </ul>
                
                <p>Our collection features authentic Multan pottery pieces created by master artisans, preserving this cultural heritage while bringing timeless beauty to your home.</p>
              </div>
            </div>
            <div class="pottery-categories">
              <div class="category">
                <div class="category-name">Vases</div>
              </div>
              <div class="category">
                <div class="category-name">Plates</div>
              </div>
              <div class="category">
                <div class="category-name">Bowls</div>
              </div>
              <div class="category">
                <div class="category-name">Decorative Items</div>
              </div>
            </div>
          </div>
        `;
        isHtml = true;
      }
      // Check for order status query
      else if (/order|status|track/i.test(userMessage)) {
        const orderMatch = userMessage.match(/order\s+#?([a-zA-Z0-9]{6,})/i);
        if (orderMatch && orderMatch[1]) {
          // If there's an order number in the message, check it
          checkOrderStatus(orderMatch[1]);
          setIsLoading(false);
          return;
        } else {
          botResponse =
            "I can help you check your order status. Please provide your order number or use the form in the Orders tab.";
        }
      }
      // Check for cart query
      else if (/cart|items|shopping|basket|what.*in.*cart/i.test(userMessage)) {
        if (cartItemCount > 0) {
          botResponse = `
            <div class="cart-summary-card">
              <div class="cart-header">
                <div class="cart-title">Your Shopping Cart</div>
              </div>
              <div class="cart-details">
                <div class="cart-item-count">${cartItemCount} item${
            cartItemCount !== 1 ? "s" : ""
          } in cart</div>
                <div class="cart-total">Total: ${formatPrice(cartTotal)}</div>
                ${cartDetails
                  .map(
                    (item, index) => `
                  <div class="cart-item" key="${index}">
                    <div class="item-image">
                      <img src="${
                        item.productImage ||
                        "/placeholder.svg?height=40&width=40"
                      }" alt="${item.productName || "Product"}" />
                    </div>
                    <div class="item-details">
                      <div class="item-name">${
                        item.productName || "Product"
                      }</div>
                      <div class="item-meta">
                        <span class="item-quantity">Qty: ${
                          item.quantity || 1
                        }</span>
                        <span class="item-price">${formatPrice(
                          (item.price?.cost || 0) * (item.quantity || 1)
                        )}</span>
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <div class="cart-actions">
                <button class="view-cart-btn" onclick="window.viewCartAction()">View Full Cart</button>
                <button class="checkout-btn" onclick="window.checkoutAction()">Checkout Now</button>
              </div>
            </div>
          `;
          isHtml = true;

          // Define global functions for the buttons
          window.viewCartAction = () => {
            safeSetIsCartOpen(true);
            setIsOpen(false);
          };

          window.checkoutAction = () => {
            safeSetIsCartOpen(false);
            window.location.href = "/Checkout";
          };
        } else {
          botResponse =
            "Your cart is currently empty. Browse our beautiful Multan pottery collection to add items to your cart!";
        }
      }
      // Check for greeting
      else if (/^(hi|hello|hey|greetings)/i.test(userMessage)) {
        botResponse =
          "Hello! Welcome to Blue Crafts Fusions. How can I assist you today? You can ask about our Multan pottery collection, check your orders, view your cart, or get help with placing an order.";
      }
      // Check for order placement info
      else if (/how.+(order|buy|purchase)|place.+order/i.test(userMessage)) {
        botResponse = `
          <div class="info-card">
            <div class="info-header">
              <div class="info-title">How to Place an Order</div>
            </div>
            <div class="info-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Browse our Multan pottery collection and add items to your cart</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Review your cart and proceed to checkout</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Enter your shipping and payment information</div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-text">Confirm your order and receive an order confirmation</div>
              </div>
            </div>
            <div class="info-footer">
              Need more help? Our customer service team is available 24/7.
            </div>
          </div>
        `;
        isHtml = true;
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: botResponse,
          timestamp: new Date(),
          isHtml,
        },
      ]);

      setIsLoading(false);
      setShowSuggestions(true);
    }, 800);
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Add a function to handle cart view button click
  // Add this function to the EnhancedOrderChatbot component:

  // Handle cart view button click
  // const handleCartButtonClick = () => {
  //   // If the chatbot is already open, close it and open the cart
  //   if (isOpen) {
  //     setIsOpen(false)
  //     setTimeout(() => {
  //       safeSetIsCartOpen(true)
  //     }, 300) // Small delay to allow chatbot to close
  //   } else {
  //     // If the chatbot is closed, just open it
  //     setIsOpen(true)
  //     setActiveTab("chat")
  //     // Automatically trigger the cart query
  //     setTimeout(() => {
  //       handleCartQuery()
  //     }, 500)
  //   }
  // }

  return (
    <div className="chatbot-container">
      {/* Remove the floating cart button */}

      {/* Floating chatbot button with cart info */}
      {/* {!isOpen && (
        <motion.button
          className="chatbot-floating-btn"
          onClick={handleCartButtonClick}
          aria-label="Open chat and cart assistant"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="floating-btn-content">
            <BotIcon />
            <ShoppingCartIcon className="cart-icon" />
          </div>
          {cartItemCount > 0 && <span className="order-badge">{cartItemCount}</span>}
        </motion.button>
      )} */}
      {/* Simple floating chatbot button on bottom right */}
      {!isOpen && (
        <motion.button
          className="chatbot-floating-btn"
          onClick={toggleChat}
          aria-label="Open chat assistant"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BotIcon />
        </motion.button>
      )}

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`chatbot-modal ${isMinimized ? "minimized" : ""}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="header-content">
                <BotIcon />
                <div className="header-text">
                  <div className="chatbot-title">Blue Crafts Fusions</div>
                  <div className="chatbot-subtitle">
                    Multan Pottery Assistant
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <button
                  className="header-button"
                  onClick={toggleMinimize}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <MinimizeIcon />
                </button>
                <button
                  className="header-button"
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="chatbot-tabs">
                  <button
                    className={`tab-button ${
                      activeTab === "chat" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("chat")}
                  >
                    Chat
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "orders" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("orders")}
                  >
                    Orders
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "pottery" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("pottery")}
                  >
                    Pottery
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "help" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("help")}
                  >
                    Help
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === "chat" && (
                    <div className="chatbot-messages">
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            className={`message ${
                              message.role === "user" ? "user" : "bot"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {message.isHtml ? (
                              <div
                                className="message-content html-content"
                                dangerouslySetInnerHTML={{
                                  __html: message.content,
                                }}
                              />
                            ) : (
                              <div className="message-content">
                                {message.content}
                              </div>
                            )}
                            <div className="message-time">
                              {formatTime(message.timestamp)}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isLoading && (
                        <motion.div
                          className="message bot"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {activeTab === "orders" && (
                    <div className="orders-tab">
                      <div className="tab-header">
                        <h3>Check Order Status</h3>
                        <p>
                          Enter your order number to check its current status
                        </p>
                      </div>

                      <form
                        className="order-lookup-form"
                        onSubmit={handleOrderStatusCheck}
                      >
                        <input
                          type="text"
                          placeholder="Enter order number (e.g., ORD123456)"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          className="input-field"
                        />
                        <button
                          type="submit"
                          className="submit-button"
                          disabled={!orderNumber.trim() || isLoading}
                        >
                          {isLoading ? "Checking..." : "Check Status"}
                        </button>
                      </form>

                      <div className="order-info-card">
                        <div className="info-icon">
                          <InfoIcon />
                        </div>
                        <div className="info-content">
                          <h4>Order Tracking</h4>
                          <p>
                            You can find your order number in the confirmation
                            email you received after placing your order.
                          </p>
                        </div>
                      </div>

                      <div className="order-status-info">
                        <h4>Order Status Guide</h4>
                        <div className="status-list">
                          <div className="status-item">
                            <span className="status-badge processing">
                              Processing
                            </span>
                            <span className="status-description">
                              Your order has been received and is being
                              processed
                            </span>
                          </div>
                          <div className="status-item">
                            <span className="status-badge packed">Packed</span>
                            <span className="status-description">
                              Your order has been packed and is ready for
                              shipping
                            </span>
                          </div>
                          <div className="status-item">
                            <span className="status-badge shipped">
                              Shipped
                            </span>
                            <span className="status-description">
                              Your order is on its way to you
                            </span>
                          </div>
                          <div className="status-item">
                            <span className="status-badge delivered">
                              Delivered
                            </span>
                            <span className="status-description">
                              Your order has been delivered
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "pottery" && (
                    <div className="pottery-tab">
                      <div className="tab-header">
                        <h3>Multan Pottery Collection</h3>
                        <p>
                          Discover the rich heritage and craftsmanship of Multan
                          pottery
                        </p>
                      </div>

                      <div className="pottery-info-card">
                        <div className="pottery-image">
                          <img
                            src="/placeholder.svg?height=180&width=300"
                            alt="Multan Pottery"
                          />
                        </div>
                        <div className="pottery-description">
                          <h4>The Art of Multan Pottery</h4>
                          <p>
                            Multan pottery is one of Pakistan's most
                            distinguished craft traditions, dating back over
                            5,000 years to the Indus Valley Civilization. The
                            city of Multan in Punjab province is renowned for
                            its distinctive blue pottery (Nila Kashi) featuring
                            intricate floral and geometric patterns.
                          </p>
                          <p>
                            Each piece is meticulously hand-crafted by skilled
                            artisans who have inherited techniques passed down
                            through generations. The distinctive cobalt blue
                            designs on white backgrounds are created using
                            natural pigments and traditional glazing methods
                            that give Multan pottery its characteristic shine
                            and durability.
                          </p>
                        </div>
                      </div>

                      <div className="pottery-features">
                        <h4>Distinctive Features</h4>
                        <div className="features-grid">
                          <div className="feature-item">
                            <div className="feature-icon">
                              <PotteryIcon />
                            </div>
                            <div className="feature-text">
                              <h5>Hand-Painted Designs</h5>
                              <p>
                                Each piece features unique hand-painted patterns
                              </p>
                            </div>
                          </div>
                          <div className="feature-item">
                            <div className="feature-icon">
                              <PotteryIcon />
                            </div>
                            <div className="feature-text">
                              <h5>Traditional Techniques</h5>
                              <p>Created using centuries-old methods</p>
                            </div>
                          </div>
                          <div className="feature-item">
                            <div className="feature-icon">
                              <PotteryIcon />
                            </div>
                            <div className="feature-text">
                              <h5>Natural Materials</h5>
                              <p>
                                Made from locally-sourced clay and natural
                                pigments
                              </p>
                            </div>
                          </div>
                          <div className="feature-item">
                            <div className="feature-icon">
                              <PotteryIcon />
                            </div>
                            <div className="feature-text">
                              <h5>Cultural Significance</h5>
                              <p>
                                Represents Pakistan's rich artistic heritage
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pottery-categories">
                        <h4>Our Collection</h4>
                        <div className="categories-grid">
                          <div className="category-item">
                            <img
                              src="/placeholder.svg?height=100&width=100"
                              alt="Vases"
                            />
                            <div className="category-name">Vases</div>
                          </div>
                          <div className="category-item">
                            <img
                              src="/placeholder.svg?height=100&width=100"
                              alt="Plates"
                            />
                            <div className="category-name">Plates</div>
                          </div>
                          <div className="category-item">
                            <img
                              src="/placeholder.svg?height=100&width=100"
                              alt="Bowls"
                            />
                            <div className="category-name">Bowls</div>
                          </div>
                          <div className="category-item">
                            <img
                              src="/placeholder.svg?height=100&width=100"
                              alt="Decorative Items"
                            />
                            <div className="category-name">
                              Decorative Items
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "help" && (
                    <div className="help-tab">
                      <div className="tab-header">
                        <h3>How Can We Help?</h3>
                        <p>Get assistance with orders, products, and more</p>
                      </div>

                      <div className="help-cards">
                        <div className="help-card" onClick={handleOrderInfo}>
                          <div className="help-card-icon">
                            <PackageIcon />
                          </div>
                          <div className="help-card-content">
                            <h4>How to Place an Order</h4>
                            <p>
                              Learn the step-by-step process of placing an order
                            </p>
                          </div>
                        </div>

                        <div className="help-card" onClick={handleCartQuery}>
                          <div className="help-card-icon">
                            <ShoppingCartIcon />
                          </div>
                          <div className="help-card-content">
                            <h4>Check Your Cart</h4>
                            <p>View the items in your shopping cart</p>
                          </div>
                        </div>

                        <div
                          className="help-card"
                          onClick={handleMultanPotteryInfo}
                        >
                          <div className="help-card-icon">
                            <PotteryIcon />
                          </div>
                          <div className="help-card-content">
                            <h4>About Multan Pottery</h4>
                            <p>Learn about our authentic pottery collection</p>
                          </div>
                        </div>

                        <div
                          className="help-card"
                          onClick={() => handleTabChange("orders")}
                        >
                          <div className="help-card-icon">
                            <InfoIcon />
                          </div>
                          <div className="help-card-content">
                            <h4>Track Your Order</h4>
                            <p>Check the status of your existing orders</p>
                          </div>
                        </div>
                      </div>

                      <div className="faq-section">
                        <h4>Frequently Asked Questions</h4>
                        <div className="faq-item">
                          <div className="faq-question">
                            What payment methods do you accept?
                          </div>
                          <div className="faq-answer">
                            We accept credit/debit cards, PayPal, and bank
                            transfers.
                          </div>
                        </div>
                        <div className="faq-item">
                          <div className="faq-question">
                            How long does shipping take?
                          </div>
                          <div className="faq-answer">
                            Standard shipping takes 3-5 business days within the
                            country.
                          </div>
                        </div>
                        <div className="faq-item">
                          <div className="faq-question">
                            What is your return policy?
                          </div>
                          <div className="faq-answer">
                            We offer a 30-day return policy for most items.
                            Please check our Returns page for details.
                          </div>
                        </div>
                        <div className="faq-item">
                          <div className="faq-question">
                            Are your pottery items food-safe?
                          </div>
                          <div className="faq-answer">
                            Yes, all our Multan pottery dining items are
                            food-safe and lead-free.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === "chat" && (
                  <div className="chatbot-footer">
                    {showSuggestions && (
                      <div className="quick-suggestions">
                        <motion.button
                          className="suggestion-chip"
                          onClick={() =>
                            handleSuggestionClick(
                              "Tell me about Multan pottery"
                            )
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          About Multan pottery
                        </motion.button>
                        <motion.button
                          className="suggestion-chip"
                          onClick={() =>
                            handleSuggestionClick("What's in my cart?")
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          What's in my cart?
                        </motion.button>
                        <motion.button
                          className="suggestion-chip"
                          onClick={() =>
                            handleSuggestionClick("Check my order status")
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Check order status
                        </motion.button>
                      </div>
                    )}

                    <form className="message-form" onSubmit={handleSendMessage}>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        className="input-field"
                      />
                      <motion.button
                        type="submit"
                        className="send-button"
                        disabled={!inputMessage.trim() || isLoading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <SendIcon />
                      </motion.button>
                    </form>
                  </div>
                )}
              </>
            )}

            {/* Internal CSS */}
            <style jsx>{`
              .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                  Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
                  "Helvetica Neue", sans-serif;
              }

              .chatbot-floating-btn {
                border-radius: 50%;
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                background-color: #1e88e5;
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
              }

              .chatbot-floating-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
              }

              .chatbot-modal {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 380px;
                max-width: 90vw;
                height: 550px;
                max-height: 80vh;
                border-radius: 16px;
                background-color: white;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
              }

              .chatbot-modal.minimized {
                height: 60px;
              }

              .chatbot-header {
                background: linear-gradient(135deg, #1976d2, #2196f3);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              }

              .header-content {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .header-text {
                display: flex;
                flex-direction: column;
              }

              .chatbot-title {
                font-weight: 600;
                font-size: 16px;
              }

              .chatbot-subtitle {
                font-size: 12px;
                opacity: 0.8;
              }

              .header-actions {
                display: flex;
                gap: 8px;
              }

              .header-button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
              }

              .header-button:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }

              .chatbot-tabs {
                display: flex;
                background-color: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
              }

              .tab-button {
                flex: 1;
                padding: 12px 8px;
                background: none;
                border: none;
                font-size: 13px;
                font-weight: 500;
                color: #666;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
              }

              .tab-button.active {
                color: #1e88e5;
              }

              .tab-button.active::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: #1e88e5;
                animation: slideInLeft 0.3s forwards;
              }

              @keyframes slideInLeft {
                from {
                  transform: scaleX(0);
                }
                to {
                  transform: scaleX(1);
                }
              }

              .tab-content {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
              }

              .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                background-color: #f5f7f9;
                display: flex;
                flex-direction: column;
                gap: 12px;
              }

              .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
                position: relative;
              }

              .message.user {
                background: linear-gradient(135deg, #1976d2, #2196f3);
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }

              .message.bot {
                background-color: white;
                color: #333;
                margin-right: auto;
                border-bottom-left-radius: 5px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
              }

              .message-content {
                margin-bottom: 5px;
              }

              .message-time {
                font-size: 10px;
                opacity: 0.7;
                text-align: right;
                margin-top: 4px;
              }

              .html-content {
                padding: 0;
              }

              .typing-indicator {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 5px;
              }

              .dot {
                width: 8px;
                height: 8px;
                background-color: #aaa;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
              }

              .dot:nth-child(2) {
                animation-delay: 0.2s;
              }

              .dot:nth-child(3) {
                animation-delay: 0.4s;
              }

              @keyframes pulse {
                0% {
                  transform: scale(0.8);
                  opacity: 0.5;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 1;
                }
                100% {
                  transform: scale(0.8);
                  opacity: 0.5;
                }
              }

              .chatbot-footer {
                padding: 10px 15px 15px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                flex-direction: column;
                gap: 10px;
                background-color: white;
              }

              .quick-suggestions {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                padding-bottom: 8px;
                scrollbar-width: none;
              }

              .quick-suggestions::-webkit-scrollbar {
                display: none;
              }

              .suggestion-chip {
                background-color: #f0f2f5;
                border: 1px solid #e0e0e0;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 12px;
                white-space: nowrap;
                cursor: pointer;
                transition: background-color 0.2s;
              }

              .suggestion-chip:hover {
                background-color: #e3e6ea;
              }

              .message-form {
                display: flex;
                gap: 8px;
              }

              .input-field {
                flex: 1;
                border: 1px solid #e0e0e0;
                border-radius: 20px;
                padding: 10px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
              }

              .input-field:focus {
                border-color: #1e88e5;
                box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);
              }

              .send-button {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #1e88e5;
                color: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s;
              }

              .send-button:hover {
                background-color: #1976d2;
              }

              .send-button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
              }

              /* Order status card styles */
              .order-status-card {
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin: 5px 0;
              }

              .order-status-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                border-bottom: 1px solid #eee;
              }

              .order-id {
                font-weight: 600;
                font-size: 14px;
              }

              .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              }

              .status-badge.processing {
                background-color: #fff8e1;
                color: #ff8f00;
              }

              .status-badge.packed {
                background-color: #e3f2fd;
                color: #1976d2;
              }

              .status-badge.shipped {
                background-color: #e8f5e9;
                color: #388e3c;
              }

              .status-badge.delivered {
                background-color: #e8f5e9;
                color: #388e3c;
              }

              .status-badge.cancelled {
                background-color: #ffebee;
                color: #d32f2f;
              }

              .order-status-details {
                padding: 15px;
              }

              .status-timeline {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                position: relative;
              }

              .status-timeline::before {
                content: "";
                position: absolute;
                top: 15px;
                left: 15px;
                right: 15px;
                height: 2px;
                background-color: #e0e0e0;
                z-index: 1;
              }

              .timeline-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                z-index: 2;
                flex: 1;
              }

              .timeline-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #e0e0e0;
                margin-bottom: 8px;
                border: 3px solid white;
                box-shadow: 0 0 0 1px #e0e0e0;
              }

              .timeline-item.active .timeline-icon {
                background-color: #4caf50;
                box-shadow: 0 0 0 1px #4caf50;
              }

              .timeline-text {
                font-size: 12px;
                color: #666;
                text-align: center;
              }

              .timeline-item.active .timeline-text {
                color: #4caf50;
                font-weight: 500;
              }

              .order-message {
                background-color: #f5f5f5;
                padding: 12px;
                border-radius: 8px;
                font-size: 13px;
                color: #555;
                margin-top: 10px;
              }

              /* Cart summary card styles */
              .cart-summary-card {
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin: 5px 0;
              }

              .cart-header {
                background-color: #f5f5f5;
                padding: 12px 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid #eee;
              }

              .cart-title {
                font-weight: 600;
                color: #333;
              }

              .cart-details {
                padding: 15px;
              }

              .cart-item-count {
                font-weight: 500;
                margin-bottom: 5px;
              }

              .cart-total {
                color: #1e88e5;
                font-weight: 600;
                margin-bottom: 15px;
              }

              .cart-item {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 13px;
                align-items: center;
                gap: 10px;
              }

              .item-image {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                overflow: hidden;
                flex-shrink: 0;
              }

              .item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .item-details {
                flex: 1;
              }

              .item-name {
                font-weight: 500;
                margin-bottom: 4px;
              }

              .item-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #666;
              }

              .cart-actions {
                padding: 15px;
                display: flex;
                gap: 10px;
                background-color: #f9f9f9;
                border-top: 1px solid #eee;
              }

              .view-cart-btn,
              .checkout-btn {
                flex: 1;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
              }

              .view-cart-btn {
                background-color: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
              }

              .view-cart-btn:hover {
                background-color: #e0e0e0;
              }

              .checkout-btn {
                background-color: #1e88e5;
                color: white;
              }

              .checkout-btn:hover {
                background-color: #1976d2;
              }

              /* Info card styles */
              .info-card {
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin: 5px 0;
              }

              .info-header {
                background-color: #e3f2fd;
                padding: 12px 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #1976d2;
                border-bottom: 1px solid #bbdefb;
              }

              .info-title {
                font-weight: 600;
                color: #1976d2;
              }

              .info-steps {
                padding: 15px;
              }

              .step {
                display: flex;
                margin-bottom: 12px;
                align-items: flex-start;
              }

              .step-number {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #1e88e5;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                margin-right: 10px;
                flex-shrink: 0;
              }

              .step-text {
                font-size: 13px;
                color: #555;
                padding-top: 3px;
              }

              .info-footer {
                padding: 10px 15px;
                background-color: #f9f9f9;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
              }

              /* Pottery info styles */
              .pottery-info {
                margin: 5px 0;
              }

              .pottery-content {
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 15px;
              }

              .pottery-image {
                text-align: center;
              }

              .pottery-image img {
                max-width: 100%;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }

              .pottery-description {
                font-size: 13px;
                color: #555;
                line-height: 1.5;
              }

              .pottery-description h4 {
                margin: 10px 0 5px;
                color: #333;
                font-size: 14px;
              }

              .pottery-description ul {
                margin: 5px 0;
                padding-left: 20px;
              }

              .pottery-description li {
                margin-bottom: 5px;
              }

              .pottery-categories {
                display: flex;
                gap: 10px;
                padding: 15px;
                overflow-x: auto;
                background-color: #f9f9f9;
                border-top: 1px solid #eee;
              }

              .category {
                background-color: white;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 13px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
              }

              .category-name {
                font-weight: 500;
                color: #333;
              }

              /* Pottery tab styles */
              .pottery-tab {
                padding: 15px;
                overflow-y: auto;
                height: 100%;
              }

              .pottery-info-card {
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
              }

              .pottery-info-card .pottery-image {
                width: 100%;
                height: 180px;
                overflow: hidden;
              }

              .pottery-info-card .pottery-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0;
                box-shadow: none;
              }

              .pottery-info-card .pottery-description {
                padding: 15px;
              }

              .pottery-info-card h4 {
                margin: 0 0 10px;
                font-size: 16px;
                color: #333;
              }

              .pottery-features {
                margin-bottom: 20px;
              }

              .pottery-features h4 {
                margin: 0 0 15px;
                font-size: 16px;
                color: #333;
              }

              .features-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }

              .feature-item {
                display: flex;
                align-items: center;
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
              }

              .feature-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #e3f2fd;
                color: #1976d2;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                flex-shrink: 0;
              }

              .feature-text h5 {
                margin: 0 0 5px;
                font-size: 14px;
                color: #333;
              }

              .feature-text p {
                margin: 0;
                font-size: 12px;
                color: #666;
              }

              .pottery-categories h4 {
                margin: 0 0 15px;
                font-size: 16px;
                color: #333;
              }

              .categories-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }

              .category-item {
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                text-align: center;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
              }

              .category-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }

              .category-item img {
                width: 100%;
                height: 100px;
                object-fit: cover;
              }

              .category-item .category-name {
                padding: 10px;
                font-weight: 500;
                font-size: 14px;
                color: #333;
              }

              /* Orders tab styles */
              .orders-tab,
              .help-tab {
                padding: 15px;
                overflow-y: auto;
                height: 100%;
              }

              .tab-header {
                margin-bottom: 20px;
              }

              .tab-header h3 {
                margin: 0 0 5px;
                font-size: 18px;
                color: #333;
              }

              .tab-header p {
                margin: 0;
                font-size: 14px;
                color: #666;
              }

              .order-lookup-form {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
              }

              .submit-button {
                background-color: #1e88e5;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
              }

              .submit-button:hover {
                background-color: #1976d2;
              }

              .submit-button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
              }

              .order-info-card {
                display: flex;
                background-color: #e3f2fd;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 20px;
                align-items: center;
              }

              .info-icon {
                color: #1976d2;
                margin-right: 12px;
                flex-shrink: 0;
              }

              .info-content h4 {
                margin: 0 0 5px;
                font-size: 14px;
                color: #1976d2;
              }

              .info-content p {
                margin: 0;
                font-size: 13px;
                color: #555;
              }

              .order-status-info {
                margin-top: 20px;
              }

              .order-status-info h4 {
                margin: 0 0 10px;
                font-size: 16px;
                color: #333;
              }

              .status-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }

              .status-item {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .status-description {
                font-size: 13px;
                color: #555;
              }

              /* Help tab styles */
              .help-cards {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
              }

              .help-card {
                display: flex;
                align-items: center;
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
              }

              .help-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }

              .help-card-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #e3f2fd;
                color: #1976d2;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                flex-shrink: 0;
              }

              .help-card-content h4 {
                margin: 0 0 5px;
                font-size: 14px;
                color: #333;
              }

              .help-card-content p {
                margin: 0;
                font-size: 12px;
                color: #666;
              }

              .faq-section {
                margin-top: 20px;
              }

              .faq-section h4 {
                margin: 0 0 15px;
                font-size: 16px;
                color: #333;
              }

              .faq-item {
                background-color: white;
                border-radius: 8px;
                margin-bottom: 10px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
              }

              .faq-question {
                padding: 12px 15px;
                font-weight: 500;
                font-size: 14px;
                color: #333;
                background-color: #f9f9f9;
                border-bottom: 1px solid #eee;
              }

              .faq-answer {
                padding: 12px 15px;
                font-size: 13px;
                color: #555;
              }

              /* Responsive adjustments */
              @media (max-width: 480px) {
                .chatbot-modal {
                  width: 100%;
                  max-width: 100%;
                  bottom: 0;
                  right: 0;
                  border-radius: 16px 16px 0 0;
                  height: 80vh;
                }

                .chatbot-floating-btn {
                  bottom: 20px;
                  right: 20px;
                }

                .help-cards,
                .features-grid,
                .categories-grid {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedOrderChatbot;

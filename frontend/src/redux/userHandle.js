import axios from "axios";
import {
  authRequest,
  authSuccess,
  authFailed,
  authError,
  stuffAdded,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  productSuccess,
  productDetailsSuccess,
  getProductDetailsFailed,
  getProductsFailed,
  setFilteredProducts,
  getSearchFailed,
  sellerProductSuccess,
  getSellerProductsFailed,
  stuffUpdated,
  updateFailed,
  getCustomersListFailed,
  customersListSuccess,
  getSpecificProductsFailed,
  specificProductSuccess,
  updateCurrentUser,
  getSellerStatsSuccess,
  getSellerStatsFailed,
  getRequestStatus,
  getFailedStatus,
  getErrorStatus,
  stuffUpdatedStatus,
  updateFailedStatus,
} from "./userSlice";

// Helper function to ensure arrays have valid keys
const ensureValidIds = (array, prefix = "item") => {
  if (!Array.isArray(array)) return array;

  return array.map((item, index) => {
    if (!item) return { _id: `${prefix}-${index}` };
    return {
      ...item,
      _id: item._id || `${prefix}-${index}`,
    };
  });
};

export const authUser = (fields, role, mode) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${role}${mode}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.role) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const addStuff = (address, fields) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${address}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded());

      // If this is an order, update product quantities
      if (address === "newOrder" && fields.orderedProducts) {
        const products = Array.isArray(fields.orderedProducts)
          ? fields.orderedProducts
          : [fields.orderedProducts];

        // Update inventory for each product
        products.forEach((product) => {
          if (product._id && product.quantity) {
            dispatch(updateProductInventory(product._id, product.quantity));
          }
        });
      }
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const updateStuff = (fields, id, address) => async (dispatch) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.message) {
      dispatch(updateFailed(result.data.message));
    } else {
      dispatch(stuffUpdated());

      // If we're updating product quantity, refresh the product details
      if (address === "updateProductQuantity") {
        dispatch(getProductDetails(id));
      }
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDeleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateCustomer = (fields, id) => async (dispatch) => {
  try {
    dispatch(updateCurrentUser(fields));

    const newFields = { ...fields };
    delete newFields.token;

    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/CustomerUpdate/${id}`,
      newFields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (result.data.message) {
      dispatch(updateFailed(result.data.message));
      return false;
    } else {
      dispatch(stuffUpdated());
      return true;
    }
  } catch (error) {
    dispatch(getError(error));
    return false;
  }
};

export const getProductsbySeller = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/getSellerProducts/${id}`
    );
    if (result.data.message) {
      dispatch(getSellerProductsFailed(result.data.message));
    } else {
      const validatedData = ensureValidIds(result.data, "seller-product");
      dispatch(sellerProductSuccess(validatedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getProducts = () => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/getProducts`
    );
    if (result.data.message) {
      dispatch(getProductsFailed(result.data.message));
    } else {
      const validatedData = ensureValidIds(result.data, "product");
      dispatch(productSuccess(validatedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/getProductDetail/${id}`
    );
    if (result.data.message) {
      dispatch(getProductDetailsFailed(result.data.message));
    } else {
      // Process product details
      const processedData = { ...result.data };

      // Ensure reviews have valid IDs
      if (processedData && processedData.reviews) {
        processedData.reviews = ensureValidIds(processedData.reviews, "review");
      }

      dispatch(productDetailsSuccess(processedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getCustomers = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getCustomersListFailed(result.data.message));
    } else {
      const validatedData = ensureValidIds(result.data, "customer");
      dispatch(customersListSuccess(validatedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSpecificProducts = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getSpecificProductsFailed(result.data.message));
    } else {
      const validatedData = ensureValidIds(result.data, "specific-product");
      dispatch(specificProductSuccess(validatedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSearchedProducts = (address, key) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${key}`
    );
    if (result.data.message) {
      dispatch(getSearchFailed(result.data.message));
    } else {
      const validatedData = ensureValidIds(result.data, "search-result");
      dispatch(setFilteredProducts(validatedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSellerStats = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Seller/Stats/${id}`
    );
    if (result.data.message) {
      dispatch(getSellerStatsFailed(result.data.message));
    } else {
      // Process stats data
      const processedData = { ...result.data };

      // Process any arrays in the stats data
      if (processedData) {
        // Handle common array properties that might be in stats
        ["products", "customers", "orders", "reviews"].forEach((prop) => {
          if (Array.isArray(processedData[prop])) {
            processedData[prop] = ensureValidIds(
              processedData[prop],
              `stat-${prop}`
            );
          }
        });

        // Handle nested arrays if needed
        if (processedData.salesData && Array.isArray(processedData.salesData)) {
          processedData.salesData = ensureValidIds(
            processedData.salesData,
            "sales-data"
          );
        }
      }

      dispatch(getSellerStatsSuccess(processedData));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

// Function to update product inventory after purchase
export const updateProductInventory =
  (productId, purchasedQuantity) => async (dispatch) => {
    try {
      // First get the current product details to calculate new quantity
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/getProductDetail/${productId}`
      );

      if (result.data && !result.data.message) {
        const currentProduct = result.data;
        const currentQuantity = currentProduct.quantity || 0;
        const updatedQuantity = Math.max(
          0,
          currentQuantity - purchasedQuantity
        );

        // Update the product with new quantity
        const fields = {
          quantity: updatedQuantity,
          isInStock: updatedQuantity > 0,
        };

        dispatch(updateStuff(fields, productId, "updateProductQuantity"));
      }
    } catch (error) {
      console.error("Error updating product inventory:", error);
    }
  };

// Function to prepare checkout data and navigate
export const prepareCheckout = (currentUser, navigate) => async (dispatch) => {
  try {
    // Validate cart and shipping data
    if (!currentUser.cartDetails || currentUser.cartDetails.length === 0) {
      return { success: false, message: "Your cart is empty" };
    }

    if (!currentUser.shippingData || !currentUser.shippingData.address) {
      return { success: false, message: "Shipping information is missing" };
    }

    // Update customer data in database
    const updateSuccess = await dispatch(
      updateCustomer(currentUser, currentUser._id)
    );

    if (updateSuccess) {
      return { success: true };
    } else {
      return { success: false, message: "Failed to update customer data" };
    }
  } catch (error) {
    console.error("Checkout preparation error:", error);
    return { success: false, message: "An error occurred during checkout" };
  }
};

export const getOrderStatus = (orderId) => async (dispatch) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/getStatus/${orderId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching order status:", errorData);
      return null;
    }

    const data = await response.json();
    return data.orderStatus;
  } catch (error) {
    console.error("Error in getOrderStatus:", error);
    return null;
  }
};

export const updateOrderStatus = (orderId, newStatus) => async (dispatch) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/updateOrderStatus/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating order status:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return false;
  }
};

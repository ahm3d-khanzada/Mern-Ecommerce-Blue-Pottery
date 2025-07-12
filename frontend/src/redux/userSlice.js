import { createSlice } from "@reduxjs/toolkit"
import jwtDecode from "jwt-decode"

const initialState = {
  status: "idle",
  loading: false,
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  currentRole: (JSON.parse(localStorage.getItem("user")) || {}).role || null,
  currentToken: (JSON.parse(localStorage.getItem("user")) || {}).token || null,
  isLoggedIn: false,
  error: null,
  response: null,
  sellerStats: null,
  responseStats: null,

  responseReview: null,
  responseProducts: null,
  responseSellerProducts: null,
  responseSpecificProducts: null,
  responseDetails: null,
  responseSearch: null,
  responseCustomersList: null,

  productData: [],
  sellerProductData: [],
  specificProductData: [],
  productDetails: {},
  productDetailsCart: {},
  filteredProducts: [],
  customersList: [],
  checkoutError: null,
}

const updateCartDetailsInLocalStorage = (cartDetails) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {}
  currentUser.cartDetails = cartDetails
  localStorage.setItem("user", JSON.stringify(currentUser))
}

export const updateShippingDataInLocalStorage = (shippingData) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {}
  const updatedUser = {
    ...currentUser,
    shippingData: shippingData,
  }
  localStorage.setItem("user", JSON.stringify(updatedUser))
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = "loading"
    },
    underControl: (state) => {
      state.status = "idle"
      state.response = null
    },
    stuffAdded: (state) => {
      state.status = "added"
      state.response = null
      state.error = null

      // If this is an order, we want to make sure the cart is updated in localStorage
      if (state.currentUser && state.currentUser.cartDetails) {
        updateCartDetailsInLocalStorage(state.currentUser.cartDetails)
      }
    },
    stuffUpdated: (state) => {
      state.status = "updated"
      state.response = null
      state.error = null
    },
    updateFailed: (state, action) => {
      state.status = "failed"
      state.responseReview = action.payload
      state.error = null
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    authSuccess: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload))
      state.currentUser = action.payload
      state.currentRole = action.payload.role
      state.currentToken = action.payload.token
      state.status = "success"
      state.response = null
      state.error = null
      state.isLoggedIn = true
    },
    removeFromCart: (state, action) => {
      if (!state.currentUser.cartDetails) {
        state.currentUser.cartDetails = []
        return
      }

      const existingProduct = state.currentUser.cartDetails.find((cartItem) => cartItem._id === action.payload._id)

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1
        } else {
          const index = state.currentUser.cartDetails.findIndex((cartItem) => cartItem._id === action.payload._id)
          if (index !== -1) {
            state.currentUser.cartDetails.splice(index, 1)
          }
        }
      }

      updateCartDetailsInLocalStorage(state.currentUser.cartDetails)
    },

    removeSpecificProduct: (state, action) => {
      if (!state.currentUser.cartDetails) {
        state.currentUser.cartDetails = []
        return
      }

      const productIdToRemove = action.payload
      const updatedCartDetails = state.currentUser.cartDetails.filter((cartItem) => cartItem._id !== productIdToRemove)

      state.currentUser.cartDetails = updatedCartDetails
      updateCartDetailsInLocalStorage(updatedCartDetails)
    },

    fetchProductDetailsFromCart: (state, action) => {
      if (!state.currentUser.cartDetails) {
        state.currentUser.cartDetails = []
        state.productDetailsCart = null
        return
      }

      const productIdToFetch = action.payload
      const productInCart = state.currentUser.cartDetails.find((cartItem) => cartItem._id === productIdToFetch)

      if (productInCart) {
        state.productDetailsCart = { ...productInCart }
      } else {
        state.productDetailsCart = null
      }
    },

    removeAllFromCart: (state) => {
      state.currentUser.cartDetails = []
      updateCartDetailsInLocalStorage([])
    },

    setCheckoutError: (state, action) => {
      state.checkoutError = action.payload
    },

    clearCheckoutError: (state) => {
      state.checkoutError = null
    },

    authFailed: (state, action) => {
      state.status = "failed"
      state.response = action.payload
      state.error = null
    },
    authError: (state, action) => {
      state.status = "error"
      state.response = null
      state.error = action.payload
    },
    authLogout: (state) => {
      localStorage.removeItem("user")
      state.status = "idle"
      state.loading = false
      state.currentUser = null
      state.currentRole = null
      state.currentToken = null
      state.error = null
      state.response = true
      state.isLoggedIn = false
    },

    isTokenValid: (state) => {
      const decodedToken = jwtDecode(state.currentToken)

      if (state.currentToken && decodedToken.exp * 1000 > Date.now()) {
        state.isLoggedIn = true
      } else {
        localStorage.removeItem("user")
        state.currentUser = null
        state.currentRole = null
        state.currentToken = null
        state.status = "idle"
        state.response = null
        state.error = null
        state.isLoggedIn = false
      }
    },

    getRequest: (state) => {
      state.loading = true
    },
    getFailed: (state, action) => {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    getDeleteSuccess: (state) => {
      state.status = "deleted"
      state.loading = false
      state.error = null
      state.response = null
    },

    productSuccess: (state, action) => {
      state.productData = action.payload
      state.responseProducts = null
      state.loading = false
      state.error = null
    },
    getProductsFailed: (state, action) => {
      state.responseProducts = action.payload
      state.loading = false
      state.error = null
    },

    sellerProductSuccess: (state, action) => {
      state.sellerProductData = action.payload
      state.responseSellerProducts = null
      state.loading = false
      state.error = null
    },
    getSellerProductsFailed: (state, action) => {
      state.responseSellerProducts = action.payload
      state.loading = false
      state.error = null
    },

    specificProductSuccess: (state, action) => {
      state.specificProductData = action.payload
      state.responseSpecificProducts = null
      state.loading = false
      state.error = null
    },
    getSpecificProductsFailed: (state, action) => {
      state.responseSpecificProducts = action.payload
      state.loading = false
      state.error = null
    },

    productDetailsSuccess: (state, action) => {
      state.productDetails = action.payload
      state.responseDetails = null
      state.loading = false
      state.error = null
    },
    getProductDetailsFailed: (state, action) => {
      state.responseDetails = action.payload
      state.loading = false
      state.error = null
    },

    customersListSuccess: (state, action) => {
      state.customersList = action.payload
      state.responseCustomersList = null
      state.loading = false
      state.error = null
    },

    getCustomersListFailed: (state, action) => {
      state.responseCustomersList = action.payload
      state.loading = false
      state.error = null
    },

    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload
      state.responseSearch = null
      state.loading = false
      state.error = null
    },
    getSearchFailed: (state, action) => {
      state.responseSearch = action.payload
      state.loading = false
      state.error = null
    },

    getSellerStatsSuccess: (state, action) => {
      state.sellerStats = action.payload
      state.responseStats = null
      state.loading = false
      state.error = null
    },
    getSellerStatsFailed: (state, action) => {
      state.responseStats = action.payload
      state.loading = false
      state.error = null
    },
    addToCart: (state, action) => {
      if (!state.currentUser.cartDetails) {
        state.currentUser.cartDetails = []
      }

      const existingProduct = state.currentUser.cartDetails.find((cartItem) => cartItem._id === action.payload._id)

      if (existingProduct) {
        // If product exists, add the new quantity to the existing quantity
        existingProduct.quantity += action.payload.quantity || 1
      } else {
        // If product doesn't exist, add it with the specified quantity or default to 1
        const newCartItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
        }
        state.currentUser.cartDetails.push(newCartItem)
      }

      updateCartDetailsInLocalStorage(state.currentUser.cartDetails)
    },
    addToCartCustom: (state, action) => {
      const newItem = action.payload
      const existingItemIndex = state.currentUser.cartDetails.findIndex((item) => item._id === newItem._id)

      if (existingItemIndex !== -1) {
        // If the item already exists in the cart, update the quantity
        state.currentUser.cartDetails[existingItemIndex].quantity += newItem.quantity
      } else {
        // If the item is not in the cart, add it to the cart
        state.currentUser.cartDetails.push(newItem)
      }
    },
  },
  getRequestStatus: (state) => {
    state.loading = true
    state.error = null
    state.message = null
  },
  getFailedStatus: (state, action) => {
    state.loading = false
    state.error = action.payload
    state.message = null
  },
  getErrorStatus: (state, action) => {
    state.loading = false
    state.error = action.payload
    state.message = null
  },
  stuffUpdatedStatus: (state) => {
    state.loading = false
    state.error = null
    state.message = "Update successful!"
  },
  updateFailedStatus: (state, action) => {
    state.loading = false
    state.error = action.payload
    state.message = null
  },
})

export const {
  authRequest,
  underControl,
  stuffAdded,
  stuffUpdated,
  updateFailed,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  isTokenValid,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  productSuccess,
  sellerProductSuccess,
  productDetailsSuccess,
  getProductsFailed,
  getSellerProductsFailed,
  getProductDetailsFailed,
  getFailed,
  getError,
  getSearchFailed,
  setFilteredProducts,
  getCustomersListFailed,
  customersListSuccess,
  getSpecificProductsFailed,
  specificProductSuccess,
  addToCart,
  addToCartCustom,
  removeFromCart,
  removeSpecificProduct,
  removeAllFromCart,
  fetchProductDetailsFromCart,
  updateCurrentUser,
  getSellerStatsSuccess,
  getSellerStatsFailed,
  setCheckoutError,
  clearCheckoutError,
  getRequestStatus,
  getFailedStatus,
  getErrorStatus,
  stuffUpdatedStatus,
  updateFailedStatus,
} = userSlice.actions
export const userReducer = userSlice.reducer


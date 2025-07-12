const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

const {
  sellerRegister,
  sellerLogIn,
  sellerStats,
  approved,
  Sellers,
  UpdateCustomization,
} = require("../controllers/sellerController.js");

const {
  uploadVideo,
  upload,
  DisplayVideo,
  LikeVideo,
  DisplayUserVideo,
  DeleteUserVideo,
  UpdateUserVideo,
} = require("../controllers/videoController.js");

const {
  productCreate,
  getProducts,
  getProductDetail,
  searchProduct,
  searchProductbyCategory,
  searchProductbySubCategory,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  deleteProducts,
  deleteProductReview,
  deleteAllProductReviews,
  addReview,
  getInterestedCustomers,
  getAddedToCartProducts,
} = require("../controllers/productController.js");

const {
  customerRegister,
  customerLogIn,
  getCartDetail,
  cartUpdate,
} = require("../controllers/customerController.js");

const {
  newOrder,
  getOrderedProductsByCustomer,
  getOrderedProductsBySeller,
  getStatus,
  updateOrderStatus,
} = require("../controllers/orderController.js");

const {
  customize,
  CustomizedEnabled,
  updateStatus,
  CustomOrders,
  CustomPricedOrders,
} = require("../controllers/customPotteryController.js");

//custom pottery
router.post("/CustomizePottery", customize);
router.get("/EnableCustomized", CustomizedEnabled);
router.get("/CustomOrders", CustomOrders);
router.put("/update-status/:id", updateStatus);
router.get("/CustomPricedO", CustomPricedOrders);

//Video Upload
router.post("/video/upload", upload.single("video"), uploadVideo);
router.get("/video/Display", DisplayVideo);
router.patch("/video/Like/:id", LikeVideo);
router.post("/video/User", DisplayUserVideo);
router.delete("/video/Remove/:userId/:videoId", DeleteUserVideo);
router.put("/video/Update", UpdateUserVideo);

// Seller
router.post("/SellerRegister", sellerRegister);
router.post("/SellerLogin", sellerLogIn);
router.get("/Seller/Stats/:id", sellerStats);
router.get("/Sellers", Sellers);
router.patch("/Approved/:id", approved);
router.patch("/CustomizationEnabling/:id", UpdateCustomization);

// Product
router.post("/ProductCreate", productCreate);
router.get("/getSellerProducts/:id", getSellerProducts);
router.get("/getProducts", getProducts);
router.get("/getProductDetail/:id", getProductDetail);
router.get("/getInterestedCustomers/:id", getInterestedCustomers);
router.get("/getAddedToCartProducts/:id", getAddedToCartProducts);

router.put("/ProductUpdate/:id", updateProduct);
router.put("/addReview/:id", addReview);

router.get("/searchProduct/:key", searchProduct);
router.get("/searchProductbyCategory/:key", searchProductbyCategory);
router.get("/searchProductbySubCategory/:key", searchProductbySubCategory);

router.delete("/DeleteProduct/:id", deleteProduct);
router.delete("/DeleteProducts/:id", deleteProducts);
router.put("/deleteProductReview/:id", deleteProductReview);
router.delete("/deleteAllProductReviews/:id", deleteAllProductReviews);

// Customer
router.post("/CustomerRegister", customerRegister);
router.post("/CustomerLogin", customerLogIn);
router.get("/getCartDetail/:id", getCartDetail);
router.put("/CustomerUpdate/:id", cartUpdate);

// Order
router.post("/newOrder", newOrder);
router.get("/getOrderedProductsByCustomer/:id", getOrderedProductsByCustomer);
router.get("/getOrderedProductsBySeller/:id", getOrderedProductsBySeller);
router.get('/getStatus/:id',getStatus);
router.patch('/updateOrderStatus/:id',updateOrderStatus);

module.exports = router;

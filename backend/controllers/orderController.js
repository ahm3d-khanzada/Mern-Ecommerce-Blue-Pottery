const Order = require("../models/orderSchema.js");
const Product = require("../models/productSchema.js");
const newOrder = async (req, res) => {
  try {
    const {
      buyer,
      shippingData,
      orderedProducts,
      paymentInfo,
      productsQuantity,
      totalPrice,
    } = req.body;

    // Assuming there is only one product with the given _id
    const product = await Product.findById(orderedProducts._id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${orderedProducts._id} not found ` });
    }

    // Decrement product quantity
    if (product.quantity < orderedProducts.quantity) {
      return res
        .status(400)
        .json({
          message: `Not enough stock for product ${product.productName}`,
        });
    }
    product.quantity -= orderedProducts.quantity;
    await product.save();

    // Create a new order
    const order = await Order.create({
      buyer,
      shippingData,
      orderedProducts,
      paymentInfo,
      paidAt: Date.now(),
      productsQuantity,
      totalPrice,
    });

    return res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
// const newOrder = async (req, res) => {
//     try {

//         const {
//             buyer,
//             shippingData,
//             orderedProducts,
//             paymentInfo,
//             productsQuantity,
//             totalPrice,
//         } = req.body;

//         const order = await Order.create({
//             buyer,
//             shippingData,
//             orderedProducts,
//             paymentInfo,
//             paidAt: Date.now(),
//             productsQuantity,
//             totalPrice,
//         });

//         return res.send(order);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

const getOrderedProductsByCustomer = async (req, res) => {
  try {
    let orders = await Order.find({ buyer: req.params.id });

    if (orders.length > 0) {
      const orderedProducts = orders.reduce((accumulator, order) => {
        const productsWithOrderId = order.orderedProducts.map((product) => ({
          ...product.toObject(), // Ensure it's a plain object
          orderId: order._id, // Add the order ID to each product
        }));
        accumulator.push(...productsWithOrderId);
        return accumulator;
      }, []);
      res.send(orderedProducts);
    } else {
      res.send({ message: "No products found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // Find all orders containing products from this seller and populate buyer details
        const ordersWithSellerId = await Order.find({ 'orderedProducts.seller': sellerId })
            .populate('buyer', 'name'); // Assuming "name" is the field storing the customer's name

        if (ordersWithSellerId.length > 0) {
            // Flatten the list but keep each product as a separate entry
            const orderedProducts = ordersWithSellerId.flatMap(order =>
                order.orderedProducts
                    .filter(product => product.seller.toString() === sellerId)
                    .map(product => ({
                        orderId: order._id, // Include order ID
                        customerName: order.buyer.name, // Include customer name
                        orderStatus: order.orderStatus,
                        ...product.toObject()
                    }))
            );

            // Sort: Place delivered orders at the end
            orderedProducts.sort((a, b) => {
                const isADelivered = a.orderStatus?.toLowerCase() === "delivered";
                const isBDelivered = b.orderStatus?.toLowerCase() === "delivered";
                return isADelivered - isBDelivered; // Moves "delivered" orders to the end
            });

            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStatus = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const order = await Order.findOne({ _id: sellerId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ orderStatus: order.orderStatus });
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { orderStatus } = req.body;

    // Find and update the order status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: sellerId },
      { orderStatus },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  newOrder,
  getOrderedProductsByCustomer,
  getOrderedProductsBySeller,
  getStatus,
  updateOrderStatus,
};

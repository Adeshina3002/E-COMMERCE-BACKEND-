const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    paymentMethod,
    shippingAddress,
    coupon,
  } = req.body;

  //   Validations
  if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error('All fields are required');
  }

  await Order.create({
    user: req.user._id,
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    paymentMethod,
    shippingAddress,
    coupon,
  });

  res.status(201).json({ message: 'Order created successfully' });
});

// Get Orders
const getOrders = asyncHandler(async (req, res) => {
  let orders;

  if (req.user.role === 'admin') {
    orders = await Order.find().sort('-createdAt');
    return res.status(200).json(orders);
  }

  orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  return res.status(200).json(orders);
});

// Get Order
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    res.status(400);
    throw new Error('Order not found');
  }

  if (req.user.role === 'admin') {
    return res.status(200).json(order);
  }

  // Match order to the user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not Authorised');
  }

  res.status(200).json(order);
});

// Update Order status
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    res.status(400);
    throw new Error('Order not found');
  }

  //   Update the order status
  await Order.findByIdAndUpdate(
    { _id: id },
    { orderStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: 'Order updated successfully' });
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
};

const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const calculateTotalPrice = require('../utils/index')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// Pay with stripe
const payWithStripe = asyncHandler(async (req, res) => {
  const { items, shipping, description, coupon } = req.body;

  const products = await Product.find()

  let orderAmount;
  orderAmount = calculateTotalPrice(products, items)

  if(coupon !== null && coupon?.name !== 'nil') {
    let totalAfterDiscount = 
    orderAmount - (orderAmount * coupon.discount) / 100
    orderAmount = totalAfterDiscount
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: orderAmount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    description,
    shipping: {
      address: {
        line1: shipping.lin1,
        line2: shipping.lin2,
        city: shipping.city,
        country: shipping.country,
        postal_code: shipping.postal_code,
      },
      name: shipping.name ,
      phone: shipping.phone, 
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
})

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  payWithStripe,
};

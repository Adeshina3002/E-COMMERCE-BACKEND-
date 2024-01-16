const asyncHandler = require('express-async-handler');
const Coupon = require('../models/coupon.model');

// Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiresAt } = req.body;

  if (!name || !discount || !expiresAt) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const isCoupon = await Coupon.findOne({ name });

  if (isCoupon) {
    res.status(400);
    throw new Error(`Coupon name ${isCoupon.name} exists`);
  }

  const coupon = await Coupon.create({
    name,
    discount,
    expiresAt,
  });

  res.status(201).json(coupon);
});

// Get Coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json(coupons);
});

// Get Coupon
const getACoupon = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const coupon = await Coupon.findOne({
    name,
    expiresAt: { $gt: Date.now() }
  }).exec();

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found or has expired');
  }

  res.status(200).json(coupon);
});

// Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isCoupon = await Coupon.findById(id).exec();

  if (!isCoupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await Coupon.findByIdAndDelete(id);

  res
    .status(200)
    .json({ message: `Coupon ${isCoupon.name} deleted successfully` });
});

module.exports = {
  createCoupon,
  getCoupons,
  getACoupon,
  deleteCoupon,
};

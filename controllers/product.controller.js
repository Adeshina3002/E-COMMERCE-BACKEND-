const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;

  console.log(req.body);

  if (!name || !category || !brand || !quantity || !price || !description) {
    return res.status(400).json('Please fill in all fields');
  }

  const isSKU = await Product.findOne({ sku }).exec();
  console.log(isSKU);

  if (isSKU && isSKU.name) {
    res.status(400);
    throw new Error(`Product with SKU: ${sku} number and ${isSKU.name} exists`);
  }

  //   Create Product
  const product = await Product.create({
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  });

  res.status(201).json(product);
});

// Get Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort('-createdAt').exec();

  res.status(200).json(products);
});

// Get Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).exec();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).exec();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product deleted successfully' });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;

  const product = await Product.findById(req.params.id).exec();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name,
      category,
      brand,
      quantity,
      price,
      description,
      image,
      regularPrice,
      color,
    },
    {
      new: true,
      runValidators: true, //enforce the validation rules defined in the schema during the update operation
    }
  );

  res
    .status(200)
    .json({ message: 'Product updated successfully', updatedProduct });
});

// Review Product
const reviewProduct = asyncHandler(async (req, res) => {
  const { star, review, reviewDate } = req.body;

  const { id } = req.params;

  //VALIDATION
  if (star < 1 || !review) {
    res.status(400);
    throw new Error('Please add a star and review');
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update rating
  product.ratings.push({
    star,
    review,
    reviewDate,
    name: req.user.name,
    userID: req.user._id,
  });
  product.save();
  res.status(200).json({ message: 'Product review added' });
});

// Delete Review
const deleteReview = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // filter through the ratings and delete the rating we want to remove
  const newRatings = product.ratings.filter((rating) => {
    return rating.userID.toString() !== userID.toString();
  });

  product.ratings = newRatings;
  product.save();

  res.status(200).json({ message: 'Product review deleted' });
});

// UPDATE REVIEW
const updateReview = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const { star, review, reviewDate } = req.body;

  const { id } = req.params;

  //VALIDATION
  if (star < 1 || !review) {
    res.status(400);
    throw new Error('Please add a star and review');
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the rating with the matching userID
  const userRating = product.ratings.find(
    (rating) => rating.userID.toString() === userID.toString()
  );

  // Match user to review
  if (!userRating) {
    res.status(401);
    throw new Error('User not Authorized!');
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: id,
      'ratings.userID': userID,
    },
    {
      $set: {
        'ratings.$.star': star,
        'ratings.$.review': review,
        'ratings.$.reviewDate': reviewDate,
      },
    },
    { new: true }
  );

  if (updatedProduct) {
    res
      .status(200)
      .json({ message: 'Product review updated', product: updatedProduct });
  } else {
    res
        .status(400)
        .json({ message: 'Product review not updated, try again' });
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
  updateReview,
};

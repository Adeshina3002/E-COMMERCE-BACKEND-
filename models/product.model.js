const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'Please enter a product name'],
        trim: true
    },
    sku: { // stock keeping unit
        type: String,
        required: true,
        default: "SKU",
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a product category'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Please add a product brand'],
        trim: true
    },
    color: {
        type: String,
        required: [true, 'Please add a product color'],
        default: "As seen",
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a product quantity'],
        trim: true
    },
    sold: {
        type: Number,
        default: 0,
        trim: true
    },
    regularPrice: {
        type: Number,
        // required: [true, 'Please add a product regularPrice'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a product description'],
        trim: true
    },
    image: {
        type: [String],
    },
    ratings: {
        type: [Object],
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Name is required'],
      minLength: [2, 'Too short'],
      maxLength: [32, 'Too long'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;

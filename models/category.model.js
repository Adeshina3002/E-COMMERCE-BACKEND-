const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

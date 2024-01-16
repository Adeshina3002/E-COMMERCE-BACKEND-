const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Coupon Name is required'],
      minLength: [6, 'Name must be up to 6 characters'],
      maxLength: [12, 'Name cannot be more than 12 characters'],
    },
    discount: {
        type: Number,
        unique: true,
    },
    expiresAt: {
        // type: String,
        type: Date,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;

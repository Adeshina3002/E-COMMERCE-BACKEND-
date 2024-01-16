const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [6, 'Pawword must be up to 6 chracters'],
    },
    role: {
      type: String,
      required: [true],
      default: 'customer',
      enum: ['customer', 'admin'],
    },
    photo: {
      type: String,
      required: [true, 'Please add a photo'],
      default: 'htpps://i.ibb.co/4pDNDk1/avatar.png',
    },
    phone: {
      type: String,
      default: '+234',
    },
    address: {
      type: String,
      // address, state, country
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;

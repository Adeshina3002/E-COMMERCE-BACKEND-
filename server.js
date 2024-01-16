const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.route');
const categoryRoutes = require('./routes/category.route');
const brandRoutes = require('./routes/brand.route');
const couponRoutes = require('./routes/coupon.route');
const orderRoutes = require('./routes/order.route');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shopitoapp.vercel.app'],
    credentials: true,
  })
);

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Home Page...');
});

// Error Middleware
app.use(errorHandler);
const PORT = process.env.PORT || 7867;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running 🚀🚀 on PORT: ${PORT} 🚀🚀🚀`);
    });
  })
  .catch((err) => console.log(err));

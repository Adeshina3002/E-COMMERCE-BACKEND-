const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { createOrder, getOrders, getOrder, deleteOrder, updateOrder } = require('../controllers/order.controller');
const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/getOrders', protect, getOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id', protect, adminOnly, updateOrder);

module.exports = router;

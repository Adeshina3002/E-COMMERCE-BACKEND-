const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { createOrder, getOrders, getOrder, deleteOrder, updateOrder, payWithStripe } = require('../controllers/order.controller');
const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/getOrders', protect, getOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id', protect, adminOnly, updateOrder);

router.post('/create-payment-intent', payWithStripe)

module.exports = router;

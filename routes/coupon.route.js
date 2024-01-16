const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { createCoupon, getCoupons, deleteCoupon, getACoupon } = require('../controllers/coupon.controller');
const router = express.Router();

router.post('/create', protect, adminOnly, createCoupon);
router.get('/getCoupons', protect, adminOnly, getCoupons);
router.get('/:name', protect, adminOnly, getACoupon);
router.delete('/delete/:id', protect, deleteCoupon);

module.exports = router;

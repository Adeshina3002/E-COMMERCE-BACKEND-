const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { createBrand, getBrands, deleteBrand } = require('../controllers/brand.controller');
const router = express.Router();

router.post('/create', protect, adminOnly, createBrand);
router.get('/getBrands', protect, adminOnly, getBrands);
router.delete('/delete/:slug', protect, adminOnly, deleteBrand);

module.exports = router;

const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { createCategory, getCategories, deleteCategory } = require('../controllers/category.controller');
const router = express.Router();

router.post('/create', protect, adminOnly, createCategory);
router.get('/getCategories', protect, adminOnly, getCategories);
router.delete('/delete/:slug', protect, adminOnly, deleteCategory);

module.exports = router;

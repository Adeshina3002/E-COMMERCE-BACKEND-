const asyncHandler = require('express-async-handler');
const Category = require('../models/category.model');
const slugify = require('slugify');

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Provide category name');
  }

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category name already exists');
  }

  const category = await Category.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json(category);
});

// Get Categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('-createdAt');
  res.status(200).json(categories);
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase()

  const isCategory  = await Category.findOne({ slug }).exec()

  if (!isCategory) {
    res.status(404)
    throw new Error("Category not found")
  }

  await Category.findOneAndDelete({ slug })

  res.status(200).json({ message: `Category ${isCategory.name} deleted successfully` })
})

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};

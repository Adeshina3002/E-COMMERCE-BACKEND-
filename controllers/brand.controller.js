const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand.model');
const slugify = require('slugify');
const Category = require('../models/category.model');

// Create Brand
const createBrand = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error('Fill in all fields');
  }

  const categoryExists = await Category.findOne({ name: category });

  if (!categoryExists) {
    res.status(400);
    throw new Error('Parent category not found');
  }

  const brand = await Brand.create({
    name,
    slug: slugify(name),
    category
  });
  res.status(201).json(brand);
});

// Get Categories
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort('-createdAt');
  res.status(200).json(brands);
});

// Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase()

  const isBrand  = await Brand.findOne({ slug }).exec()

  if (!isBrand) {
    res.status(404)
    throw new Error("Brand not found")
  }

  await Brand.findOneAndDelete({ slug })

  res.status(200).json({ message: `Brand ${isBrand.name} deleted successfully` })
})


module.exports = {
  createBrand,
  getBrands,
  deleteBrand,
};

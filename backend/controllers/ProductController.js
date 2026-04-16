const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const ProductController = {
  // Get all products, handle search and filter
  async getAll(req, res) {
    try {
      const { search, categoryId } = req.query;
      const whereClause = {};

      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }
      
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [{ model: Category }]
      });

      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  },

  // Get single product details
  async getById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category }]
      });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  },
  
  // Get all categories
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  }
};

module.exports = ProductController;

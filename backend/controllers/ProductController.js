const Product = require('../models/Product');
const Category = require('../models/Category');

const ProductController = {
  // Get all products, handle search and filter
  async getAll(req, res) {
    try {
      const { search, categoryId } = req.query;
      const query = {};

      // Search by name
      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive
      }
      
      // Filter by category
      if (categoryId) {
        query.category = categoryId;
      }

      const products = await Product.find(query)
        .populate('category', 'name')
        .lean();

      res.json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
    }
  },

  // Get single product details
  async getById(req, res) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name');
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
    }
  },
  
  // Get all categories
  async getCategories(req, res) {
    try {
      const categories = await Category.find().lean();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
    }
  }
};

module.exports = ProductController;

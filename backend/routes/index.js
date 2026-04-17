const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const OrderController = require('../controllers/OrderController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');
const Product = require('../models/Product');

// ✅ Test route (for inserting sample product)
router.get('/test', async (req, res) => {
  try {
    const existingProduct = await Product.findOne();

    if (!existingProduct) {
      const sampleProduct = new Product({
        name: 'Sample Laptop',
        price: 999.99,
        description: 'A high-performance laptop',
        stock: 10,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300',
      });

      await sampleProduct.save();

      return res.json({ success: true, data: sampleProduct });
    }

    res.json({ success: true, data: existingProduct });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);

// Product Routes
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);
router.get('/categories', ProductController.getCategories);

// Cart Routes
router.get('/cart', authMiddleware, CartController.getCart);
router.post('/cart/add', authMiddleware, CartController.addToCart);
router.put('/cart/:id', authMiddleware, CartController.updateQuantity);
router.delete('/cart/:id', authMiddleware, CartController.removeItem);

// Order Routes
router.post('/orders', authMiddleware, OrderController.placeOrder);
router.get('/orders', authMiddleware, OrderController.getUserOrders);
router.get('/orders/:id', authMiddleware, OrderController.getOrder);

module.exports = router;
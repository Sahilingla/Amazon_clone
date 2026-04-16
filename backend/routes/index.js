const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const OrderController = require('../controllers/OrderController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');

// Auth Routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);

// Product Routes
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);
router.get('/categories', ProductController.getCategories);

// Cart Routes (Protected)
router.get('/cart', authMiddleware, CartController.getCart);
router.post('/cart/add', authMiddleware, CartController.addToCart);
router.put('/cart/:id', authMiddleware, CartController.updateQuantity);
router.delete('/cart/:id', authMiddleware, CartController.removeItem);

// Order Routes (Protected)
router.post('/orders', authMiddleware, OrderController.placeOrder);
router.get('/orders', authMiddleware, OrderController.getUserOrders);
router.get('/orders/:id', authMiddleware, OrderController.getOrder);

module.exports = router;

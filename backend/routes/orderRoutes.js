const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById
} = require('../controllers/OrderController');

const protect = require('../middleware/authMiddleware');

// Create order
router.post('/', protect, createOrder);

// Get all orders
router.get('/', protect, getOrders);

// Get single order
router.get('/:id', protect, getOrderById);

module.exports = router;
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const OrderController = {
  // Place an order (requires auth)
  async placeOrder(req, res) {
    try {
      const { address } = req.body;
      const userId = req.user.id;

      if (!address) {
        return res.status(400).json({ success: false, message: 'Address is required' });
      }

      // Get cart and populate items
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      // Calculate total and prepare order items
      let totalAmount = 0;
      const orderItems = [];
      
      cart.items.forEach(item => {
        const itemTotal = item.quantity * item.productId.price;
        totalAmount += itemTotal;
        
        orderItems.push({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        });
      });

      // Create Order
      const order = new Order({
        userId,
        items: orderItems,
        totalAmount,
        address,
        status: 'Pending'
      });
      
      await order.save();

      // Clear Cart
      cart.items = [];
      await cart.save();

      res.status(201).json({ 
        success: true, 
        message: 'Order placed successfully',
        data: order 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
  },

  // Get user orders
  async getUserOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user.id })
        .populate('items.productId', 'name price image')
        .sort({ createdAt: -1 });
      
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
  },

  // Get order details (ensure ownership)
  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        userId: req.user.id
      }).populate('items.productId', 'name price image');
      
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
      }
      
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
    }
  }
};

module.exports = OrderController;

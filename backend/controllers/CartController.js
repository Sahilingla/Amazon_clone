const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

const CartController = {
  // Get cart with items
  async getCart(req, res) {
    try {
      const cart = await getOrCreateCart(req.user.id)
        .then(c => Cart.findById(c._id).populate('items.productId', 'name price image'));
      
      res.json({ 
        success: true, 
        data: cart || { items: [] } 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
    }
  },

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user.id;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Get or create cart
      const cart = await getOrCreateCart(userId);

      // Check if item already exists in cart
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
      } else {
        cart.items.push({ productId, quantity: parseInt(quantity) });
      }
      
      await cart.save();
      await cart.populate('items.productId', 'name price image');
      
      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
    }
  },

  // Update cart item quantity
  async updateQuantity(req, res) {
    try {
      const { id: productId } = req.params; // Product ID
      const { quantity } = req.body;
      const userId = req.user.id;
      
      const cart = await getOrCreateCart(userId);
      
      const item = cart.items.find(
        item => item.productId.toString() === productId
      );
      
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found in your cart' });
      }
      
      item.quantity = Math.max(1, parseInt(quantity));
      await cart.save();
      await cart.populate('items.productId', 'name price image');
      
      res.json({ success: true, data: cart });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating quantity', error: error.message });
    }
  },

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const { id: productId } = req.params; // Product ID
      const userId = req.user.id;
      
      const cart = await getOrCreateCart(userId);
      
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
      
      await cart.save();
      await cart.populate('items.productId', 'name price image');
      
      res.json({ success: true, message: 'Item removed', data: cart });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error removing item', error: error.message });
    }
  }
};

module.exports = CartController;

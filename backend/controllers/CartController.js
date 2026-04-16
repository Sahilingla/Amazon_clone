const { Cart, CartItem, Product } = require('../models');

// Helper to get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

const CartController = {
  // Get cart with items
  async getCart(req, res) {
    try {
      const cart = await getOrCreateCart(req.user.id);
      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Product }]
      });
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  },

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const cart = await getOrCreateCart(req.user.id);

      // Check if item already exists in cart
      let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId }
      });

      if (cartItem) {
        cartItem.quantity += parseInt(quantity);
        await cartItem.save();
      } else {
        cartItem = await CartItem.create({
          cartId: cart.id,
          productId,
          quantity: parseInt(quantity)
        });
      }
      
      res.status(201).json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding to cart' });
    }
  },

  // Update cart item quantity
  async updateQuantity(req, res) {
    try {
      const { id } = req.params; // CartItem ID
      const { quantity } = req.body;
      const cart = await getOrCreateCart(req.user.id);
      
      const cartItem = await CartItem.findOne({ where: { id, cartId: cart.id } });
      if (!cartItem) return res.status(404).json({ message: 'Item not found in your cart' });
      
      cartItem.quantity = Math.max(1, parseInt(quantity));
      await cartItem.save();
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: 'Error updating quantity' });
    }
  },

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const { id } = req.params;
      const cart = await getOrCreateCart(req.user.id);
      const cartItem = await CartItem.findOne({ where: { id, cartId: cart.id } });
      if (cartItem) {
        await cartItem.destroy();
      }
      res.json({ message: 'Item removed' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing item' });
    }
  }
};

module.exports = CartController;

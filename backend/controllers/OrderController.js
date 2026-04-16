const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

const OrderController = {
  // Place an order (requires auth)
  async placeOrder(req, res) {
    try {
      const { address } = req.body;
      const userId = req.user.id;

      // Get cart and items
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) return res.status(400).json({ message: 'Cart is empty' });

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Product }]
      });

      if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

      // Calculate total amount
      let totalAmount = 0;
      cartItems.forEach(item => {
        totalAmount += item.quantity * item.Product.price;
      });

      // Create Order
      const order = await Order.create({
        userId,
        totalAmount,
        address,
        status: 'Placed'
      });

      // Move items to OrderItem
      const orderItemsData = cartItems.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price
      }));
      await OrderItem.bulkCreate(orderItemsData);

      // Clear Cart
      await CartItem.destroy({ where: { cartId: cart.id } });

      res.status(201).json({ orderId: order.id, message: 'Order placed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error placing order' });
    }
  },

  // Get user orders mapping
  async getUserOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  // Get order details (ensure ownership)
  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [{ 
          model: OrderItem,
          include: [{ model: Product }]
        }]
      });
      
      if (!order) return res.status(404).json({ message: 'Order not found or unauthorized' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order' });
    }
  }
};

module.exports = OrderController;

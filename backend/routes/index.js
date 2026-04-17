const Order = require('../models/Order');
const Product = require('../models/Product');

// ✅ PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    let totalAmount = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error('Product not found');
        }

        const price = product.price;
        totalAmount += price * item.quantity;

        return {
          Product: product._id,
          quantity: item.quantity,
          price,
        };
      })
    );

    const order = await Order.create({
      userId: req.user.id,
      OrderItems: orderItems,
      totalAmount,
      address,
    });

    res.status(201).json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET ALL ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('OrderItems.Product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET SINGLE ORDER
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('OrderItems.Product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// This model is now embedded within Order.js as an array of items
// Keep for backwards compatibility, but use Order model instead

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

module.exports = OrderItem;

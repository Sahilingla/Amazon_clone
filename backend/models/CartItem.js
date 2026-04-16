// This model is now embedded within Cart.js as an array of items
// Keep for backwards compatibility, but use Cart model instead

const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;

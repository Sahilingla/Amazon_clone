# Controller Update Guide - Mongoose Syntax

## Converting from Sequelize to Mongoose

This guide shows examples of how to update your controllers to work with Mongoose instead of Sequelize.

---

## 📝 AuthController Example

### BEFORE (Sequelize)
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.create({
      name,
      email,
      password,
    });
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    
    const isMatch = await user.validPassword(password);
    if (!isMatch) throw new Error('Invalid password');
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

### AFTER (Mongoose)
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }
    
    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ 
      success: true, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (use select('+password') to get password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Use the matchPassword method defined in User schema
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    
    res.json({ 
      success: true, 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 🛒 ProductController Example

### Common Mongoose Query Patterns
```javascript
const Product = require('../models/Product');

// GET all products
exports.getAll = async (req, res) => {
  try {
    // Populate category details if needed
    const products = await Product.find().populate('category', 'name');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET single product
exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE product
exports.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE product
exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true returns updated doc
    );
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE product
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 🛍️ CartController Example

### Using Mongoose with Arrays

```javascript
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price image');
    
    res.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ADD to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id: productId } = req.params;
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const item = cart.items.find(
      item => item.productId.toString() === productId
    );
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not in cart' });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// REMOVE from cart
exports.removeItem = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    // Remove item from array
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 📦 OrderController Example

```javascript
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// PLACE order
exports.placeOrder = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;
    
    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }
    
    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });
    
    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      address,
    });
    
    await order.save();
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name price image');
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 🔄 Common Mongoose Query Methods

| Sequelize | Mongoose |
|-----------|----------|
| `Model.findAll()` | `Model.find()` |
| `Model.findByPk(id)` | `Model.findById(id)` |
| `Model.findOne({ where: {} })` | `Model.findOne({ })` |
| `Model.create({ })` | `new Model({ }).save()` |
| `model.update({ })` | `Model.findByIdAndUpdate(id, { })` |
| `Model.destroy()` | `Model.findByIdAndDelete(id)` |
| `model.save()` | `await model.save()` |
| `Model.sync()` | N/A (MongoDB creates on insert) |

---

## 💡 Mongoose Best Practices

1. **Always use `.populate()`** for references to populate related data
2. **Use `.select()`** to include/exclude fields: `User.find().select('+password')`
3. **Use `.lean()`** for read-only queries to improve performance
4. **Always validate** data before saving
5. **Use transactions** for operations that must be atomic
6. **Index frequently queried fields** for better performance

### Example with best practices:
```javascript
const order = await Order.findById(id)
  .populate('items.productId', 'name price image')
  .lean() // Faster for read-only
  .exec();
```

---


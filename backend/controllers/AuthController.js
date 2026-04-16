const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AuthController = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user (password hashed by pre-save middleware)
      const user = new User({ name, email, password });
      await user.save();

      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Server error during signup' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user (include password field)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password using method from schema
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { user: { id: user._id } },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Server error during login' });
    }
  }
};

module.exports = AuthController;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const AuthController = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
          });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

module.exports = AuthController;

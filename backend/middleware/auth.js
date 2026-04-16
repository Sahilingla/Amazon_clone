const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded.user; // { id: userId }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

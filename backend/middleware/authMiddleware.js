// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findByPk(decoded.id); 
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      user
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);  // Log the error
    res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;

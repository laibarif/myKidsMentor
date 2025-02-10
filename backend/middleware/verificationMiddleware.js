// middlewares/verificationMiddleware.js
const verificationMiddleware = (req, res, next) => {
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Your account is not verified by the admin' });
    }
    next();
  };
  
  module.exports = verificationMiddleware;
  
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role);  // Log the user role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: incorrect role' });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Access denied: user not verified' });
    }

    next();
  };
};

module.exports = roleMiddleware;

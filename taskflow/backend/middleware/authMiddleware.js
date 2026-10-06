import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes and verify JWT token
 */
export const protect = (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Format: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Secret key fallback if environment variable is not set
      const secret = process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026';

      // Verify the token
      const decoded = jwt.verify(token, secret);

      // Attach user info to request object
      req.user = decoded;

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  // If no token was found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please log in first' });
  }
};

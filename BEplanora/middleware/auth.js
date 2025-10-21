import jwt from "jsonwebtoken";

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info from token payload to request
      req.user = decoded;

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token failed or expired" 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token provided" 
    });
  }
};

/**
 * Authentication middleware
 * Validates API keys or tokens
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
        message: 'Please provide an authorization token'
      });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (token === 'null' || token === 'undefined' || token === 'Bearer null' || token === 'Bearer undefined' || token === 'Bearer null') {
      return res.status(401).json({
        error: 'Token missing',
        message: 'Please provide a valid token'
      });
    }

    // TODO: Implement actual token verification
    // For now, we'll accept any non-empty token
    // In production, verify JWT or session token here

    // Attach user info to request (mock data for now)
    req.user = {
      id: 'user_123',
      token: token
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: error.message
    });
  }
};

module.exports = authMiddleware;

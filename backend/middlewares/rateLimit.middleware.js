const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 */
const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
});

module.exports = rateLimitMiddleware;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');

// Import routes
const meetingsRoutes = require('./routes/meetings.routes');
const notionRoutes = require('./routes/notion.routes');
const authRoutes = require('./routes/auth.routes');

// Import middleware
const rateLimitMiddleware = require('./middlewares/rateLimit.middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (dev only)
if (config.isDevelopment) {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(rateLimitMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Note Ninja Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/meetings', meetingsRoutes);
app.use('/notion', notionRoutes);
app.use('/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.isDevelopment && { stack: err.stack })
  });
});

module.exports = app;

/**
 * Auth Routes
 * Handles authentication endpoints
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// OAuth flow
router.get('/notion', authController.initiateOAuth);
router.get('/callback', authController.handleCallback);

// Token management
router.post('/refresh', authController.refreshToken);
router.post('/validate', authController.validateToken);
router.post('/logout', authMiddleware, authController.logout);

// User info
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;

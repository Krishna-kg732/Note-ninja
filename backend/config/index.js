/**
 * Backend Configuration
 * Centralized config loaded from environment variables
 */
require('dotenv').config();

const config = {
    // Server
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',

    // Notion API
    notion: {
        apiKey: process.env.NOTION_API_KEY,
        clientId: process.env.NOTION_CLIENT_ID,
        clientSecret: process.env.NOTION_CLIENT_SECRET,
        redirectUri: process.env.NOTION_REDIRECT_URI || 'http://localhost:3000/auth/callback',
        apiBaseUrl: 'https://api.notion.com/v1',
        apiVersion: '2022-06-28',
        oauthUrl: 'https://api.notion.com/v1/oauth/authorize',
        tokenUrl: 'https://api.notion.com/v1/oauth/token'
    },

    // Gemini AI
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        getApiUrl: function () {
            return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        }
    },

    // CORS
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    // Defaults
    defaults: {
        meetingTitle: 'Untitled Meeting'
    }
};

module.exports = config;

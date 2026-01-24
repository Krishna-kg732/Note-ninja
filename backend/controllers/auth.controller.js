/**
 * Auth Controller
 * Handles authentication-related HTTP requests
 */
const authService = require('../services/auth.service');

/**
 * Extract Bearer token from request headers
 */
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    return authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;
}

/**
 * Send error response
 */
function sendError(res, status, error, details = null) {
    const response = { success: false, error };
    if (details) response.details = details;
    res.status(status).json(response);
}

/**
 * Send success response
 */
function sendSuccess(res, data, status = 200) {
    res.status(status).json({ success: true, ...data });
}

const authController = {
    /**
     * Initiate Notion OAuth flow
     * @route GET /auth/notion
     */
    initiateOAuth: (req, res) => {
        try {
            const authUrl = authService.buildOAuthUrl();
            res.redirect(authUrl);
        } catch (error) {
            console.error('OAuth initiation error:', error.message);
            sendError(res, 500, 'Failed to initiate OAuth', error.message);
        }
    },

    /**
     * Handle OAuth callback from Notion
     * @route GET /auth/callback
     */
    handleCallback: async (req, res) => {
        const { code, error: oauthError } = req.query;

        if (oauthError) {
            return sendError(res, 400, 'OAuth denied', oauthError);
        }

        if (!code) {
            return sendError(res, 400, 'Authorization code not provided');
        }

        try {
            const tokenData = await authService.exchangeCodeForToken(code);
            sendSuccess(res, tokenData);
        } catch (error) {
            console.error('OAuth callback error:', error.response?.data || error.message);
            sendError(res, 500, 'Failed to authenticate with Notion', error.response?.data || error.message);
        }
    },

    /**
     * Get current authenticated user info
     * @route GET /auth/me
     */
    getCurrentUser: async (req, res) => {
        const token = extractToken(req);

        if (!token) {
            return sendError(res, 401, 'No token provided');
        }

        try {
            const user = await authService.getUserInfo(token);
            sendSuccess(res, { user });
        } catch (error) {
            console.error('Get user error:', error.response?.data || error.message);
            sendError(res, 401, 'Failed to get user info', error.response?.data?.message || error.message);
        }
    },

    /**
     * Validate a token
     * @route POST /auth/validate
     */
    validateToken: async (req, res) => {
        const token = req.body.token || extractToken(req);

        if (!token) {
            return sendError(res, 400, 'No token provided');
        }

        try {
            const result = await authService.validateToken(token);
            sendSuccess(res, result);
        } catch (error) {
            res.json({ success: false, valid: false, error: error.message });
        }
    },

    /**
     * Refresh access token
     * @route POST /auth/refresh
     */
    refreshToken: async (req, res) => {
        const result = await authService.refreshAccessToken();
        sendSuccess(res, result);
    },

    /**
     * Logout / revoke token
     * @route POST /auth/logout
     */
    logout: async (req, res) => {
        const result = await authService.revokeToken();
        sendSuccess(res, result);
    }
};

module.exports = authController;

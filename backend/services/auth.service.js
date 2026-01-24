/**
 * Auth Service
 * Handles authentication-related operations with Notion API
 */
const axios = require('axios');
const config = require('../config');

const authService = {
    /**
     * Build OAuth authorization URL
     * @returns {string} OAuth URL
     */
    buildOAuthUrl: () => {
        const { clientId, redirectUri, oauthUrl } = config.notion;

        if (!clientId) {
            throw new Error('NOTION_CLIENT_ID is not configured');
        }

        return `${oauthUrl}?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
    },

    /**
     * Exchange authorization code for access token
     * @param {string} code - Authorization code from OAuth callback
     * @returns {Promise<Object>} Token response with access_token, workspace info
     */
    exchangeCodeForToken: async (code) => {
        const { clientId, clientSecret, redirectUri, tokenUrl } = config.notion;

        if (!clientId || !clientSecret) {
            throw new Error('Notion OAuth credentials not configured');
        }

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await axios.post(
            tokenUrl,
            {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri
            },
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { access_token, workspace_id, workspace_name, bot_id, owner } = response.data;

        return { access_token, workspace_id, workspace_name, bot_id, owner };
    },

    /**
     * Validate access token by calling Notion API
     * @param {string} token - Access token to validate
     * @returns {Promise<Object>} { valid: boolean, user?: Object }
     */
    validateToken: async (token) => {
        try {
            const user = await authService.getUserInfo(token);
            return { valid: true, user };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    },

    /**
     * Get user info from Notion API
     * @param {string} token - Access token
     * @returns {Promise<Object>} User/bot info from Notion
     */
    getUserInfo: async (token) => {
        const { apiBaseUrl, apiVersion } = config.notion;

        const response = await axios.get(`${apiBaseUrl}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': apiVersion
            }
        });

        return response.data;
    },

    /**
     * Refresh access token
     * Note: Notion OAuth tokens are long-lived and don't require refresh
     * @returns {Object} Status message
     */
    refreshAccessToken: async () => {
        return {
            message: 'Notion uses long-lived tokens that do not require refresh',
            supported: false
        };
    },

    /**
     * Revoke access token
     * Note: Notion doesn't provide a token revocation endpoint
     * @returns {Object} Status message
     */
    revokeToken: async () => {
        return {
            message: 'Notion does not support programmatic token revocation. Users should disconnect from Notion settings.',
            supported: false
        };
    }
};

module.exports = authService;

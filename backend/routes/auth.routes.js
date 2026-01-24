const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

// Initiate Notion OAuth
router.get('/notion', (req, res) => {
  const authUrl = buildOAuthUrl();
  res.redirect(authUrl);
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    res.json({
      success: true,
      ...tokenData
    });
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to authenticate with Notion',
      details: error.response?.data
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token not provided' });
  }

  res.json({
    success: true,
    message: 'Token refresh not yet implemented'
  });
});

// Helper functions
function buildOAuthUrl() {
  const { clientId, redirectUri, oauthUrl } = config.notion;
  return `${oauthUrl}?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

async function exchangeCodeForToken(code) {
  const { clientId, clientSecret, redirectUri, tokenUrl } = config.notion;

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

  const { access_token, workspace_id, workspace_name } = response.data;
  return { access_token, workspace_id, workspace_name };
}

module.exports = router;

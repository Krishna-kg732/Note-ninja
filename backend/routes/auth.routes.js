const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Initiate Notion OAuth
router.get('/notion', (req, res) => {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.NOTION_REDIRECT_URI;
  
  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  res.redirect(authUrl);
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ 
      error: 'Authorization code not provided' 
    });
  }

  try {
    const auth = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NOTION_REDIRECT_URI
      },
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { access_token, workspace_id, workspace_name } = response.data;
    
    // In production, store this securely (database, encrypted storage, etc.)
    res.json({ 
      success: true,
      access_token,
      workspace_id,
      workspace_name
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
    return res.status(400).json({ 
      error: 'Refresh token not provided' 
    });
  }

  try {
    // Implement token refresh logic here
    res.json({ 
      success: true,
      message: 'Token refresh not yet implemented'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Failed to refresh token' 
    });
  }
});

module.exports = router;

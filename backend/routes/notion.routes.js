const express = require('express');
const router = express.Router();
const notionService = require('../services/notion.service');
const authMiddleware = require('../middlewares/auth.middleware');

// Upload notes to Notion
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    const { meetingId, notes, databaseId } = req.body;
    const result = await notionService.uploadNotes(notes, databaseId);
    res.status(200).json({ 
      success: true, 
      pageId: result.id,
      url: result.url 
    });
  } catch (error) {
    console.error('Error uploading to Notion:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// List available Notion databases
router.get('/databases', authMiddleware, async (req, res) => {
  try {
    const databases = await notionService.listDatabases();
    res.status(200).json({ 
      success: true, 
      databases 
    });
  } catch (error) {
    console.error('Error fetching databases:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new Notion page
router.post('/create-page', authMiddleware, async (req, res) => {
  try {
    const { title, content, databaseId } = req.body;
    const page = await notionService.createPage(title, content, databaseId);
    res.status(201).json({ 
      success: true, 
      page 
    });
  } catch (error) {
    console.error('Error creating Notion page:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

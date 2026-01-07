const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create new meeting record
router.post('/create', authMiddleware, meetingController.createMeeting);

// Get meeting details
router.get('/:id', authMiddleware, meetingController.getMeeting);

// Process transcript
router.post('/:id/process', authMiddleware, meetingController.processTranscript);

// Get all meetings
router.get('/', authMiddleware, meetingController.getAllMeetings);

// Delete meeting
router.delete('/:id', authMiddleware, meetingController.deleteMeeting);

module.exports = router;

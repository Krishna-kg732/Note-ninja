const transcriptService = require('../services/transcript.service');
const aiService = require('../services/ai.service');
const notionService = require('../services/notion.service');

// In-memory storage (replace with database in production)
const meetings = new Map();

const meetingController = {
  // Create new meeting record
  createMeeting: async (req, res) => {
    try {
      const { title, date, participants } = req.body;
      
      const meetingId = Date.now().toString();
      const meeting = {
        id: meetingId,
        title: title || 'Untitled Meeting',
        date: date || new Date().toISOString(),
        participants: participants || [],
        transcript: '',
        notes: null,
        createdAt: new Date().toISOString()
      };
      
      meetings.set(meetingId, meeting);
      
      res.status(201).json({ 
        success: true, 
        meeting 
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  },

  // Get meeting details
  getMeeting: async (req, res) => {
    try {
      const { id } = req.params;
      const meeting = meetings.get(id);
      
      if (!meeting) {
        return res.status(404).json({ 
          error: 'Meeting not found' 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        meeting 
      });
    } catch (error) {
      console.error('Error fetching meeting:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  },

  // Process transcript
  processTranscript: async (req, res) => {
    try {
      const { id } = req.params;
      const { transcript } = req.body;
      
      const meeting = meetings.get(id);
      if (!meeting) {
        return res.status(404).json({ 
          error: 'Meeting not found' 
        });
      }
      
      // Clean transcript
      const cleanedTranscript = transcriptService.cleanTranscript(transcript);
      
      // Format with AI
      const formattedNotes = await aiService.formatNotes(cleanedTranscript);
      
      // Update meeting
      meeting.transcript = cleanedTranscript;
      meeting.notes = formattedNotes;
      meeting.processedAt = new Date().toISOString();
      meetings.set(id, meeting);
      
      res.status(200).json({ 
        success: true, 
        notes: formattedNotes 
      });
    } catch (error) {
      console.error('Error processing transcript:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  },

  // Get all meetings
  getAllMeetings: async (req, res) => {
    try {
      const allMeetings = Array.from(meetings.values());
      res.status(200).json({ 
        success: true, 
        meetings: allMeetings 
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  },

  // Delete meeting
  deleteMeeting: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!meetings.has(id)) {
        return res.status(404).json({ 
          error: 'Meeting not found' 
        });
      }
      
      meetings.delete(id);
      
      res.status(200).json({ 
        success: true, 
        message: 'Meeting deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }
};

module.exports = meetingController;

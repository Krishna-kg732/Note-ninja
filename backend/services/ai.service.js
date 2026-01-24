const axios = require('axios');
const config = require('../config');

const aiService = {
  /**
   * Format raw transcript into structured notes using Google Gemini
   * @param {string} transcript - Cleaned transcript text
   * @returns {Object} Formatted notes with summary, key points, and action items
   */
  formatNotes: async (transcript) => {
    if (!config.gemini.apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using basic formatting.');
      return aiService.basicFormat(transcript);
    }

    try {
      const response = await axios.post(
        config.gemini.getApiUrl(),
        {
          contents: [{ parts: [{ text: buildPrompt(transcript) }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const formattedContent = response.data.candidates[0].content.parts[0].text;

      return {
        summary: aiService.extractSection(formattedContent, 'Meeting Summary'),
        keyPoints: aiService.extractSection(formattedContent, 'Key Discussion Points'),
        decisions: aiService.extractSection(formattedContent, 'Decisions Made'),
        actionItems: aiService.extractSection(formattedContent, 'Action Items'),
        rawTranscript: transcript,
        formattedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gemini AI formatting error:', error.response?.data || error.message);
      return aiService.basicFormat(transcript);
    }
  },

  /**
   * Basic formatting without AI (fallback)
   */
  basicFormat: (transcript) => {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);

    return {
      summary: sentences.slice(0, 3).join('. ') + '.',
      keyPoints: sentences.slice(0, 5).map(s => s.trim()),
      decisions: ['No automatic decisions extracted'],
      actionItems: ['No automatic action items extracted'],
      rawTranscript: transcript,
      formattedAt: new Date().toISOString(),
      note: 'Basic formatting applied (AI not configured)'
    };
  },

  /**
   * Extract a specific section from AI-formatted text
   */
  extractSection: (content, section) => {
    const regex = new RegExp(`${section}[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\d+\\.|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
};

function buildPrompt(transcript) {
  return `You are an expert at converting meeting transcripts into structured notes. 
Please convert this meeting transcript into structured notes with the following sections:
1. Meeting Summary (2-3 sentences)
2. Key Discussion Points (bullet points)
3. Decisions Made (bullet points)
4. Action Items (with responsible person if mentioned)

Transcript:
${transcript}`;
}

module.exports = aiService;

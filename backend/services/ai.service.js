const axios = require('axios');
require('dotenv').config();

const aiService = {
  /**
   * Format raw transcript into structured notes using AI
   * @param {string} transcript - Cleaned transcript text
   * @returns {Object} Formatted notes with summary, key points, and action items
   */
  formatNotes: async (transcript) => {
    try {
      // If no AI API key is configured, return a basic formatted version
      if (!process.env.AI_API_KEY) {
        console.warn('AI_API_KEY not configured. Using basic formatting.');
        return aiService.basicFormat(transcript);
      }

      // Example using OpenAI API (adjust based on your AI provider)
      const response = await axios.post(
        process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at converting meeting transcripts into structured notes. Extract key information, summarize discussions, and identify action items.'
            },
            {
              role: 'user',
              content: `Please convert this meeting transcript into structured notes with the following sections:
1. Meeting Summary (2-3 sentences)
2. Key Discussion Points (bullet points)
3. Decisions Made (bullet points)
4. Action Items (with responsible person if mentioned)

Transcript:
${transcript}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const formattedContent = response.data.choices[0].message.content;
      
      return {
        summary: aiService.extractSection(formattedContent, 'Meeting Summary'),
        keyPoints: aiService.extractSection(formattedContent, 'Key Discussion Points'),
        decisions: aiService.extractSection(formattedContent, 'Decisions Made'),
        actionItems: aiService.extractSection(formattedContent, 'Action Items'),
        rawTranscript: transcript,
        formattedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI formatting error:', error.response?.data || error.message);
      // Fallback to basic formatting
      return aiService.basicFormat(transcript);
    }
  },

  /**
   * Basic formatting without AI (fallback)
   * @param {string} transcript - Transcript text
   * @returns {Object} Basic formatted notes
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
   * @param {string} content - Full formatted content
   * @param {string} section - Section name to extract
   * @returns {string} Extracted section content
   */
  extractSection: (content, section) => {
    const regex = new RegExp(`${section}[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\d+\\.|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
};

module.exports = aiService;

const transcriptService = {
  /**
   * Clean and normalize transcript text
   * @param {string} rawTranscript - Raw transcript from Google Meet
   * @returns {string} Cleaned transcript
   */
  cleanTranscript: (rawTranscript) => {
    if (!rawTranscript) {
      throw new Error('Transcript is required');
    }

    let cleaned = rawTranscript
      // Remove timestamps
      .replace(/\[\d{1,2}:\d{2}:\d{2}\]/g, '')
      // Remove speaker labels if they follow a pattern like "Speaker 1:"
      .replace(/^(Speaker \d+:|[A-Z][a-z]+ [A-Z][a-z]+:)/gm, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove multiple line breaks
      .replace(/\n\s*\n/g, '\n')
      // Trim
      .trim();

    return cleaned;
  },

  /**
   * Extract speakers from transcript
   * @param {string} transcript - Transcript text
   * @returns {Array} Array of unique speakers
   */
  extractSpeakers: (transcript) => {
    const speakerPattern = /^([A-Z][a-z]+ [A-Z][a-z]+):/gm;
    const matches = transcript.matchAll(speakerPattern);
    const speakers = new Set();
    
    for (const match of matches) {
      speakers.add(match[1]);
    }
    
    return Array.from(speakers);
  },

  /**
   * Split transcript into segments by speaker
   * @param {string} transcript - Transcript text
   * @returns {Array} Array of segments with speaker and text
   */
  segmentBySpeaker: (transcript) => {
    const lines = transcript.split('\n');
    const segments = [];
    let currentSpeaker = null;
    let currentText = '';

    lines.forEach(line => {
      const speakerMatch = line.match(/^([A-Z][a-z]+ [A-Z][a-z]+):\s*(.*)$/);
      
      if (speakerMatch) {
        if (currentSpeaker && currentText) {
          segments.push({
            speaker: currentSpeaker,
            text: currentText.trim()
          });
        }
        currentSpeaker = speakerMatch[1];
        currentText = speakerMatch[2];
      } else {
        currentText += ' ' + line;
      }
    });

    if (currentSpeaker && currentText) {
      segments.push({
        speaker: currentSpeaker,
        text: currentText.trim()
      });
    }

    return segments;
  }
};

module.exports = transcriptService;

/**
 * Utility functions for formatting and data manipulation
 */

const formatter = {
  /**
   * Format date to readable string
   * @param {Date|string} date - Date object or ISO string
   * @returns {string} Formatted date string
   */
  formatDate: (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Format duration in minutes
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration (e.g., "1h 30m")
   */
  formatDuration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text with ellipsis
   */
  truncate: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  },

  /**
   * Sanitize filename
   * @param {string} filename - Original filename
   * @returns {string} Sanitized filename
   */
  sanitizeFilename: (filename) => {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  },

  /**
   * Convert markdown to plain text
   * @param {string} markdown - Markdown text
   * @returns {string} Plain text
   */
  markdownToPlainText: (markdown) => {
    return markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/`(.+?)`/g, '$1') // Remove code
      .trim();
  },

  /**
   * Generate slug from text
   * @param {string} text - Text to slugify
   * @returns {string} URL-friendly slug
   */
  slugify: (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};

module.exports = formatter;

const { Client } = require('@notionhq/client');
require('dotenv').config();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const notionService = {
  /**
   * Upload formatted notes to Notion
   * @param {Object} notes - Formatted notes object
   * @param {string} databaseId - Target Notion database ID
   * @returns {Object} Created page information
   */
  uploadNotes: async (notes, databaseId) => {
    try {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }

      const page = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: notes.title || `Meeting Notes - ${new Date().toLocaleDateString()}`
                }
              }
            ]
          },
          Date: {
            date: {
              start: notes.date || new Date().toISOString()
            }
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: '📝 Summary' } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: notes.summary || 'No summary available' } }]
            }
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: '💡 Key Discussion Points' } }]
            }
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: notes.keyPoints || 'No key points extracted' } }]
            }
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: '✅ Action Items' } }]
            }
          },
          {
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [{ type: 'text', text: { content: notes.actionItems || 'No action items identified' } }],
              checked: false
            }
          }
        ]
      });

      return {
        id: page.id,
        url: page.url
      };
    } catch (error) {
      console.error('Notion upload error:', error);
      throw new Error(`Failed to upload to Notion: ${error.message}`);
    }
  },

  /**
   * List available Notion databases
   * @returns {Array} List of databases
   */
  listDatabases: async () => {
    try {
      const response = await notion.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      return response.results.map(db => ({
        id: db.id,
        title: db.title[0]?.plain_text || 'Untitled',
        url: db.url
      }));
    } catch (error) {
      console.error('Error listing databases:', error);
      throw new Error(`Failed to list Notion databases: ${error.message}`);
    }
  },

  /**
   * Create a new Notion page
   * @param {string} title - Page title
   * @param {string} content - Page content
   * @param {string} databaseId - Parent database ID
   * @returns {Object} Created page
   */
  createPage: async (title, content, databaseId) => {
    try {
      const page = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: { content: title }
              }
            ]
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content } }]
            }
          }
        ]
      });

      return page;
    } catch (error) {
      console.error('Error creating page:', error);
      throw new Error(`Failed to create Notion page: ${error.message}`);
    }
  }
};

module.exports = notionService;

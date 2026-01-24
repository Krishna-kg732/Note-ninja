/**
 * Extension Configuration
 * Centralized config to avoid hardcoding values throughout the extension
 */

const CONFIG = {
    // API Base URL - change this when deploying to production
    API_BASE_URL: 'http://localhost:3000',

    // API Endpoints
    ENDPOINTS: {
        AUTH_NOTION: '/auth/notion',
        AUTH_CALLBACK: '/auth/callback',
        MEETINGS_CREATE: '/meetings/create',
        MEETINGS_PROCESS: (id) => `/meetings/${id}/process`,
        NOTION_UPLOAD: '/notion/upload',
        NOTION_DATABASES: '/notion/databases'
    },

    // Storage Keys
    STORAGE_KEYS: {
        NOTION_TOKEN: 'notionToken',
        IS_RECORDING: 'isRecording',
        CURRENT_MEETING: 'currentMeeting',
        TRANSCRIPT_DATA: 'transcriptData'
    },

    // UI Messages
    MESSAGES: {
        CONNECTED: 'Connected to Notion',
        DISCONNECTED: 'Not Connected',
        RECORDING: 'Recording in progress...',
        EXPORT_SUCCESS: 'Notes exported to Notion successfully!',
        EXPORT_FAILED: 'Failed to export notes. Please try again.',
        EXPORT_ERROR: 'An error occurred while exporting notes.',
        NOT_AUTHENTICATED: 'Not authenticated with Notion'
    },

    // Google Meet selectors (may need updates when Meet UI changes)
    MEET_SELECTORS: {
        TRANSCRIPT: [
            '[data-message-text]',
            '.iOzk7',
            '.iTTPOb',
            '.z38b',
            '[data-self-name]'
        ],
        SPEAKER_ATTR: 'data-sender-name'
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.MESSAGES);
Object.freeze(CONFIG.MEET_SELECTORS);

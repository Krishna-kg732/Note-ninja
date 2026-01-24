// Background service worker for Note Ninja
console.log('Note Ninja: Background service worker loaded');

// Import config (service workers can't use ES modules, so we'll inline critical values)
// In production, consider bundling with webpack/rollup
const API_BASE_URL = 'http://localhost:3000'; // TODO: Load from config or env

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Note Ninja: Extension installed');
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    'saveToken': () => handleSaveToken(request, sendResponse),
    'exportToNotion': () => handleExportToNotion(request, sendResponse)
  };

  const handler = handlers[request.action];
  if (handler) {
    handler();
    return true; // Keep channel open for async response
  }
});

// Token save handler
function handleSaveToken(request, sendResponse) {
  chrome.storage.local.set({ notionToken: request.token }, () => {
    console.log('Note Ninja: Token saved');
    sendResponse({ success: true });
  });
}

// Export handler
function handleExportToNotion(request, sendResponse) {
  handleExport(request.data)
    .then(result => sendResponse(result))
    .catch(error => sendResponse({ success: false, error: error.message }));
}

// Handle export to Notion
async function handleExport(data) {
  const { notionToken } = await chrome.storage.local.get('notionToken');

  if (!notionToken) {
    throw new Error('Not authenticated with Notion');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${notionToken}`
  };

  // Create meeting record
  const meetingResponse = await fetch(`${API_BASE_URL}/meetings/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: data.title,
      date: data.date,
      participants: data.participants
    })
  });

  if (!meetingResponse.ok) {
    throw new Error('Failed to create meeting record');
  }

  const meeting = await meetingResponse.json();

  // Process transcript
  const processResponse = await fetch(`${API_BASE_URL}/meetings/${meeting.meeting.id}/process`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ transcript: data.transcript })
  });

  if (!processResponse.ok) {
    throw new Error('Failed to process transcript');
  }

  const result = await processResponse.json();

  return { success: true, notes: result.notes };
}

// Monitor Google Meet tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isGoogleMeet = changeInfo.status === 'complete' && tab.url?.includes('meet.google.com');

  if (isGoogleMeet) {
    console.log('Note Ninja: Google Meet tab detected');
    chrome.tabs.sendMessage(tabId, { action: 'init' }).catch(() => {
      // Content script not ready yet, ignore
    });
  }
});

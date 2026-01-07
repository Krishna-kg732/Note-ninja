// Background service worker for Note Ninja
console.log('Note Ninja: Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Note Ninja: Extension installed');
    // Open welcome page or setup instructions
    chrome.tabs.create({
      url: 'https://github.com/yourusername/note-ninja'
    });
  }
});

// Listen for OAuth callback
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToken') {
    chrome.storage.local.set({ notionToken: request.token }, () => {
      console.log('Note Ninja: Token saved');
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'exportToNotion') {
    handleExport(request.data)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Handle export to Notion
async function handleExport(data) {
  try {
    const { notionToken } = await chrome.storage.local.get('notionToken');
    
    if (!notionToken) {
      throw new Error('Not authenticated with Notion');
    }
    
    // Create meeting record
    const meetingResponse = await fetch('http://localhost:3000/meetings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notionToken}`
      },
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
    const processResponse = await fetch(`http://localhost:3000/meetings/${meeting.meeting.id}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notionToken}`
      },
      body: JSON.stringify({
        transcript: data.transcript
      })
    });
    
    if (!processResponse.ok) {
      throw new Error('Failed to process transcript');
    }
    
    const result = await processResponse.json();
    
    return {
      success: true,
      notes: result.notes
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Monitor Google Meet tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('meet.google.com')) {
    console.log('Note Ninja: Google Meet tab detected');
    // Inject content script if needed
    chrome.tabs.sendMessage(tabId, { action: 'init' }).catch(() => {
      // Content script not ready yet, ignore
    });
  }
});

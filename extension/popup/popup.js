// Note Ninja Chrome Extension Popup
// This will be replaced with React components in production

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  // Check authentication status
  chrome.storage.local.get(['notionToken', 'isRecording'], (result) => {
    const isAuthenticated = !!result.notionToken;
    const isRecording = result.isRecording || false;
    
    root.innerHTML = `
      <div class="container">
        <div class="header">
          <div class="logo">🥷</div>
          <h1>Note Ninja</h1>
          <p class="tagline">Meet to Notion</p>
        </div>
        
        <div class="status ${isAuthenticated ? 'connected' : 'disconnected'}">
          ${isAuthenticated ? '✓ Connected to Notion' : '✗ Not Connected'}
        </div>
        
        ${isRecording ? `
          <div class="status recording">
            🔴 Recording in progress...
          </div>
          <div class="meeting-info">
            <p><strong>Status:</strong> Capturing transcript</p>
            <p><strong>Duration:</strong> --:--</p>
          </div>
        ` : ''}
        
        ${!isAuthenticated ? `
          <button class="button button-primary" id="connectBtn">
            Connect to Notion
          </button>
        ` : `
          <button class="button button-primary" id="exportBtn" ${!isRecording ? 'disabled' : ''}>
            Export to Notion
          </button>
          <button class="button button-secondary" id="disconnectBtn">
            Disconnect
          </button>
        `}
        
        <p class="info">
          ${!isAuthenticated 
            ? 'Connect your Notion account to start saving meeting notes'
            : 'Join a Google Meet to start capturing transcripts'
          }
        </p>
      </div>
    `;
    
    // Event listeners
    const connectBtn = document.getElementById('connectBtn');
    const exportBtn = document.getElementById('exportBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    if (connectBtn) {
      connectBtn.addEventListener('click', handleConnect);
    }
    
    if (exportBtn) {
      exportBtn.addEventListener('click', handleExport);
    }
    
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', handleDisconnect);
    }
  });
});

function handleConnect() {
  // Open OAuth flow
  const authUrl = 'http://localhost:3000/auth/notion';
  chrome.tabs.create({ url: authUrl });
}

function handleExport() {
  // Get transcript and send to backend
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getTranscript' }, (response) => {
      if (response && response.transcript) {
        exportToNotion(response.transcript);
      }
    });
  });
}

function handleDisconnect() {
  chrome.storage.local.remove(['notionToken'], () => {
    location.reload();
  });
}

async function exportToNotion(transcript) {
  try {
    const { notionToken } = await chrome.storage.local.get('notionToken');
    
    // Send to backend
    const response = await fetch('http://localhost:3000/meetings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notionToken}`
      },
      body: JSON.stringify({
        title: `Meeting Notes - ${new Date().toLocaleDateString()}`,
        transcript: transcript,
        date: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      alert('Notes exported to Notion successfully!');
    } else {
      alert('Failed to export notes. Please try again.');
    }
  } catch (error) {
    console.error('Export error:', error);
    alert('An error occurred while exporting notes.');
  }
}

// Note Ninja Chrome Extension Popup

const API_BASE_URL = 'http://localhost:3000'; // TODO: Load from config

const STORAGE_KEYS = {
  NOTION_TOKEN: 'notionToken',
  IS_RECORDING: 'isRecording'
};

document.addEventListener('DOMContentLoaded', initPopup);

async function initPopup() {
  const root = document.getElementById('root');
  const storage = await chrome.storage.local.get([STORAGE_KEYS.NOTION_TOKEN, STORAGE_KEYS.IS_RECORDING]);

  const state = {
    isAuthenticated: !!storage[STORAGE_KEYS.NOTION_TOKEN],
    isRecording: storage[STORAGE_KEYS.IS_RECORDING] || false
  };

  root.innerHTML = renderUI(state);
  attachEventListeners(state);
}

function renderUI({ isAuthenticated, isRecording }) {
  return `
    <div class="container">
      <div class="header">
        <div class="logo">NN</div>
        <h1>Note Ninja</h1>
        <p class="tagline">Meet to Notion</p>
      </div>
      
      <div class="status ${isAuthenticated ? 'connected' : 'disconnected'}">
        ${isAuthenticated ? 'Connected to Notion' : 'Not Connected'}
      </div>
      
      ${isRecording ? renderRecordingStatus() : ''}
      ${renderButtons(isAuthenticated, isRecording)}
      
      <p class="info">
        ${isAuthenticated
      ? 'Join a Google Meet to start capturing transcripts'
      : 'Connect your Notion account to start saving meeting notes'
    }
      </p>
    </div>
  `;
}

function renderRecordingStatus() {
  return `
    <div class="status recording">Recording in progress...</div>
    <div class="meeting-info">
      <p><strong>Status:</strong> Capturing transcript</p>
      <p><strong>Duration:</strong> --:--</p>
    </div>
  `;
}

function renderButtons(isAuthenticated, isRecording) {
  if (!isAuthenticated) {
    return `<button class="button button-primary" id="connectBtn">Connect to Notion</button>`;
  }

  return `
    <button class="button button-primary" id="exportBtn" ${!isRecording ? 'disabled' : ''}>
      Export to Notion
    </button>
    <button class="button button-secondary" id="disconnectBtn">Disconnect</button>
  `;
}

function attachEventListeners(state) {
  const buttons = {
    connectBtn: handleConnect,
    exportBtn: handleExport,
    disconnectBtn: handleDisconnect
  };

  Object.entries(buttons).forEach(([id, handler]) => {
    document.getElementById(id)?.addEventListener('click', handler);
  });
}

function handleConnect() {
  chrome.tabs.create({ url: `${API_BASE_URL}/auth/notion` });
}

async function handleExport() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: 'getTranscript' }, async (response) => {
    if (response?.transcript) {
      await exportToNotion(response.transcript);
    }
  });
}

function handleDisconnect() {
  chrome.storage.local.remove([STORAGE_KEYS.NOTION_TOKEN], () => location.reload());
}

async function exportToNotion(transcript) {
  try {
    const { [STORAGE_KEYS.NOTION_TOKEN]: notionToken } = await chrome.storage.local.get(STORAGE_KEYS.NOTION_TOKEN);

    const response = await fetch(`${API_BASE_URL}/meetings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notionToken}`
      },
      body: JSON.stringify({
        title: `Meeting Notes - ${new Date().toLocaleDateString()}`,
        transcript,
        date: new Date().toISOString()
      })
    });

    alert(response.ok
      ? 'Notes exported to Notion successfully!'
      : 'Failed to export notes. Please try again.'
    );
  } catch (error) {
    console.error('Export error:', error);
    alert('An error occurred while exporting notes.');
  }
}

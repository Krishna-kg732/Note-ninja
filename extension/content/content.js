// Content script for Google Meet
console.log('Note Ninja: Content script loaded');

let transcriptData = [];
let isCapturing = false;

// Initialize transcript capture
function initTranscriptCapture() {
  console.log('Note Ninja: Initializing transcript capture');
  
  // Check if we're on a Google Meet page
  if (!window.location.hostname.includes('meet.google.com')) {
    return;
  }
  
  // Observe DOM for transcript elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          captureTranscriptElement(node);
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  isCapturing = true;
  chrome.storage.local.set({ isRecording: true });
}

// Capture transcript from DOM elements
function captureTranscriptElement(element) {
  // Google Meet transcript selectors (these may need to be updated)
  const transcriptSelectors = [
    '[data-message-text]',
    '.iOzk7',
    '.iTTPOb',
    '.z38b'
  ];
  
  transcriptSelectors.forEach(selector => {
    const transcriptElements = element.querySelectorAll(selector);
    transcriptElements.forEach(el => {
      const text = el.textContent.trim();
      const speaker = el.getAttribute('data-sender-name') || 'Unknown';
      
      if (text && !transcriptExists(text)) {
        transcriptData.push({
          speaker: speaker,
          text: text,
          timestamp: new Date().toISOString()
        });
        
        console.log('Note Ninja: Captured:', { speaker, text });
      }
    });
  });
}

// Check if transcript already exists
function transcriptExists(text) {
  return transcriptData.some(item => item.text === text);
}

// Get full transcript
function getTranscript() {
  return transcriptData.map(item => {
    return `${item.speaker}: ${item.text}`;
  }).join('\n');
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTranscript') {
    sendResponse({ transcript: getTranscript() });
  } else if (request.action === 'startCapture') {
    initTranscriptCapture();
    sendResponse({ success: true });
  } else if (request.action === 'stopCapture') {
    isCapturing = false;
    chrome.storage.local.set({ isRecording: false });
    sendResponse({ success: true });
  }
  return true;
});

// Auto-start capture when page loads
window.addEventListener('load', () => {
  setTimeout(initTranscriptCapture, 2000); // Wait for Meet to load
});

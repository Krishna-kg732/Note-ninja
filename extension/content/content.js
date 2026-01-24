// Content script for Google Meet
console.log('Note Ninja: Content script loaded');

// Selectors for Google Meet captions (may need updates as Meet UI changes)
const TRANSCRIPT_SELECTORS = [
  '[data-message-text]',
  '.iOzk7',
  '.iTTPOb',
  '.z38b'
];

const SPEAKER_ATTR = 'data-sender-name';
const DEFAULT_SPEAKER = 'Unknown';

let transcriptData = [];
let isCapturing = false;
let observer = null;

// Initialize transcript capture
function initTranscriptCapture() {
  if (!isGoogleMeetPage()) return;

  console.log('Note Ninja: Initializing transcript capture');

  observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  isCapturing = true;
  chrome.storage.local.set({ isRecording: true });
}

function isGoogleMeetPage() {
  return window.location.hostname.includes('meet.google.com');
}

function handleMutations(mutations) {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        captureTranscriptElement(node);
      }
    });
  });
}

// Capture transcript from DOM elements
function captureTranscriptElement(element) {
  TRANSCRIPT_SELECTORS.forEach(selector => {
    const elements = element.querySelectorAll?.(selector) || [];

    elements.forEach(el => {
      const text = el.textContent?.trim();
      if (!text || transcriptExists(text)) return;

      const speaker = el.getAttribute(SPEAKER_ATTR) || DEFAULT_SPEAKER;

      transcriptData.push({
        speaker,
        text,
        timestamp: new Date().toISOString()
      });

      console.log('Note Ninja: Captured:', { speaker, text });
    });
  });
}

function transcriptExists(text) {
  return transcriptData.some(item => item.text === text);
}

function getTranscript() {
  return transcriptData
    .map(item => `${item.speaker}: ${item.text}`)
    .join('\n');
}

function stopCapture() {
  isCapturing = false;
  observer?.disconnect();
  chrome.storage.local.set({ isRecording: false });
}

// Message handlers
const messageHandlers = {
  getTranscript: () => ({ transcript: getTranscript() }),
  startCapture: () => { initTranscriptCapture(); return { success: true }; },
  stopCapture: () => { stopCapture(); return { success: true }; },
  init: () => { initTranscriptCapture(); return { success: true }; }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handler = messageHandlers[request.action];
  if (handler) {
    sendResponse(handler());
  }
  return true;
});

// Auto-start capture when page loads
window.addEventListener('load', () => {
  setTimeout(initTranscriptCapture, 2000);
});

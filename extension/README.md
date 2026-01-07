# Note Ninja Chrome Extension

## Setup Instructions

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder

### 2. Configure Icons

Create or add the following icon files to the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use the 🥷 emoji or create custom icons.

### 3. Backend Connection

Make sure the backend server is running on `http://localhost:3000` before using the extension.

### 4. Usage

1. Click the extension icon to open the popup
2. Connect to Notion
3. Join a Google Meet
4. The extension will automatically capture the transcript
5. Click "Export to Notion" when the meeting ends

## Development

### Testing

1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Note Ninja extension card
4. Test your changes

### File Structure

- `manifest.json` - Extension configuration
- `popup/` - Extension popup UI
  - `popup.html` - Popup HTML
  - `popup.css` - Popup styles
  - `popup.js` - Popup logic
- `content/` - Content scripts (runs on Google Meet pages)
  - `content.js` - Transcript capture logic
  - `content.css` - Injection styles
- `background/` - Background service worker
  - `background.js` - Background tasks and OAuth handling
- `icons/` - Extension icons

## Future Enhancements

- [ ] Add React for popup UI
- [ ] Improve transcript detection algorithms
- [ ] Add real-time preview of captured transcript
- [ ] Support for multiple meeting platforms
- [ ] Offline transcript storage
- [ ] Custom formatting templates

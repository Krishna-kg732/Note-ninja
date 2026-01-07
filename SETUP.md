# 🥷 Note Ninja - Quick Start Guide

Welcome to Note Ninja! This guide will help you set up the complete project in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **Chrome Browser** - [Download](https://www.google.com/chrome/)
- ✅ **Notion Account** - [Sign up](https://www.notion.so/)
- ✅ **Git** - [Download](https://git-scm.com/)

## 🚀 Setup Instructions

### Step 1: Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - The `.env` file has been created from `.env.example`
   - Edit `backend/.env` and add your credentials:
   
   ```env
   # Get these from https://www.notion.so/my-integrations
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
   NOTION_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   NOTION_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxxxxxxx
   
   # Get this from OpenAI or your preferred AI provider
   AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
   ```

4. **Start the backend server:**
   ```bash
   # Development mode (auto-reload)
   npm run dev
   
   # OR Production mode
   npm start
   ```

   You should see:
   ```
   🚀 Note Ninja Backend Server running on port 3000
   📝 Environment: development
   🔗 Server URL: http://localhost:3000
   ```

### Step 2: Extension Setup

1. **Add extension icons:**
   - Create or download icons for the extension
   - Place them in `extension/icons/` folder:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)

2. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `extension` folder from this project
   - The Note Ninja extension should now appear in your extensions list

3. **Update CORS settings:**
   - After loading the extension, copy its ID from the extensions page
   - Update `backend/.env`:
     ```env
     ALLOWED_ORIGINS=http://localhost:3000,chrome-extension://YOUR_EXTENSION_ID
     ```
   - Restart the backend server

### Step 3: Notion Integration Setup

1. **Create a Notion Integration:**
   - Go to [Notion Developers](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Name it "Note Ninja"
   - Select your workspace
   - Copy the "Internal Integration Token"
   - Paste it as `NOTION_API_KEY` in `backend/.env`

2. **For OAuth (optional):**
   - In your integration settings, configure OAuth
   - Set redirect URL to: `http://localhost:3000/auth/callback`
   - Copy Client ID and Client Secret to `.env`

3. **Share a database with your integration:**
   - Create or open a Notion database
   - Click "Share" → "Invite"
   - Select your "Note Ninja" integration
   - This database will receive your meeting notes

## 📱 Using Note Ninja

### First Time Setup

1. **Connect to Notion:**
   - Click the Note Ninja extension icon
   - Click "Connect to Notion"
   - Authorize the integration

2. **Join a Google Meet:**
   - Start or join any Google Meet meeting
   - Enable captions/transcripts in the meeting settings

3. **Capture Notes:**
   - Note Ninja will automatically detect and capture the transcript
   - You'll see a recording indicator on the Meet page

4. **Export to Notion:**
   - When the meeting ends (or anytime during), click the extension icon
   - Click "Export to Notion"
   - Your formatted notes will appear in your Notion database

## 🧪 Testing the Setup

### Test Backend

```bash
# Health check
curl http://localhost:3000/health

# Expected response:
{
  "status": "OK",
  "message": "Note Ninja Backend is running",
  "timestamp": "2026-01-07T..."
}
```

### Test Extension

1. Open any Google Meet link
2. Check browser console for: `Note Ninja: Content script loaded`
3. Click the extension icon
4. Verify the popup displays correctly

## 📁 Project Structure

```
Note-Ninja/
├── backend/              # Node.js + Express server
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth & rate limiting
│   ├── utils/           # Helper functions
│   ├── app.js           # Express configuration
│   └── server.js        # Server entry point
│
└── extension/           # Chrome Extension
    ├── manifest.json    # Extension config
    ├── popup/           # Popup UI
    ├── content/         # Content scripts
    ├── background/      # Background worker
    └── icons/           # Extension icons
```

## 🔧 Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Change port in backend/.env
PORT=3001
```

**Notion API errors:**
- Verify your API key is correct
- Ensure your database is shared with the integration
- Check that your integration has proper permissions

### Extension Issues

**Extension not loading:**
- Make sure you selected the `extension` folder, not the root folder
- Check for errors in `chrome://extensions/`
- Verify all required files exist

**Can't capture transcript:**
- Enable captions in Google Meet settings
- Check browser console for errors
- Refresh the Meet page after installing the extension

**CORS errors:**
- Add your extension ID to `ALLOWED_ORIGINS` in `.env`
- Restart the backend server

## 🎯 Next Steps

1. **Customize AI formatting** - Edit `backend/services/ai.service.js`
2. **Add database support** - Replace in-memory storage
3. **Enhance UI** - Add React to extension popup
4. **Deploy backend** - Use Heroku, Railway, or similar
5. **Publish extension** - Submit to Chrome Web Store

## 📚 Additional Resources

- [Backend README](backend/README.md)
- [Extension README](extension/README.md)
- [Notion API Docs](https://developers.notion.com/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)

## 🆘 Need Help?

- Check the README files in each folder
- Open an issue on GitHub
- Read the inline code comments

---

**Made with ❤️ by the Note Ninja team**

Happy note-taking! 🥷📝

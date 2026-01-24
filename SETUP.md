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
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `backend/.env` and add your credentials:
   
   ```env
   # Notion (see Step 3 for details)
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
   NOTION_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   NOTION_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxxxxxxx
   NOTION_REDIRECT_URI=http://localhost:3000/auth/callback
   
   # Google Gemini AI (get from https://aistudio.google.com/apikey)
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   GEMINI_MODEL=gemini-2.0-flash
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

This step is **required** for the extension to work. Follow these steps carefully:

#### 3.1 Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name:** `Note Ninja`
   - **Associated workspace:** Select your workspace
   - **Type:** Select **"Public"** (NOT Internal)
   
   > ⚠️ **Important:** You MUST select "Public" integration type to get OAuth credentials (Client ID & Secret). Internal integrations don't support OAuth.

4. Click **"Submit"**

#### 3.2 Get Your API Key (Internal Token)

After creating the integration:

1. You'll see the **"Internal Integration Secret"** (starts with `secret_`)
2. Click **"Show"** then **"Copy"**
3. Paste this as `NOTION_API_KEY` in your `backend/.env` file:
   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

#### 3.3 Enable OAuth & Get Client Credentials

To allow users to connect their own Notion accounts:

1. In your integration settings, scroll to **"Distribution"**
2. Toggle **"Public integration"** to ON
3. Fill in the OAuth settings:
   - **Redirect URIs:** `http://localhost:3000/auth/callback`
   - **Company name:** Your name or company
   - **Website:** Can be any URL (e.g., `https://github.com/your-username`)
   - **Privacy policy URL:** Can be any URL for development
   - **Terms of use URL:** Can be any URL for development
4. Click **"Save changes"**

5. After saving, you'll see new OAuth credentials:
   - **OAuth client ID** → Copy to `NOTION_CLIENT_ID`
   - **OAuth client secret** → Copy to `NOTION_CLIENT_SECRET`

6. Update your `backend/.env`:
   ```env
   NOTION_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   NOTION_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

#### 3.4 Share a Database with Your Integration

For the integration to write notes, you need to share a Notion database:

1. Open Notion and create a new database (or use an existing one)
2. Click the **"..."** menu in the top-right corner
3. Click **"Connections"** → **"Add connections"**
4. Search for and select **"Note Ninja"** (your integration)
5. Click **"Confirm"**

> ⚠️ **Important:** The integration can ONLY access pages/databases that have been explicitly shared with it. If you get "object not found" errors, make sure the database is shared.

#### 3.5 Final `.env` Configuration

Your complete Notion configuration should look like:

```env
# Notion API Configuration
NOTION_API_KEY=secret_abc123...
NOTION_CLIENT_ID=12345678-abcd-1234-efgh-123456789abc
NOTION_CLIENT_SECRET=secret_xyz789...
NOTION_REDIRECT_URI=http://localhost:3000/auth/callback
```

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

<div align="center">

# 🥷 Note Ninja

### Transform Google Meet Transcripts into Beautiful Notion Notes

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen?logo=google-chrome&logoColor=white)](https://chrome.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome">
</p>

</div>

---

## 📖 About

**Note Ninja** is a powerful Chrome extension that automatically converts Google Meet transcripts into well-formatted notes and uploads them directly to Notion. Never miss important meeting details again – let Note Ninja handle your meeting documentation while you focus on what matters.

### ✨ Key Features

- 🎯 **Automatic Transcript Capture** - Seamlessly extracts transcripts from Google Meet
- 🤖 **AI-Powered Formatting** - Intelligently converts raw transcripts into structured notes
- 📝 **Smart Summarization** - Generates concise summaries, action items, and key points
- 🚀 **Direct Notion Integration** - Automatically uploads formatted notes to your Notion workspace
- 🔐 **Secure OAuth Authentication** - Safe and secure access to your Notion account
- ⚡ **Real-time Processing** - Get your notes ready as soon as the meeting ends

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Integration |
|----------|---------|-------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat) | ![Notion](https://img.shields.io/badge/-Notion-000000?logo=notion&logoColor=white&style=flat) |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white&style=flat) | ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat) | ![Google Meet](https://img.shields.io/badge/-Google_Meet-00897B?logo=google-meet&logoColor=white&style=flat) |
| ![Chrome Extension](https://img.shields.io/badge/-Chrome_API-4285F4?logo=google-chrome&logoColor=white&style=flat) | ![REST API](https://img.shields.io/badge/-REST_API-FF6C37?logo=postman&logoColor=white&style=flat) | ![OAuth 2.0](https://img.shields.io/badge/-OAuth_2.0-EB5424?logo=auth0&logoColor=white&style=flat) |

</div>

---

## 📁 Project Structure

```
Note-Ninja/
│
├── 📂 backend/                        # Backend Server
│   ├── routes/
│   │   ├── meetings.routes.js        # Meeting endpoints (/meetings)
│   │   ├── notion.routes.js          # Notion integration (/notion)
│   │   └── auth.routes.js            # OAuth authentication
│   │
│   ├── services/
│   │   ├── transcript.service.js     # Transcript processing
│   │   ├── ai.service.js             # AI-powered formatting
│   │   └── notion.service.js         # Notion API integration
│   │
│   ├── controllers/
│   │   └── meeting.controller.js     # Business logic
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js        # Authentication middleware
│   │   └── rateLimit.middleware.js   # API rate limiting
│   │
│   ├── utils/
│   │   └── formatter.js              # Helper utilities
│   │
│   ├── app.js                        # Express app configuration
│   └── server.js                     # Server entry point
│
└── 📂 extension/                      # Chrome Extension
    ├── manifest.json                 # Extension manifest
    ├── popup/                        # Extension popup UI (React)
    ├── content/                      # Content scripts
    └── background/                   # Background scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Chrome browser
- Notion account
- Google Meet access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/note-ninja.git
   cd note-ninja
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=3000
   NOTION_API_KEY=your_notion_api_key
   NOTION_CLIENT_ID=your_notion_client_id
   NOTION_CLIENT_SECRET=your_notion_client_secret
   REDIRECT_URI=http://localhost:3000/auth/callback
   AI_API_KEY=your_ai_api_key
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Load the Chrome extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` directory

---

## 📖 Usage

1. **Authenticate with Notion**
   - Click the Note Ninja extension icon
   - Click "Connect to Notion"
   - Authorize the extension

2. **Join a Google Meet**
   - Start or join any Google Meet meeting
   - Enable captions/transcripts in the meeting

3. **Capture Notes**
   - Note Ninja automatically detects and captures the transcript
   - Click the extension icon to see real-time status

4. **Export to Notion**
   - When the meeting ends, click "Export to Notion"
   - Your formatted notes will be automatically uploaded
   - Find them in your designated Notion database

---

## 🔌 API Endpoints

### Meetings
```
POST   /meetings/create       # Create new meeting record
GET    /meetings/:id          # Get meeting details
POST   /meetings/:id/process  # Process transcript
```

### Notion
```
POST   /notion/upload         # Upload notes to Notion
GET    /notion/databases      # List available databases
POST   /notion/create-page    # Create new Notion page
```

### Authentication
```
GET    /auth/notion           # Initiate Notion OAuth
GET    /auth/callback         # OAuth callback handler
POST   /auth/refresh          # Refresh access token
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👥 Authors

- **Krishna Gupta** - [GitHub Profile](https://github.com/Krishna-kg732)

- **Kunal Shaw** - [GitHub Profile](https://github.com/myselfkunal)

---

## 🙏 Acknowledgments

- Google Meet for transcript access
- Notion for their amazing API
- The open-source community

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by the Note Ninja team**

</div>


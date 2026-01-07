# Note Ninja Backend

Backend server for Note Ninja Chrome Extension - transforms Google Meet transcripts into formatted Notion notes.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

Required configuration:
- `NOTION_API_KEY` - Your Notion integration API key
- `NOTION_CLIENT_ID` - Notion OAuth client ID
- `NOTION_CLIENT_SECRET` - Notion OAuth client secret
- `AI_API_KEY` - OpenAI or other AI provider API key

### 3. Get Notion Credentials

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Internal Integration Token (this is your `NOTION_API_KEY`)
4. For OAuth, set up OAuth credentials and get Client ID and Secret

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Health Check
```
GET /health
```

### Meetings
```
POST   /meetings/create       - Create new meeting record
GET    /meetings/:id          - Get meeting details
POST   /meetings/:id/process  - Process transcript
GET    /meetings              - Get all meetings
DELETE /meetings/:id          - Delete meeting
```

### Notion
```
POST   /notion/upload         - Upload notes to Notion
GET    /notion/databases      - List available databases
POST   /notion/create-page    - Create new Notion page
```

### Authentication
```
GET    /auth/notion           - Initiate Notion OAuth
GET    /auth/callback         - OAuth callback handler
POST   /auth/refresh          - Refresh access token
```

## Project Structure

```
backend/
├── routes/              # API route handlers
├── services/            # Business logic services
├── controllers/         # Request controllers
├── middlewares/         # Express middlewares
├── utils/              # Utility functions
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## Development

### Adding New Routes

1. Create route file in `routes/`
2. Import in `app.js`
3. Add route handler

### Adding New Services

1. Create service file in `services/`
2. Implement service methods
3. Use in controllers

## Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Create meeting (requires auth token)
curl -X POST http://localhost:3000/meetings/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Meeting"}'
```

## Deployment

### Environment Variables for Production

- Set `NODE_ENV=production`
- Update `ALLOWED_ORIGINS` with your production URLs
- Use secure tokens and secrets
- Consider using a database instead of in-memory storage

### Recommended Hosting

- Heroku
- Railway
- Render
- AWS/GCP/Azure

## Security Notes

- Never commit `.env` file
- Use strong secrets in production
- Implement proper authentication
- Add rate limiting for production
- Use HTTPS in production

## Troubleshooting

### Port already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Notion API errors
- Verify your API key is correct
- Check that your integration has proper permissions
- Ensure the database is shared with your integration

### CORS errors
- Add your extension ID to `ALLOWED_ORIGINS` in `.env`
- Format: `chrome-extension://your-extension-id`

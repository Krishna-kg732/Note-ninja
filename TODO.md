# Note Ninja - Business Logic TODO

## Backend

### 1. `middlewares/validation.middleware.js`

- [ ] **validateMeetingCreate** - Check `title` exists, `date` is valid ISO string
- [ ] **validateTranscript** - Check `transcript` is non-empty string, max 50KB
- [ ] **validateNotionUpload** - Check `databaseId` format, `notes` object exists
- [ ] **validatePageCreate** - Check `title`, `content`, `databaseId` all exist
- [ ] **validateIdParam** - Check `req.params.id` matches expected format

---

### 2. `services/auth.service.js`

- [ ] **buildOAuthUrl** - Return URL: `https://api.notion.com/v1/oauth/authorize?client_id=...&response_type=code&owner=user&redirect_uri=...`
- [ ] **exchangeCodeForToken** - POST to `https://api.notion.com/v1/oauth/token` with Basic auth header
- [ ] **validateToken** - Try calling Notion API `/users/me`, return true if 200
- [ ] **refreshAccessToken** - Notion uses long-lived tokens, may not need refresh
- [ ] **getUserInfo** - GET `https://api.notion.com/v1/users/me` with token

---

### 3. `controllers/auth.controller.js`

- [ ] **initiateOAuth** - Call `authService.buildOAuthUrl()`, redirect user
- [ ] **handleCallback** - Get `code` from `req.query`, call `authService.exchangeCodeForToken(code)`, return token
- [ ] **getCurrentUser** - Get token from header, call `authService.getUserInfo(token)`
- [ ] **validateToken** - Call `authService.validateToken(token)`, return {valid: true/false}
- [ ] **logout** - Clear session/token (if session-based)

---

### 4. `controllers/notion.controller.js`

- [ ] **uploadNotes** - Extract `{notes, databaseId}` from body, call `notionService.uploadNotes(notes, databaseId)`
- [ ] **listDatabases** - Call `notionService.listDatabases()`, return array
- [ ] **createPage** - Extract `{title, content, databaseId}`, call `notionService.createPage(...)`
- [ ] **getPage** - Implement using Notion API: `notion.pages.retrieve({ page_id })`
- [ ] **updatePage** - Implement using Notion API: `notion.pages.update({ page_id, ... })`

---

## Extension

### 5. `content/content.js`

- [ ] Add more Google Meet caption selectors (UI changes frequently)
- [ ] Extract speaker name more reliably
- [ ] Handle transcript panel toggle (start/stop capture)
- [ ] Store transcript in `chrome.storage.local`

---

### 6. `popup/popup.js`

- [ ] Add database selector (fetch from `/notion/databases`)
- [ ] Show transcript preview before export
- [ ] Add loading states for API calls
- [ ] Show success/error toasts

---

### 7. `background/background.js`

- [ ] Handle OAuth redirect: `chrome.tabs.onUpdated` → detect callback URL → extract token
- [ ] Retry failed API calls with backoff
- [ ] Sync auth state across popup/content scripts

---

## Quick Reference

| Notion API Endpoint | Method | Purpose |
|---------------------|--------|---------|
| `/v1/oauth/authorize` | GET | Start OAuth |
| `/v1/oauth/token` | POST | Exchange code for token |
| `/v1/users/me` | GET | Get current user |
| `/v1/search` | POST | List databases |
| `/v1/pages` | POST | Create page |
| `/v1/pages/{id}` | GET | Get page |
| `/v1/pages/{id}` | PATCH | Update page |

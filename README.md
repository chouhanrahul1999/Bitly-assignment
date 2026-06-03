# URL Shortener Service

A REST API built with Node.js, Express, TypeScript, and MongoDB that shortens long URLs — similar to Bitly.

## Features

- Shorten long URLs to short codes
- Redirect short URLs to original URLs
- Track click counts for each short URL
- Analytics endpoint for URL statistics
- Custom short codes
- Expiring URLs

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose
- **Dev Tool**: tsx (hot reload)

## Project Structure

```
src/
├── models/
│   └── Url.ts        # MongoDB schema
├── routes/
│   └── url.ts        # API routes
└── server.ts         # Entry point
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:3000
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Reference

### Shorten a URL

```
POST /shorten
```

Body:
```json
{
  "url": "https://www.google.com",
  "customCode": "google",
  "expiresInDays": 7
}
```

Response:
```json
{
  "shortUrl": "http://localhost:3000/google"
}
```

> `customCode` and `expiresInDays` are optional.

---

### Redirect

```
GET /:code
```

Redirects to the original URL and increments the click count automatically.

---

### Analytics

```
GET /analytics/:code
```

Response:
```json
{
  "shortCode": "google",
  "originalUrl": "https://www.google.com",
  "clicks": 5,
  "createdAt": "2026-06-03T11:48:31.302Z",
  "expiresAt": "2026-06-10T11:48:31.302Z"
}
```

## Error Handling

| Status Code | Reason |
|---|---|
| 400 | URL is missing or invalid format |
| 404 | Short code not found |
| 409 | Custom code already taken |
| 410 | URL has expired |
| 500 | Internal server error |

## Short Code Generation

Short codes are generated using Node.js built-in `crypto` module — no external dependencies needed.

```ts
const generateShortCode = (): string => {
  return randomBytes(4).toString('base64url').slice(0, 6);
};
```

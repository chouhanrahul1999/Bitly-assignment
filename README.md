# URL Shortener Service

A REST API built with Node.js, Express, TypeScript, and MongoDB that shortens long URLs — similar to Bitly.

## Live Demo

> Base URL: `http://3.85.14.227`

## Features

- Shorten long URLs to short codes
- Redirect short URLs to original URLs
- Track click counts for each short URL
- Analytics endpoint for URL statistics
- Custom short codes
- Expiring URLs
- User authentication with JWT

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt
- **Security**: Helmet
- **Dev Tool**: tsx (hot reload)

## DevOps

- **Containerization**: Docker + docker-compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS EC2
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2

## Project Structure

```
src/
├── models/
│   ├── Url.ts           # URL schema
│   └── User.ts          # User schema
├── routes/
│   ├── url.ts           # URL routes
│   ├── register.ts      # Register route
│   └── login.ts         # Login route
├── middleware/
│   └── auth.ts          # JWT middleware
└── server.ts            # Entry point
```

## Infrastructure

```
Internet
    ↓
http://3.85.14.227 (port 80)
    ↓
Nginx (reverse proxy)
    ↓
Node.js app on port 3000 (PM2)
    ↓
MongoDB Atlas (cloud database)
```

## CI/CD Pipeline

```
git push to main
      ↓
GitHub Actions triggers
      ↓
Job 1 — build
  → install dependencies
  → TypeScript type check
  → compile to JavaScript
      ↓
Job 2 — docker
  → build Docker image
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally or MongoDB Atlas

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
JWT_SECRET=your_super_secret_key_change_this
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Run with Docker

```bash
docker compose up --build
```

## API Reference

### Auth

#### Register

```
POST /auth/register
```

Body:
```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

Response:
```json
{
  "message": "User registered successfully"
}
```

---

#### Login

```
POST /auth/login
```

Body:
```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

Response:
```json
{
  "token": "eyJhbGci..."
}
```

---

### Shorten a URL 🔒

> Requires `Authorization: Bearer <token>` header

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
  "shortUrl": "http://3.85.14.227/google"
}
```

> `customCode` and `expiresInDays` are optional.

---

### Redirect

> Public — no token required

```
GET /:code
```

Redirects to the original URL and increments the click count automatically.

---

### Analytics 🔒

> Requires `Authorization: Bearer <token>` header

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

---

## Error Handling

| Status Code | Reason |
|---|---|
| 400 | URL is missing or invalid format |
| 401 | Missing or invalid token |
| 404 | Short code not found |
| 409 | Custom code or email already taken |
| 410 | URL has expired |
| 500 | Internal server error |

## Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- Routes protected with **JWT** tokens (7 day expiry)
- **Helmet** adds HTTP security headers
- **SSRF protection** blocks private/internal URLs
- Raw errors never exposed in responses

## Short Code Generation

Short codes are generated using Node.js built-in `crypto` module — no external dependencies needed.

```ts
const generateShortCode = (): string => {
  return randomBytes(4).toString('base64url').slice(0, 6);
};
```

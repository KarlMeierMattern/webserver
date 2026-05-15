# Webserver

A simple Express/TypeScript HTTP server built as part of a Boot.dev course.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Builds TypeScript and starts the server on `http://localhost:8080`. To capture logs:

```bash
npm run dev | tee server.log
```

## Build & Run

```bash
npm run build
npm start
```

## API

### `GET /api/healthz`

Readiness check. Returns `200` when the server is up.

### `POST /api/validate_chirp`

Validates and filters a chirp body.

**Request:**

```json
{ "body": "your chirp text" }
```

**Responses:**

- `200` — `{ "cleanedBody": "..." }` — chirp is valid (profanity replaced with `****`)
- `400` — `{ "error": "Chirp is too long" }` — body exceeds 140 characters
- `400` — `{ "error": "Invalid JSON in request body" }` — malformed JSON

### `GET /admin/metrics`

Returns request hit count for the `/app` route.

### `POST /admin/reset`

Resets the `/app` route hit counter.

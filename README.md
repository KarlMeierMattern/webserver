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

### Auth

| Method | Path           | Description                                               |
| ------ | -------------- | --------------------------------------------------------- |
| `POST` | `/api/login`   | Log in — returns a JWT access token + refresh token       |
| `POST` | `/api/refresh` | Exchange a refresh token for a new access + refresh token |
| `POST` | `/api/revoke`  | Revoke a refresh token (logout)                           |

### Users

| Method | Path         | Auth       | Description               |
| ------ | ------------ | ---------- | ------------------------- |
| `POST` | `/api/users` | —          | Create a user             |
| `PUT`  | `/api/users` | Bearer JWT | Update email and password |

### Chirps

| Method   | Path              | Auth       | Description                                       |
| -------- | ----------------- | ---------- | ------------------------------------------------- |
| `GET`    | `/api/chirps`     | —          | List all chirps (`?authorId=`, `?sort=asc\|desc`) |
| `GET`    | `/api/chirps/:id` | —          | Get a single chirp                                |
| `POST`   | `/api/chirps`     | Bearer JWT | Create a chirp (max 140 chars)                    |
| `DELETE` | `/api/chirps/:id` | Bearer JWT | Delete a chirp (owner only)                       |

### Health

| Method | Path           | Description     |
| ------ | -------------- | --------------- |
| `GET`  | `/api/healthz` | Readiness check |

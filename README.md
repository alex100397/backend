# CineVault Backend API

This is the production-ready Node.js backend for the CineVault application. It is built using modern JavaScript (ES Modules), Prisma ORM, and is fully containerized using Docker.

## Tech Stack
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Authentication:** JWT (HttpOnly Cookies)
- **Deployment:** Docker

## Security & Architecture
- **Cookie-Based Auth:** Uses `HttpOnly`, `Secure`, and `SameSite=Strict` cookies. The frontend never touches the token, completely eliminating XSS vulnerabilities.
- **Dockerized:** Fully isolated environment running on Alpine Linux for minimal footprint and maximum security.
- **Prisma:** Prevents SQL injection and provides type-safe database queries.

## Setup Instructions

### Local Development
1. Ensure Node.js 22+ is installed.
2. Run `npm install` (or `pnpm install`).
3. Set up your `.env` file with `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGIN`.
4. Run `npx prisma generate` to build the database client.
5. Run `npx prisma db push` to sync the database schema.
6. Run `npm run dev` to start the server.

### Docker Production Build
To build and run the backend using Docker:

```bash
# Build the image
docker build -t movie-backend-api .

# Run the container on port 5000
docker run -p 5000:5000 --env-file .env movie-backend-api
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Authenticate and receive an HttpOnly cookie
- `POST /api/v1/auth/logout` - Destroy the authentication cookie

### Watchlist
- `GET /api/v1/watchlist` - Get the user's watchlist
- `POST /api/v1/watchlist` - Add a movie to the watchlist
- `DELETE /api/v1/watchlist/:id` - Remove a movie from the watchlist

### Movies
- `GET /api/v1/movies` - Get a paginated list of movies

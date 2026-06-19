# CineVault Backend API

This is the production-ready Node.js backend for the CineVault application. It is built using modern JavaScript (ES Modules), Prisma ORM, and is fully containerized using Docker.

## Tech Stack
- **Runtime:** Node.js 22 (ES Modules)
- **Framework:** Express.js 5
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma 7
- **Authentication:** JWT (HttpOnly Cookies)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting, bcryptjs
- **Deployment:** Docker

## Security & Architecture
- **Cookie-Based Auth:** Uses `HttpOnly`, `Secure`, and `SameSite=Strict` cookies. The frontend never touches the token, completely eliminating XSS vulnerabilities.
- **Dockerized:** Fully isolated environment running on Alpine Linux for minimal footprint and maximum security.
- **Prisma:** Prevents SQL injection and provides type-safe database queries.

## Setup Instructions

### Local Development
1. Ensure Node.js 22+ is installed.
2. Run `npm install` (or `pnpm install`).
3. Set up your `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values (DATABASE_URL, JWT_SECRET, CORS_ORIGIN)
   ```
4. Run migrations and generate the client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Seed the database (optional):
   ```bash
   npm run seed:movies
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Production Build
To build and run the backend using Docker:

```bash
# Build the image
docker build -t movie-backend-api .

# Run the container on port 5000
docker run -p 5000:5000 --env-file .env movie-backend-api
```

## API Documentation (Swagger)
Once the server is running, you can view the full interactive API documentation by visiting:
**👉 `http://localhost:5000/api-docs`**

## API Endpoints

All API routes are prefixed with `/api/v1`.

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/signup` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Login and get an HttpOnly Cookie | ❌ |
| POST | `/api/v1/auth/logout` | Clear the auth cookie | ❌ |

### Movies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/movies` | List all movies (paginated) | ❌ |
| GET | `/api/v1/movies/:id` | Get a single movie | ❌ |
| POST | `/api/v1/movies` | Create a movie | ✅ |
| PUT | `/api/v1/movies/:id` | Update a movie (owner only) | ✅ |
| DELETE | `/api/v1/movies/:id` | Delete a movie (owner only) | ✅ |

### Watchlist
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/watchlist` | Get your watchlist (paginated) | ✅ |
| POST | `/api/v1/watchlist` | Add a movie to watchlist | ✅ |
| PUT | `/api/v1/watchlist/:id` | Update watchlist item status | ✅ |
| DELETE | `/api/v1/watchlist/:id` | Remove from watchlist | ✅ |

## Project Structure
```text
src/
├── config/           # Database, CORS, Swagger, env validation
├── controllers/      # Route handlers (thin — delegate to services)
├── middlewares/      # Auth, validation, error handling, rate limiting
├── routes/           # Express router definitions
├── services/         # Business logic layer
├── utils/            # Token generation, response helpers
├── validators/       # Zod schemas
├── main.js           # Entry point
└── server.js         # App factory
prisma/
├── schema.prisma     # Database schema
├── migrations/       # Migration history
└── seed.js           # Sample data seeder
```

# Movie Watchlist API

A RESTful API built with **Express 5**, **Prisma ORM**, and **PostgreSQL** for managing movies and personal watchlists.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma 7
- **Authentication**: JWT (HttpOnly cookies + Bearer tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) account)

### Installation

```bash
git clone https://github.com/alex100397/backend.git
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual values
```

Required variables:
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (`openssl rand -base64 32`) |

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed sample data (optional)
npm run seed:movies
```

### Run

```bash
npm run dev        # Development (with nodemon)
# or
make start         # Same as above
```

Server starts at `http://localhost:5000`. Health check: `GET /health`.

## API Endpoints

All API routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/signup` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Login and get JWT | ❌ |
| POST | `/api/v1/auth/logout` | Clear auth cookie | ❌ |

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
| PUT | `/api/v1/watchlist/:id` | Update watchlist item | ✅ |
| DELETE | `/api/v1/watchlist/:id` | Remove from watchlist | ✅ |

**Pagination**: Use `?page=1&limit=20` query params on list endpoints.

### Authentication

Include the JWT as either:
- **Cookie**: Automatically set by login/signup (HttpOnly, Secure, SameSite=Strict)
- **Header**: `Authorization: Bearer <token>`

## Project Structure

```
src/
├── config/           # Database, CORS, env validation
├── controllers/      # Route handlers (thin — delegate to services)
├── middlewares/       # Auth, validation, error handling, rate limiting
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

## Makefile Commands

```bash
make start      # Start dev server
make migrate    # Run Prisma migrations
make generate   # Generate Prisma client
```

## License

ISC
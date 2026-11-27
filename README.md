# Job Tracker Backend

A production-ready REST API for tracking job applications, built with **Node.js**, **Express**, and **MongoDB Atlas**, containerized with a multi-stage **Docker** build and automated with **GitHub Actions CI/CD** publishing to **GHCR** and **Docker Hub**.

## Features

- **Authentication:** User registration and login with `bcryptjs` password hashing and JWT bearer tokens (`jsonwebtoken`).
- **Job Application CRUD:** Create, list, inspect, update, and delete job applications with status tracking (`Applied`, `Interview`, `Offer`, `Rejected`).
- **Filtering & Pagination:** Search by company/position, filter by status, and paginate results on `GET /api/jobs`.
- **Job Statistics:** Aggregated counts grouped by application status (`GET /api/jobs/stats`).
- **Security & Health:** Security headers via `helmet`, rate limiting (`express-rate-limit`), CORS, and a `/health` endpoint for container health monitoring.
- **Containerization & CI/CD:** Multi-stage `node:22-alpine` Dockerfile running as a non-root user (`node`) with `HEALTHCHECK`, plus GitHub Actions CI/CD workflows.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express 5
- **Database:** MongoDB / MongoDB Atlas via Mongoose 9
- **Auth & Security:** `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `express-rate-limit`
- **Testing:** Node.js built-in test runner (`node --test`)
- **DevOps:** Docker (multi-stage Alpine build), GitHub Actions, GitHub Container Registry (`ghcr.io`), Docker Hub

## Project Structure

```text
Job_Tracker_Backend/
├── .github/workflows/
│   ├── ci.yml              # Manual CI trigger: syntax check, smoke tests, Docker build, calls CD
│   └── cd.yml              # Reusable CD workflow: builds & pushes to GHCR and Docker Hub
├── config/
│   └── db.js               # MongoDB connection setup
├── controllers/
│   ├── authController.js   # Register & login handlers
│   └── jobController.js    # Job CRUD, filtering, pagination & stats aggregation
├── middleware/
│   ├── authMiddleware.js   # JWT verification middleware
│   └── errorHandler.js
├── models/
│   ├── Job.js              # Job schema
│   └── User.js             # User schema
├── routes/
│   ├── authRoutes.js       # /api/auth routes
│   └── jobRoutes.js        # /api/jobs routes
├── tests/
│   └── health.test.js      # API smoke tests for / and /health
├── .dockerignore
├── .gitignore
├── Dockerfile              # Multi-stage production Dockerfile
├── app.js                  # Express app configuration & routes
├── package.json
└── server.js               # Entry point (loads env, connects DB, starts HTTP server)
```

## Getting Started (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/jobTrack?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` (in `server.js`, `8080` in `.env`/Docker) |
| `MONGO_URI` | MongoDB or MongoDB Atlas connection string | — |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | — |

### 3. Run the Server & Tests

```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm start

# Run smoke tests
npm test
```

## API Endpoints

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | Returns `"Job Tracker API Running"` |
| `GET` | `/health` | No | Returns `{ status, uptime, timestamp }` |

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | `{ name, email, password }` |
| `POST` | `/api/auth/login` | No | `{ email, password }` |

### Jobs (`/api/jobs`)

All job endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List jobs (supports `?status=`, `?search=`, `?page=`, `?limit=`) |
| `GET` | `/api/jobs/stats` | Get job counts grouped by `status` |
| `GET` | `/api/jobs/:id` | Get a single job by ID |
| `POST` | `/api/jobs` | Create a job (`company`, `position`, `status`, `notes`, `user`) |
| `PUT` | `/api/jobs/:id` | Update a job by ID |
| `DELETE` | `/api/jobs/:id` | Delete a job by ID |

Valid `status` values: `"Applied"` (default), `"Interview"`, `"Offer"`, `"Rejected"`.

## Docker

The [Dockerfile](Dockerfile) uses a two-stage `node:22-alpine` build, installs production dependencies only (`npm ci --omit=dev`), runs under the non-root `node` user, and monitors container health via `GET /health`.

### Build and Run Locally

```bash
docker build -t job-tracker-backend .
docker run -d -p 8080:8080 --env-file .env --name job-tracker-api job-tracker-backend
```

### Pull Published Images

```bash
# From GitHub Container Registry
docker pull ghcr.io/shiva9520/job-tracker-backend:latest

# From Docker Hub
docker pull <dockerhub-username>/job-tracker-backend:latest
```

## CI/CD Pipeline (GitHub Actions)

```text
CI (workflow_dispatch)
  └── test (Node 22, npm ci, node --check, npm test)
        └── docker-build (Buildx verification, push: false)
              └── cd (calls .github/workflows/cd.yml via workflow_call)
                    ├── Push to GHCR (ghcr.io/shiva9520/job-tracker-backend)
                    └── Push to Docker Hub (<DOCKERHUB_USERNAME>/job-tracker-backend)
```

- **CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)):** Triggered manually via `workflow_dispatch`. Runs syntax validation, `npm test`, and Docker Buildx verification; once both pass, it invokes `cd.yml` using `workflow_call` with `secrets: inherit`.
- **CD ([.github/workflows/cd.yml](.github/workflows/cd.yml)):** Can be triggered via `workflow_call` (from CI), `push` to `main`, `v*` version tags, or `workflow_dispatch`. Builds the image once and tags/pushes `:latest` and `:<commit-sha>` to **GHCR** and **Docker Hub**.

### Required GitHub Secrets

Configure these under **Repository → Settings → Secrets and variables → Actions → Secrets**:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username used to tag and log in |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token (Read & Write permissions) |
| `GITHUB_TOKEN` | Provided automatically by GitHub (`packages: write` pushes to GHCR) |

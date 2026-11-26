# Job Tracker Backend

Node.js / Express / MongoDB backend for tracking job applications, containerized with Docker and automated with GitHub Actions CI/CD.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/jobTrack?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

## Local Development & Tests

```bash
npm install
npm run dev
npm test
```

Health check endpoint:
- `GET /health` -> `{ "status": "ok", "uptime": ..., "timestamp": "..." }`

## Docker

Build and run the multi-stage production image:

```bash
docker build -t job-tracker-backend .
docker run -p 8080:8080 --env-file .env job-tracker-backend
```

Or run both the API and a local MongoDB instance via Docker Compose:

```bash
docker compose up --build
```

## CI/CD Pipeline

- **CI (`.github/workflows/ci.yml`)**: Runs on pushes and pull requests to `main` (`feat/**`, `ci/**`), verifying syntax (`node --check`), smoke tests (`npm test`), and the Docker image build.
- **CD (`.github/workflows/cd.yml`)**: Runs on pushes to `main` and `v*` tags (or manual dispatch), building the container image and publishing it to GitHub Container Registry (`ghcr.io`) and (when `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are set) Docker Hub.

### Required GitHub Secrets for Docker Hub
In your GitHub repository **Settings → Secrets and variables → Actions**, add:
- `DOCKERHUB_USERNAME`: your Docker Hub username
- `DOCKERHUB_TOKEN`: a Docker Hub Access Token (with Read & Write permissions)

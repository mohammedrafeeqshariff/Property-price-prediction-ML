# Gym Management Admin Dashboard

A complete, production-ready full-stack gym management solution.

## Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Ensure you have adequate disk space (especially on your primary drive, even if cloned on another, as `npm` caches heavily).

## Project Structure
- `backend/`: NestJS backend API.
- `frontend/`: Next.js 14 Dashboard.
- `database/`: PostgreSQL Initialization schemas.

## Running Locally

### Docker (Recommended)
1. Ensure `.env.example` is copied to `backend/.env` and `frontend/.env.local` if they do not exist.
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.local frontend/.env.local
   ```
2. Run Docker Compose
   ```bash
   docker-compose up --build
   ```
3. Access UI at `http://localhost:3000`
4. Use default admin credentials:
   - **Email:** `admin@gym.com`
   - **Password:** `Admin@1234`

### Local Development (Without Docker)
1. Initialize Postgres on port 5432 using the schema in `database/init.sql`.
2. Move to backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
3. Move to frontend:
   ```bash
   cd frontend
   npm install --cache "D:\npm-cache" # Note: If your C: drive is full, manually route the cache.
   npm run dev
   ```

## Production Checklist
- Change JWT_SECRET inside `backend/.env`
- Modify PostgreSQL passwords securely.
- Ensure `NODE_ENV=production` when deploying.
- Connect valid SMS APIs (Twilio, AWS SNS) inside `messages.service.ts` if implemented.

## API Documentation Requirements
See the NestJS codebase for controllers routing. All routes under `/auth`, `/members`, `/payments` are protected via `JwtAuthGuard`.

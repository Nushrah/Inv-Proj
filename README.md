# Portfolio Management Dashboard

Full-stack portfolio dashboard (React + Express + PostgreSQL). Assessment project per PRD.

## Tech stack (planned)

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL, Prisma

## Run (after later milestones)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend health: http://localhost:5000/health  
- PostgreSQL from the host is mapped to **port 5433** (avoids clashes when another service already uses 5432).

### Database (Prisma)

From `backend/` with Postgres running (`docker compose up -d db`):

```bash
set DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/portfolio_db
npx prisma migrate deploy
npx prisma db seed
```

**Demo user (after seed):** `demo@example.com` / `password123`

Further API details will be added as features land.

# FishingReels

Media-first competitive fishing platform.

## Stack

- **Backend:** FastAPI + SQLAlchemy 2 (async), Postgres 16
- **Frontend:** React + Vite + TypeScript + Tailwind v4 + shadcn/ui
- **Streaming:** MediaMTX ingest, Nginx delivery (Plan 3)
- **Orchestration:** Docker Compose (base + override pattern)

## Quick start (dev)

Requires Docker + Docker Compose v2.

```bash
cp .env.example .env
make up
```

Then:

- Frontend: http://localhost:5173 (Vite dev server, hot reload)
- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Health: http://localhost:5173/api/health (via Vite proxy) or http://localhost:8000/api/health (direct)
- Postgres: localhost:5432 (user/db from `.env`)

## Common commands

| Command            | What it does                                  |
|--------------------|-----------------------------------------------|
| `make up`          | Build + start the stack in the background     |
| `make down`        | Stop everything                               |
| `make logs`        | Tail logs from all services                   |
| `make ps`          | Show service status                           |
| `make shell-backend` | Open a shell in the backend container       |
| `make shell-db`    | Open `psql` against the dev database          |
| `make migrate`     | Run `alembic upgrade head`                    |
| `make test`        | Run backend pytest inside the container       |
| `make gen-api`     | Regenerate `apps/frontend/src/api/types.ts` from the backend OpenAPI schema (stack must be up) |
| `make rebuild`     | Rebuild all images from scratch (no cache)    |
| `make clean`       | Tear down AND remove named volumes (e.g., after Python or Node dep changes that left the `backend_venv` / `frontend_node_modules` named volume stale) |

## Directory layout

See `../Docs/2026-05-23-project-structure-design.md` for the full design and `../Docs/tech-stack.md` for the tool choices.

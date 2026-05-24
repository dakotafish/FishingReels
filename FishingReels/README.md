# FishingReels

Media-first competitive fishing platform.

## Stack

- **Backend:** FastAPI + SQLAlchemy 2 (async), Postgres 16
- **Frontend:** React + Vite + TypeScript + Tailwind + shadcn (Plan 2)
- **Streaming:** MediaMTX ingest, Nginx delivery (Plan 3)
- **Orchestration:** Docker Compose (base + override pattern)

## Quick start (dev)

Requires Docker + Docker Compose v2.

```bash
cp .env.example .env
make up
```

Then:

- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/health
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
| `make rebuild`     | Rebuild all images from scratch (no cache)    |
| `make clean`       | Tear down AND remove named volumes (e.g., after Python dep changes that left the `backend_venv` named volume stale) |

## Directory layout

See `../Docs/2026-05-23-project-structure-design.md` for the full design and `../Docs/tech-stack.md` for the tool choices.

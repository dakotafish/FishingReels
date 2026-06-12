# FishingReels

Media-first competitive fishing platform.

## Stack

- **Backend:** FastAPI + SQLAlchemy 2 (async), Postgres 16
- **Frontend:** React + Vite + TypeScript + Tailwind v4 + shadcn/ui + react-router (Vitest for tests). Castline design system — see [`../DesignSystem/DesignSystemMap.md`](../DesignSystem/DesignSystemMap.md).
- **Streaming:** MediaMTX ingest (SRT) with backend-verified stream keys; in-container ffmpeg packager writes event-HLS (rewindable live + VOD) to disk; nginx delivery
- **Orchestration:** Docker Compose (base + override pattern, separate prod file)

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
- HLS file server: http://localhost:8888 (nginx, serves `./data/hls`; also via Vite proxy at `/streams/*.m3u8` etc.)
- MediaMTX SRT ingest: srt://localhost:8890 (UDP; publishes require a stream key)
- MediaMTX API: http://localhost:9997

## Quick start (prod-like local)

Runs the production stack locally — nginx serves the built React app at port 80, proxies `/api/*` to FastAPI, and serves HLS from disk.

```bash
make prod-up
```

Then:

- App: http://localhost:80
- API: http://localhost:80/api/health
- HLS: http://localhost:80/streams/<stream>/index.m3u8 (404s until a stream publishes)
- SRT ingest: srt://localhost:8890 (same as dev)

Stop with `make prod-down`.

## Common commands

| Command            | What it does                                  |
|--------------------|-----------------------------------------------|
| `make up`          | Build + start the dev stack in the background |
| `make down`        | Stop the dev stack                            |
| `make logs`        | Tail logs from all dev services               |
| `make ps`          | Show dev service status                       |
| `make shell-backend` | Open a shell in the backend container       |
| `make shell-db`    | Open `psql` against the dev database          |
| `make migrate`     | Run `alembic upgrade head`                    |
| `make test`        | Run backend pytest inside the container       |
| `make test-frontend` | Run frontend Vitest suite inside the container |
| `make gen-api`     | Regenerate `apps/frontend/src/api/types.ts` from the backend OpenAPI schema (stack must be up) |
| `make rebuild`     | Rebuild all dev images from scratch (no cache) |
| `make clean`       | Tear down AND remove named volumes (e.g., after Python or Node dep changes that left the `backend_venv` / `frontend_node_modules` named volume stale) |
| `make prod-up`     | Build + start the prod stack (nginx edge, no Vite, no exposed backend/postgres ports) |
| `make prod-down`   | Stop the prod stack                           |
| `make prod-logs`   | Tail logs from the prod stack                 |
| `make prod-rebuild`| Rebuild prod images from scratch (no cache)   |

## Streaming

Each angler publishes with a personal **stream key** (mint via `POST /api/anglers/<slug>/stream-keys` — the secret is shown once; see the [dev guide](../Docs/dev-guide.md)). Phones run Moblin (**H.264 + AAC** — not HEVC) and publish via SRT to `srt://<host>:8890?streamid=publish:<key>`.

The backend authorizes every publish (unknown/revoked keys are rejected at the SRT handshake) and registers a `Stream` row. An ffmpeg packager inside the MediaMTX container then writes append-only event-HLS to `./data/hls/<stream-id>/` — viewers can scrub back to the start while the stream is live, and when it ends the finalized playlist becomes the VOD at the same URL (`/streams/<stream-id>/index.m3u8`, served by nginx in prod).

## Documentation

- **Day-to-day recipes** (adding deps, migrations, debugging, gotchas): [`../Docs/dev-guide.md`](../Docs/dev-guide.md)
- **Tech stack & rationale**: [`../Docs/tech-stack.md`](../Docs/tech-stack.md)
- **Project structure design**: [`../Docs/2026-05-23-project-structure-design.md`](Project-structure-design.md)

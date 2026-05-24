# Tech Stack

The tools and frameworks chosen for the FishingReels project, with a brief note on why each was selected. For the higher-level directory layout and how these pieces fit together, see [the project structure design](./2026-05-23-project-structure-design.md).

This document is a living reference — update it when a tool choice changes.

---

## Backend

### Python 3.12+
`requires-python = ">=3.12"` in `pyproject.toml`. The host venv resolves to whatever modern Python is installed (3.14 on the current dev machine); the container `Dockerfile` pins to `python:3.12-slim` for predictable production behavior.

### uv — package manager and venv tool
**Choice:** `uv` (astral-sh/uv) for dependency resolution, locking, and virtualenv management.
**Why:** Fast (Rust-based), single tool replacing pip + pip-tools + virtualenv. Reads `pyproject.toml` natively (PEP 621/735) and produces `uv.lock` for reproducible installs.
**Alternative considered:** Poetry — slower, older tooling model.

### FastAPI — web framework
**Choice:** FastAPI for the HTTP API.
**Why:** First-class async support, auto-generated OpenAPI schema (which we use to generate TypeScript types for the frontend), Pydantic-based request/response validation.

### SQLAlchemy 2 (async) — ORM
**Choice:** SQLAlchemy 2.x with the async session API.
**Why:** Most mature Python ORM, with first-class async support since 2.0. Pairs cleanly with FastAPI's async handlers.

### asyncpg + aiosqlite — DB drivers
- **Prod:** `asyncpg` against PostgreSQL.
- **Dev / local tests:** `aiosqlite` (no Postgres needed for unit tests).

The `DATABASE_URL` env var switches between them without code changes.

### Alembic — migrations
**Choice:** Alembic with the async template (`alembic init -t async`).
**Why:** Standard SQLAlchemy companion; integrates directly with our async engine.

### pydantic-settings — config
Type-safe settings loaded from `.env` / environment variables, validated at startup.

### pytest + pytest-asyncio + httpx — testing
`asyncio_mode = "auto"` removes per-test `@pytest.mark.asyncio` boilerplate. Tests drive FastAPI via `httpx.AsyncClient` + `ASGITransport` — no real server needed.

---

## Frontend (planned, not yet built)

### React + TypeScript
The user-facing app.

### Vite — build tool and dev server
**Choice:** Vite.
**Why:** Fast HMR, minimal config, the right fit for a SPA where we control routing and serving (no SSR required for our use case).
**Alternative considered:** Next.js — overkill given no SSR requirement.

### Tailwind CSS — styling
Utility-first CSS.

### shadcn/ui — component library
**Choice:** shadcn/ui on Radix primitives.
**Why:** Copy-paste components we own rather than a black-box library; pairs naturally with Tailwind.

### openapi-typescript — type sync with backend
TypeScript types for the API surface are generated from FastAPI's `/openapi.json` via `openapi-typescript` and written to `apps/frontend/src/api/types.ts`. No hand-maintained shared types package, no monorepo workspace tooling.
**Alternative considered:** Hand-maintained shared types package — more moving parts, drift risk.

### react-router — routing
Routes live in `apps/frontend/src/routes/`. (Other state-management / data-fetching choices like TanStack Query are not yet decided.)

---

## Infrastructure

### Docker Compose — orchestration
**Choice:** Compose with the **base + override pattern**.
- `docker-compose.yml` defines shared services.
- `docker-compose.override.yml` is auto-loaded in dev (ports, bind mounts, `--reload`).
- `docker-compose.prod.yml` is explicit for prod (`docker compose -f docker-compose.yml -f docker-compose.prod.yml ...`).

### PostgreSQL 16-alpine
Official image, configured via env vars (loaded from `.env` via `env_file:`) and bind-mounted `infra/postgres/init/` for first-run init scripts. Dev data lives at `./data/postgres/` (gitignored, bind-mounted into the container at `/var/lib/postgresql/data`). Healthcheck via `pg_isready`; the backend `depends_on` postgres with `condition: service_healthy` so it won't start until the database is ready.

### MediaMTX — stream ingest *(planned — added in Plan 3)*
Official `bluenviron/mediamtx` image. Designed for up to 125 concurrent SRT streams from anglers running Moblin; writes HLS segments to `./data/hls/`.

### Nginx — production edge *(planned — added in Plan 3)*
Custom multi-stage `Dockerfile` at `infra/nginx/Dockerfile`. Stage 1 builds the React app from `apps/frontend/`; stage 2 copies the built `dist/` into `nginx:alpine` alongside the nginx config. Produces a single immutable image that serves the SPA, proxies `/api/*` to FastAPI, and serves HLS segments from `/streams/*`.

In dev, nginx is **not** in the stack — Vite is the edge and proxies `/api/*` and `/streams/*` itself.

---

## Developer workflow

### Make — task runner
`FishingReels/Makefile` is the user-facing entry point for everyday dev commands. `make up`, `make down`, `make logs`, `make migrate`, `make test`, `make shell-backend`, `make shell-db`, `make clean`, etc. — see `FishingReels/README.md` for the full table. Make is a thin wrapper over `docker compose` so commands stay short and consistent across the team instead of "what was the exact compose invocation again?"

---

## Conventions

### API URL prefix
FastAPI routes are mounted under `/api` (`app.include_router(router, prefix="/api")`). Both the Vite dev proxy and the nginx prod proxy forward `/api/*` to the backend **without path rewriting**, so URLs match across dev and prod.

### Repo and git
- Single git repository covering the whole vault (notes + code).
- `Work/`, `.obsidian/`, and the original `FishingReels Project.md` brain-dump are gitignored.
- `Docs/` and `FishingReels/` are tracked.
- Commits are author-only — no `Co-Authored-By` trailers.

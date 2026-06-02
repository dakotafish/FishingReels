# Tech Stack

The tools and frameworks chosen for the FishingReels project, with a brief note on why each was selected. For the higher-level directory layout and how these pieces fit together, see [the project structure design](Project-structure-design.md).

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

### asyncpg — DB driver
**Choice:** `asyncpg` against PostgreSQL in every environment — dev, tests, and prod.
**Why:** A single driver and dialect everywhere means tests exercise the same database behavior as production, with no SQLite/Postgres dialect gaps to mask bugs. Dev and tests run against the dockerized Postgres; `DATABASE_URL` is required (no fallback driver).

### Alembic — migrations
**Choice:** Alembic with the async template (`alembic init -t async`).
**Why:** Standard SQLAlchemy companion; integrates directly with our async engine.

### pydantic-settings — config
Type-safe settings loaded from `.env` / environment variables, validated at startup.

### pytest + pytest-asyncio + httpx — testing
`asyncio_mode = "auto"` removes per-test `@pytest.mark.asyncio` boilerplate. Tests drive FastAPI via `httpx.AsyncClient` + `ASGITransport` — no real server needed.

---

## Frontend

### React + TypeScript
The user-facing app. Built via Vite 8 + create-vite (modern flat ESLint + split tsconfig layout).

### Vite — build tool and dev server
**Choice:** Vite.
**Why:** Fast HMR, minimal config, the right fit for a SPA where we control routing and serving (no SSR required for our use case).
**Alternative considered:** Next.js — overkill given no SSR requirement.

### Tailwind CSS v4 — styling
Utility-first CSS via the `@tailwindcss/vite` plugin. CSS-first configuration — no `tailwind.config.ts` file; theme tokens live in `src/index.css` under an `@theme inline` block.

### shadcn/ui — component library
**Choice:** shadcn/ui on Radix primitives, initialized with a neutral base palette via `npx shadcn@latest init` (shadcn 4.8.0).
**Why:** Copy-paste components we own rather than a black-box library; pairs naturally with Tailwind.
Uses the `cn()` helper at `src/lib/utils.ts` (clsx + tailwind-merge) for class composition. Components installed via `npx shadcn@latest add <name>` land in `src/components/ui/`.

### openapi-typescript — type sync with backend
TypeScript types for the API surface are generated from FastAPI's `/openapi.json` via `openapi-typescript` and written to `apps/frontend/src/api/types.ts`. Run via `make gen-api` (which `docker compose exec`s the frontend container to call `npm run gen:api`); regenerate after backend schema changes. No hand-maintained shared types package, no monorepo workspace tooling.
**Alternative considered:** Hand-maintained shared types package — more moving parts, drift risk.
**Note:** Currently installed with `--legacy-peer-deps` in `Dockerfile.dev` because `openapi-typescript@7.x` ships a `peerDep: typescript@^5.x` while the project uses TS 6. The tool works correctly with TS 6 at runtime; the peer-dep constraint is overly conservative. Revisit if a future change makes a more targeted fix (e.g., `overrides` in `package.json`) feasible.

### react-router — routing *(planned — will be added when the app gains a second route)*
The home page currently lives directly in `src/App.tsx`; once a second route exists, routes move to `apps/frontend/src/routes/` and `react-router` mounts in `App.tsx`. Other state-management / data-fetching choices like TanStack Query are not yet decided.

---

## Infrastructure

### Docker Compose — orchestration
**Choice:** Compose with the **base + override pattern**.
- `docker-compose.yml` defines shared services.
- `docker-compose.override.yml` is auto-loaded in dev (ports, bind mounts, `--reload`).
- `docker-compose.prod.yml` is explicit for prod (`docker compose -f docker-compose.yml -f docker-compose.prod.yml ...`).

### PostgreSQL 16-alpine
Official image, configured via env vars (loaded from `.env` via `env_file:`) and bind-mounted `infra/postgres/init/` for first-run init scripts. Dev data lives at `./data/postgres/` (gitignored, bind-mounted into the container at `/var/lib/postgresql/data`). Healthcheck via `pg_isready`; the backend `depends_on` postgres with `condition: service_healthy` so it won't start until the database is ready.

### MediaMTX — stream ingest
Official `bluenviron/mediamtx:latest` image, configured via `infra/mediamtx/mediamtx.yml`. Accepts SRT publishes on UDP port 8890; serves HLS on port 8888 (dev only — prod will hide the HLS port and let nginx serve segments from disk). HLS segments persist to `./data/hls/` on the host via a bind mount, mounted into the container at `/recordings`. RTSP / RTMP / WebRTC are disabled in the config to minimize attack surface. Stats API at port 9997 (dev only; auth required by default since v1.18+).

### Nginx — production edge
Custom multi-stage `Dockerfile` at `infra/nginx/Dockerfile`. Stage 1 (`node:22-alpine` builder) runs `npm ci --legacy-peer-deps` and `npm run build` against `apps/frontend/`; stage 2 (`nginx:alpine`) removes the stock `default.conf`, copies in `infra/nginx/nginx.conf` + `infra/nginx/conf.d/fishingreels.conf`, and copies the built `dist/` into `/usr/share/nginx/html`. Produces a single immutable image that serves the SPA at `/`, proxies `/api/*` to the FastAPI service via `upstream backend { server backend:8000; }` (compose DNS), and serves HLS segments at `/streams/*` from a read-only bind mount of `./data/hls/` at `/var/streams/`.

The build context is the repo root (`.` in `docker-compose.prod.yml`) so the builder stage can reach `apps/frontend/` and the final stage can reach `infra/nginx/`. A repo-root `.dockerignore` excludes `node_modules/`, `data/`, `.venv/`, `.env*`, etc. to keep the build context small.

In dev, nginx is **not** in the stack — Vite is the edge and proxies `/api/*` and `/streams/*` itself. The prod stack is opt-in via `make prod-up` (which runs `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`); the dev `docker-compose.override.yml` is not auto-loaded when explicit `-f` flags are passed, so backend/postgres host ports are absent in prod and only nginx (`:80`) and MediaMTX SRT (`:8890/udp`) are publicly exposed.

**Currently HTTP-only on port 80.** TLS / HTTPS is a future deployment concern (cert source, renewal, prod hostname).

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

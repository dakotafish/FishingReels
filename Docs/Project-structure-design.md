# Project Structure Design

**Date:** 2026-05-23
**Status:** Approved
**Scope:** Initial directory layout for the FishingReels codebase, the surrounding notes/docs vault, and how Docker Compose ties services together.

---

## Context

The repository hosting these notes (the Obsidian vault) is a documentation root, not the codebase root. The codebase will live in a sibling subdirectory `FishingReels/`. This document specifies the layout of both the outer vault and the inner codebase.

The stack is set: FastAPI + SQLAlchemy backend, React + TypeScript + shadcn frontend, PostgreSQL, MediaMTX for stream ingest, Nginx as the production edge. Development uses Docker Compose; production deploys to Azure (managed Postgres, container hosts TBD). The streaming design point is up to 125 concurrent SRT streams from anglers running Moblin.

---

## Decisions

Four decisions drive the layout:

1. **`apps/` + `infra/` split** inside `FishingReels/`. Application code lives in `apps/`, container/runtime config lives in `infra/`. Keeps rich app code separate from small config-only services so the root stays scannable.
2. **TypeScript types auto-generated from OpenAPI.** FastAPI exposes `/openapi.json` for free; a frontend script generates `src/api/types.ts` from it. No shared package, no monorepo workspace tooling.
3. **Base + override compose files.** `docker-compose.yml` holds shared service definitions, `docker-compose.override.yml` is auto-loaded in dev, `docker-compose.prod.yml` is explicit for prod.
4. **Custom nginx Dockerfile with multi-stage build.** `infra/nginx/Dockerfile` builds the React app and bakes the static output into an `nginx:alpine` image alongside the nginx config. One immutable image ships React + nginx config together. MediaMTX and Postgres use their official images directly with mounted config and need no Dockerfile.

---

## Top-Level Shape

The vault is a single git repository. `FishingReels Project.md`, `Work/`, and `.obsidian/` are gitignored at the vault level; everything else (including `Docs/` and `FishingReels/`) is tracked.

```
FishingReelsProject/                    # git repo root, Obsidian vault root
├── .gitignore                          # vault-level: ignores Work/, .obsidian/, original brain-dump, .env, build artifacts
├── FishingReels Project.md             # original brain-dump doc (gitignored)
├── .obsidian/                          # Obsidian config (gitignored)
├── Work/                               # working notes, plans, scratch (gitignored)
├── Docs/                               # official docs (this file lives here)
└── FishingReels/                       # the codebase root
    ├── docker-compose.yml              # base service definitions
    ├── docker-compose.override.yml     # dev overrides, auto-loaded
    ├── docker-compose.prod.yml         # prod overrides, explicit
    ├── .env.example                    # template; real .env is gitignored
    ├── README.md                       # local spin-up instructions
    ├── Makefile                        # optional: `make up`, `make logs`, etc.
    ├── apps/
    │   ├── frontend/                   # React app (Vite)
    │   └── backend/                    # FastAPI app
    ├── infra/
    │   ├── nginx/                      # nginx.conf + Dockerfile
    │   ├── mediamtx/                   # mediamtx.yml
    │   └── postgres/                   # init scripts
    └── data/                           # gitignored: pg data, hls segments (dev)
```

Notes on the top level:
- One `.gitignore` at the vault root covers everything. No service-level `.gitignore` files are needed for now; if the codebase is ever extracted into its own repo, a child `.gitignore` can be added then.
- `.env.example` lives at the compose root. One env file feeds the whole stack (DB credentials, MediaMTX auth, API base URL, etc.). The real `.env` is gitignored.
- `data/` exists only in dev. Production puts Postgres data and HLS segments on host-mounted disks outside the repo.
- The `Makefile` is optional but recommended — `make up`, `make logs`, `make migrate` beats remembering long `docker compose -f ... -f ...` invocations.

---

## `infra/`

```
infra/
├── nginx/
│   ├── Dockerfile              # multi-stage: builds React, bakes into nginx
│   ├── nginx.conf              # top-level config
│   └── conf.d/
│       └── fishingreels.conf   # routes: /, /api/*, /streams/*
│
├── mediamtx/
│   ├── Dockerfile              # pinned bluenviron/mediamtx -ffmpeg + curl/jq + hook scripts
│   ├── mediamtx.yml            # SRT ingest, http publish auth, runOnReady/NotReady hooks
│   └── scripts/
│       ├── on-ready.sh         # register stream w/ backend, exec ffmpeg HLS packager
│       └── on-not-ready.sh     # finalize event playlist, mark stream ended
│
└── postgres/
    └── init/
        └── 01-init.sql         # roles/extensions (schema is owned by Alembic)
```

### Nginx Dockerfile flow

The nginx image is the production edge. Its Dockerfile is the only one in `infra/` and does a multi-stage build:

```dockerfile
# Stage 1: build React
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY apps/frontend/package*.json ./
RUN npm ci
COPY apps/frontend/ ./
RUN npm run build               # produces /app/dist

# Stage 2: nginx serving the built app
FROM nginx:alpine
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/ /etc/nginx/conf.d/
COPY --from=frontend-build /app/dist /usr/share/nginx/html
```

The build context is the repo root so it can reach both `apps/frontend/` and `infra/nginx/`. In compose:

```yaml
nginx:
  build:
    context: .
    dockerfile: infra/nginx/Dockerfile
```

### MediaMTX and Postgres

Postgres uses the official image with bind-mounted config. MediaMTX builds a thin custom image (pinned `-ffmpeg` variant + `curl`/`jq` + the hook scripts) because the runOnReady hook spawns the ffmpeg HLS packager *inside* the MediaMTX container:

```yaml
mediamtx:
  build:
    context: ./infra/mediamtx             # Dockerfile: pinned -ffmpeg image + hook scripts
  environment:
    MTX_AUTHHTTPADDRESS: http://backend:8000/api/internal/mediamtx/auth?secret=${MEDIAMTX_WEBHOOK_SECRET}
    BACKEND_BASE_URL: http://backend:8000  # used by the hook scripts
    WEBHOOK_SECRET: ${MEDIAMTX_WEBHOOK_SECRET}
  depends_on:
    - backend
  volumes:
    - ./infra/mediamtx/mediamtx.yml:/mediamtx.yml:ro
    - ./data/hls:/recordings               # the ffmpeg packager writes HLS here
  # dev override publishes 8890/udp (SRT) + 9997 (stats); prod only 8890/udp

postgres:
  image: postgres:16-alpine
  volumes:
    - ./infra/postgres/init:/docker-entrypoint-initdb.d:ro
    - ./data/postgres:/var/lib/postgresql/data
  env_file: .env
```

**HLS sharing:** the packager writes event-style HLS to `./data/hls/<stream id>/` on the host. Nginx reads from the same path (mounted into the nginx container at `/var/streams`). One source of truth on disk, separate readers, no copying.

---

## `apps/`

### `apps/backend/` (FastAPI)

```
apps/backend/
├── Dockerfile
├── pyproject.toml              # deps via uv or poetry
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/               # migration files
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, mounts routers
│   ├── core/
│   │   ├── config.py           # pydantic-settings, reads env
│   │   └── db.py               # async engine, session factory
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response models
│   ├── api/
│   │   ├── deps.py             # auth, db session deps
│   │   └── routes/             # one file per resource (anglers, streams, events, ...)
│   └── services/               # business logic, kept out of routes
└── tests/
    ├── conftest.py
    └── ...
```

**Layered split:** `models/` (DB) → `schemas/` (wire format) → `services/` (logic) → `routes/` (HTTP). Each layer depends only on the ones below it. Routes stay thin; services are testable without spinning up HTTP.

**Async:** with `asyncpg` against Postgres in every environment (dev, tests, prod), `core/db.py` exposes an `AsyncSession` factory; `services/` and `routes/` are `async def`.

### `apps/frontend/` (React + Vite + shadcn)

```
apps/frontend/
├── Dockerfile.dev              # `npm run dev` for compose
├── package.json
├── tsconfig*.json              # split app / node configs
├── vite.config.ts              # dev proxy: /api → backend, /streams → mediamtx; Vitest `test` block
├── eslint.config.js
├── components.json             # shadcn config
├── index.html
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx                 # mounts <BrowserRouter>
    ├── app-routes.tsx          # route tree (kept apart from the router so tests can use MemoryRouter)
    ├── index.css               # Tailwind v4 + Castline design tokens (the @theme / :root blocks)
    ├── pages/                  # one component per route (home, anglers, angler-profile)
    ├── components/
    │   ├── ui/                 # shadcn-style primitives (button, card, badge-live, icon, chip)
    │   ├── layout/             # chrome (header + drawer, footer, stripe, container, site-layout)
    │   ├── sections/           # home bands (hero, tournament-bar, section-band, feature-split)
    │   └── angler/             # roster (avatar, card, row, view-toggle)
    ├── hooks/                  # data hooks (use-anglers)
    ├── lib/
    │   ├── utils.ts            # cn() helper
    │   ├── avatar.ts           # deterministic avatar trio + initials
    │   └── angler.ts           # small angler helpers
    ├── api/
    │   ├── client.ts           # fetch wrapper + exported API types
    │   └── types.ts            # AUTO-GENERATED from /openapi.json (do not edit)
    ├── assets/brand/           # logo, racing stripe, dot texture, emblem, feature photo
    └── test/                   # Vitest setup + shared fixtures
```

Tests are **colocated** with the code they cover (`*.test.ts(x)`), run via `make test-frontend`.

**OpenAPI sync:** `package.json` has a `"gen:api"` script (run via `make gen-api`, which `docker compose exec`s the frontend container against the backend's `/openapi.json`); it rewrites `src/api/types.ts`. Run after backend schema changes. Wiring it into a pre-commit hook or watch script is a later refinement.

---

## Dev Compose Data Flow

In dev, nginx is **not** in the stack. Vite is the edge:

```
Browser
  ├── http://localhost:5173        → Vite dev server (HMR)
  │     ├── proxies /api/*         → backend:8000
  │     └── proxies /streams/*     → mediamtx:8888 (HLS)
  └── http://localhost:8000/docs   → FastAPI Swagger UI (direct access)
```

- Backend container bind-mounts `apps/backend/` for `uvicorn --reload`.
- Frontend container bind-mounts `apps/frontend/` for Vite HMR.
- The ffmpeg packager (spawned by MediaMTX's runOnReady hook) writes event-style HLS to `./data/hls/<stream id>/`. In prod, nginx serves it at `/streams/*`.

Prod compose (`docker-compose.yml` + `docker-compose.prod.yml`) puts nginx in front of everything: it serves the baked-in React build at `/`, proxies `/api/*` to FastAPI, and serves HLS segments from `/streams/*` directly off disk.

---

## Out of Scope

The following are deliberately not specified here and will be designed separately:

- **Auth model.** No decision yet on session vs JWT, identity provider, or how angler-vs-fan roles are represented.
- **Production deploy topology.** Azure-specific orchestration (App Service vs Container Apps vs AKS), managed Postgres setup, secret management, TLS termination.
- **Observability.** Logging, metrics, tracing, and the MediaMTX/nginx telemetry stack.
- **CI/CD.** Build pipelines, image registry, deploy automation.
- **Frontend routing and state management specifics.** Router choice (React Router assumed but not pinned), data-fetching library (TanStack Query likely but unconfirmed).
- **Data model.** Specific tables, relationships, and migrations.

Each of these gets its own spec when the time comes.

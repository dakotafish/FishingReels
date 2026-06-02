# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo shape (read this first)

This git repository is also an Obsidian vault, so the repo root is **not** the codebase root:

- Repo / vault root: `FishingReelsProject/` — holds notes, `Docs/`, and this file.
- **Codebase root: `FishingReels/`** — nearly every command below runs from here.
- Tracked: `Docs/` and `FishingReels/`. Gitignored: `Work/`, `.obsidian/`, `FishingReels Project.md` (original brain-dump), `.env`, and build artifacts.

## Documentation

The files in `Docs/` are the source of truth — **keep them in sync as you make changes** (treat the relevant doc update as part of the change, not a follow-up):

- [`Docs/dev-guide.md`](Docs/dev-guide.md) — day-to-day recipes (adding deps, migrations, debugging, gotchas). Update when a workflow or command changes.
- [`Docs/tech-stack.md`](Docs/tech-stack.md) — every tool choice and *why*. Update when a tool or version choice changes.
- [`Docs/Project-structure-design.md`](Docs/Project-structure-design.md) — directory layout and how Compose ties services together. Update when the structure or service topology changes.
- [`Docs/ER_Diagram.md`](Docs/ER_Diagram.md) — the data model as a Mermaid entity-relationship diagram. **Update it on every schema change** (new or altered models / migrations) so it stays an accurate picture of the database.

Also see [`FishingReels/README.md`](FishingReels/README.md) for spin-up and the full Make table.

## Commands

`FishingReels/Makefile` is the canonical entry point (a thin wrapper over `docker compose`). Run from `FishingReels/`:

| Task | Command |
|------|---------|
| Start dev stack (Vite edge) | `make up` |
| Start prod-like stack (nginx edge) | `make prod-up` |
| Stop / tail logs | `make down` / `make logs` (prod: `make prod-down` / `make prod-logs`) |
| Backend tests (Postgres, in container) | `make test` |
| Apply migrations | `make migrate` |
| Regenerate frontend API types | `make gen-api` (stack must be up) |
| Shells | `make shell-backend` (bash) / `make shell-db` (psql) |
| Refresh after a dep change | `make clean && make up` (see gotcha below) |

Outside the container:

- **Backend tests:** `make test` runs pytest in the backend container against the dockerized Postgres — there is no SQLite/host fallback (`DATABASE_URL` is required). Single test: `docker compose exec backend pytest tests/test_health.py::<name>`. `pytest-asyncio` runs in `asyncio_mode = "auto"`, so async tests need no `@pytest.mark.asyncio`.
- **Frontend lint / build:** `cd apps/frontend && npm run lint` / `npm run build` (`tsc -b && vite build`). No frontend test framework yet.
- **Create a migration:** `docker compose exec backend alembic revision --autogenerate -m "<msg>"` after editing a model — then update [`Docs/ER_Diagram.md`](Docs/ER_Diagram.md) to reflect the schema change.

## Architecture

**Backend — layered, async.** `app/` splits into `models/` (SQLAlchemy ORM) → `schemas/` (Pydantic wire format) → `services/` (business logic) → `api/routes/` (HTTP). Each layer depends only on those below it; routes stay thin and services are testable without HTTP. Everything is `async def`: `core/db.py` exposes an `AsyncSession` factory driven by `DATABASE_URL` (required — `asyncpg`/Postgres in every environment, including dev and tests). Routers mount under `/api` (`app.include_router(..., prefix="/api")`).

**Frontend — types flow from the backend.** `apps/frontend/src/api/types.ts` is **auto-generated** from FastAPI's `/openapi.json` via `make gen-api` — never hand-edit it; regenerate after any backend schema change. There is no shared types package and no monorepo tooling. Styling is Tailwind v4 (CSS-first config in `src/index.css`, no `tailwind.config.ts`) with shadcn/ui primitives in `src/components/ui/` (`npx shadcn@latest add <name>`); compose classes with `cn()` from `src/lib/utils.ts`.

**Dev vs prod edge (Compose base + override pattern).** `docker-compose.yml` holds shared services; `docker-compose.override.yml` is auto-loaded in dev; `docker-compose.prod.yml` is opt-in via explicit `-f` flags (so the dev override is absent in prod). In **dev, Vite is the edge** (`:5173`) and proxies `/api/*` → backend and `/streams/*` → MediaMTX. In **prod, nginx is the edge** (`:80`), serving a baked-in React build, proxying `/api/*` to FastAPI, and serving HLS off disk. `/api/*` is forwarded without path rewriting, so URLs match across both. When adding a service: shared definition in the base file, dev-only concerns (ports, source mounts, `--reload`) in the override, prod-only concerns in the prod file.

**Streaming.** Phones running Moblin publish via SRT (`srt://<host>:8890`) to MediaMTX, which writes HLS segments to `./data/hls/<stream>/` on disk. MediaMTX serves them in dev (`:8888`); nginx serves them from the same path in prod (`/streams/*`). One source of truth on disk, two readers.

## Conventions & gotchas

- **Commits are author-only — do NOT add `Co-Authored-By` trailers** (overrides the default Claude Code behavior).
- **Named-volume staleness:** the `backend_venv` / `frontend_node_modules` named volumes cache old packages. After editing `pyproject.toml` or `package.json`, run `make clean` before `make up`, or the change won't take effect.
- **Adding deps:** backend `uv add <pkg>` / `uv add --group dev <pkg>` in `apps/backend`; frontend `npm install <pkg>` in `apps/frontend`. TS-related peer-dep conflicts: use `npm install --legacy-peer-deps` (the project runs TypeScript 6 while some tools still pin `typescript@^5`).
- **`.env` is gitignored** — new setup needs `cp .env.example .env` once.

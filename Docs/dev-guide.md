# Dev Guide

Quick reference for common developer tasks. Most commands assume you're in `FishingReels/` unless noted.

For the full Make target list and quick-start, see [`../FishingReels/README.md`](../FishingReels/README.md).

---

## Spinning things up

| Want                          | Run                          |
|-------------------------------|------------------------------|
| Full dev stack (Vite edge)    | `make up`                    |
| Prod-like local (nginx edge)  | `make prod-up`               |
| Tail logs                     | `make logs` / `make prod-logs` |
| Tear down                     | `make down` / `make prod-down` |

## Adding dependencies

After ANY dep change, the named volumes (`backend_venv`, `frontend_node_modules`) cache the OLD packages — run `make clean && make up` to refresh.

**Python (backend):**

```bash
cd FishingReels/apps/backend
uv add <package>                # runtime dep
uv add --group dev <package>    # dev dep
```

**Node (frontend):**

```bash
cd FishingReels/apps/frontend
npm install <package>           # runtime dep
npm install -D <package>        # dev dep
```

## Database migrations

```bash
# Create after editing a SQLAlchemy model:
docker compose exec backend alembic revision --autogenerate -m "<msg>"

# Apply:
make migrate

# Check current head:
docker compose exec backend alembic current
```

## OpenAPI type sync

After changing a FastAPI route shape:

```bash
make gen-api    # regenerates apps/frontend/src/api/types.ts
```

Stack must be up (`make up`) so the backend's `/openapi.json` is reachable.

## Frontend components (shadcn)

```bash
cd FishingReels/apps/frontend
npx shadcn@latest add <component>
```

Components land in `src/components/ui/`. Browse the catalog: https://ui.shadcn.com/docs/components

## Running tests

```bash
make test                                        # backend pytest in container (Postgres)
cd FishingReels/apps/backend && uv run pytest    # backend pytest on host (SQLite default)
```

Frontend test framework not yet set up.

## Debugging

```bash
make logs                                # tail all dev services
make prod-logs                           # tail all prod services
docker compose logs -f <svc>             # tail one service
make shell-backend                       # bash in backend container
make shell-db                            # psql against dev DB
docker compose exec <svc> <cmd>          # one-off command in any container
```

## Common gotchas

- **Named volume staleness.** After editing `pyproject.toml` or `package.json`, run `make clean` before `make up` — otherwise the `backend_venv` / `frontend_node_modules` named volumes still hold the old deps.
- **`apps/backend/dev.db` appears** when running pytest on the host (default SQLite fallback when `DATABASE_URL` isn't set). Gitignored via `*.db`; safe to delete.
- **`.env` is gitignored.** New devs run `cp .env.example .env` once during setup.
- **`docker-compose.override.yml`** is auto-loaded for `make up` but NOT for `make prod-up` (which passes explicit `-f` flags). Dev-only ports / bind mounts / `--reload` belong in the override.
- **Adding a new compose service:** put shared definition in `docker-compose.yml`, dev-only concerns (ports, source mounts, env) in `docker-compose.override.yml`, prod-only concerns in `docker-compose.prod.yml`.
- **TypeScript peer-dep conflicts** (e.g., when adding a TS-related dep that pins `typescript@^5`): use `npm install --legacy-peer-deps <pkg>`. The Dockerfile already passes this flag to `npm ci`.

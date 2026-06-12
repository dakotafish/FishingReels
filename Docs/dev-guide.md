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

## Issuing a stream key

Each angler publishes with a personal key — the MediaMTX path/SRT streamid is `publish:<key>`, and publishes with unknown or revoked keys are rejected at the door.

```bash
curl -s -X POST localhost:8000/api/anglers/<slug>/stream-keys             # mint
curl -s localhost:8000/api/anglers/<slug>/stream-keys                     # list
curl -s -X DELETE localhost:8000/api/anglers/<slug>/stream-keys/<key-id>  # revoke
```

The full secret appears **once**, in the mint response — save it then. Listings carry metadata plus a `key_hint` (last 4 chars) only. Lost key → mint a replacement and revoke the old one (revocation is a status flip, so an in-flight stream can still close out cleanly).

## Going live (and faking it)

**Real phone (Moblin):** SRT URL `srt://<host>:8890`, streamid `publish:<key>` — where `<key>` is the `key` value from the mint response above ("Issuing a stream key"), saved at mint time since it's only shown once. Example: key `xK3vR9_...gU` → streamid `publish:xK3vR9_...gU`. The codec **must be H.264/AVC + AAC — not HEVC**: the packager is a pure remux (`-c copy`), and HEVC HLS won't play in hls.js/most browsers.

**Fake publisher (no phone needed)** — runs inside the MediaMTX container, which ships ffmpeg:

```bash
docker compose exec mediamtx ffmpeg -re \
  -f lavfi -i testsrc2=size=1280x720:rate=30 \
  -f lavfi -i 'sine=frequency=440:sample_rate=48000' \
  -c:v libx264 -preset ultrafast -tune zerolatency -g 60 -b:v 1500k \
  -c:a aac -b:a 128k \
  -f mpegts 'srt://127.0.0.1:8890?streamid=publish:<KEY>'
```

Watch at http://localhost:5173/streams — you can scrub back to the start while live (the playlist is event-style, ~15–20s behind real time). Stop the publisher (`q` / Ctrl-C) and the same watch URL plays as the VOD.

Under the hood: the auth hook gates the publish → `/ready` creates the `Stream` row → ffmpeg writes `./data/hls/<stream-id>/` → on stop, `#EXT-X-ENDLIST` is appended and the row is marked `ended`.

**Reconnects:** publishing again with the same key (e.g. Moblin retrying after a network drop) takes over the MediaMTX path — the old `Stream` row is swept to `ended` and a fresh row + recording dir starts. One key, many sessions, each its own VOD.

**Debugging the hooks:**

```bash
docker compose logs -f mediamtx backend   # auth rejections + hook script stderr
ls data/hls/.sessions/                    # one file per in-flight session (key -> stream id)
# exercise a hook by hand:
curl -X POST localhost:8000/api/internal/mediamtx/ready \
  -H "X-Webhook-Secret: <your MEDIAMTX_WEBHOOK_SECRET>" \
  -H 'Content-Type: application/json' -d '{"path":"<key>"}'
```

## Frontend components (shadcn)

```bash
cd FishingReels/apps/frontend
npx shadcn@latest add <component>
```

Components land in `src/components/ui/`. Browse the catalog: https://ui.shadcn.com/docs/components

## Running tests

```bash
make test            # backend pytest in container, against the dockerized Postgres
make test-frontend   # frontend Vitest suite in the frontend container
```

Frontend tests use **Vitest + React Testing Library** (jsdom). Run directly on the host with `cd apps/frontend && npm run test` (or `npm run test:watch` while developing). Tests live next to the code they cover as `*.test.ts(x)`.

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
- **`DATABASE_URL` is required.** There is no SQLite fallback — the backend reads `DATABASE_URL` (from `.env` in the container) and fails fast if it's unset. Run tests via `make test` so they hit the dockerized Postgres.
- **`.env` is gitignored.** New devs run `cp .env.example .env` once during setup.
- **`MEDIAMTX_WEBHOOK_SECRET` is required.** The backend fails at startup without it (same fail-fast policy as `DATABASE_URL`). Existing setups: copy the new var from `.env.example` into your `.env`, then `docker compose up -d backend` so the container picks it up.
- **`docker-compose.override.yml`** is auto-loaded for `make up` but NOT for `make prod-up` (which passes explicit `-f` flags). Dev-only ports / bind mounts / `--reload` belong in the override.
- **Adding a new compose service:** put shared definition in `docker-compose.yml`, dev-only concerns (ports, source mounts, env) in `docker-compose.override.yml`, prod-only concerns in `docker-compose.prod.yml`.
- **TypeScript peer-dep conflicts** (e.g., when adding a TS-related dep that pins `typescript@^5`): use `npm install --legacy-peer-deps <pkg>`. The Dockerfile already passes this flag to `npm ci`.

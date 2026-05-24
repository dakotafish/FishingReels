.PHONY: up down logs ps shell-backend shell-db migrate test rebuild clean gen-api

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

shell-backend:
	docker compose exec backend bash

shell-db:
	docker compose exec postgres psql -U postgres -d fishingreels

migrate:
	docker compose exec backend alembic upgrade head

test:
	docker compose exec backend pytest

rebuild:
	docker compose build --no-cache

clean:
	docker compose down -v

gen-api:
	docker compose exec frontend npm run gen:api

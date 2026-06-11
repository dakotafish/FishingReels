.PHONY: up down logs ps shell-backend shell-db migrate test test-frontend rebuild clean gen-api prod-up prod-down prod-logs prod-rebuild

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

test-frontend:
	docker compose exec frontend npm run test

rebuild:
	docker compose build --no-cache

clean:
	docker compose down -v

gen-api:
	docker compose exec frontend npm run gen:api

prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

prod-rebuild:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

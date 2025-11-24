SHELL	= /bin/sh

NAME	= marcel-the-cat

# Parse .env file and fail if not found
-include .env

ifeq ($(wildcard .env),)
$(error .env file is required)
endif


# Clean / build frontend

clean_frontend:
	rm -rf frontend/dist
	mkdir -p frontend/dist

build_frontend_local: clean_frontend
	cd frontend && npm ci --omit=dev && \
	VITE_API_BASE_URL="$(API_SERVER_URL_LOCAL)" npm run build

build_frontend_prod: clean_frontend
	cd frontend && npm ci --omit=dev && \
	VITE_API_BASE_URL="$(API_SERVER_URL_PROD)" npm run build


# Build environments

dev:
	docker compose -f docker-compose.dev.yml up --build

prod: build_frontend_prod
	docker compose -f docker-compose.prod.yml up --build

prod_detached: build_frontend_prod
	docker compose -f docker-compose.prod.yml up -d --build

local_prod: build_frontend_local
	docker compose -f docker-compose.prod.yml -f docker-compose.localprod.yml up --build

# Maintenance tasks

down_dev:
	docker compose -f docker-compose.dev.yml down
stop_dev:
	docker compose -f docker-compose.dev.yml stop

down_prod:
	docker compose -f docker-compose.prod.yml down
stop_prod:
	docker compose -f docker-compose.prod.yml stop


.PHONY: _no_default dev prod prod_detached local_prod \
	down_dev stop_dev down_prod stop_prod \
	clean_frontend build_frontend_local build_frontend_prod 

.DEFAULT_GOAL := _no_default

_no_default:
	@echo "No default target. Please run 'make <target>'." >&2
	@exit 1
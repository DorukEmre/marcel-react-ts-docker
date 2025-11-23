SHELL	= /bin/sh

NAME	= marcel-the-cat

# Parse .env file and fail if not found
-include .env

ifeq ($(wildcard .env),)
$(error .env file is required)
endif


# Build environments

dev:
	docker compose -f docker-compose.dev.yml up --build

prod:
	docker compose -f docker-compose.prod.yml up --build

prod_detached:
	docker compose -f docker-compose.prod.yml up -d --build


# Maintenance tasks

down_dev:
	docker compose -f docker-compose.dev.yml down
stop_dev:
	docker compose -f docker-compose.dev.yml stop

down_prod:
	docker compose -f docker-compose.prod.yml down
stop_prod:
	docker compose -f docker-compose.prod.yml stop


.PHONY: _no_default dev prod prod_detached \
	down_dev stop_dev down_prod stop_prod \

.DEFAULT_GOAL := _no_default

_no_default:
	@echo "No default target. Please run 'make <target>'." >&2
	@exit 1
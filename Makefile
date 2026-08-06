# eLearning Monorepo — Root Makefile

.PHONY: dev dev-api dev-ams dev-web build test lint clean install

## Start all services concurrently (Vite FE, API BE, AMS BE) using Turborepo
dev:
	npm run dev

## Start API backend only (uses Air hot-reload)
dev-api:
	make -C apps/api dev

## Start AMS backend only (uses Air hot-reload)
dev-ams:
	make -C apps/ams dev

## Start web frontend only (uses Vite dev server)
dev-web:
	make -C apps/web dev

## Build all applications for production
build:
	npm run build

## Run linter checks across all projects
lint:
	npm run lint

## Clean all project build folders
clean:
	make -C apps/api clean || true
	make -C apps/ams clean || true
	make -C apps/web clean || true
	rm -rf dist/ tmp/ bin/ node_modules/

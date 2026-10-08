.PHONY: dev build preview clean install docker-up docker-down docker-build help test

# Default target
help:
	@echo "Travel Stories Landing Page - Development Commands"
	@echo ""
	@echo "Docker commands:"
	@echo "  make docker-up      Start development server in Docker"
	@echo "  make docker-down    Stop Docker containers"
	@echo "  make docker-build   Rebuild Docker image"
	@echo ""
	@echo "Native commands (requires Node 20+ and pnpm):"
	@echo "  make install        Install dependencies"
	@echo "  make dev            Start development server"
	@echo "  make build          Build for production"
	@echo "  make preview        Preview production build"
	@echo ""
	@echo "Tests:"
	@echo "  make test           Run the tools/ unit tests (stdlib, no deps)"
	@echo ""
	@echo "Utility:"
	@echo "  make clean          Remove build artifacts and node_modules"

# Docker commands
docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

docker-build:
	docker-compose build --no-cache

# Native development commands
install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

preview:
	pnpm preview

# Tests (stdlib unittest, no deps) — run before every PR
test:
	python3 -m unittest discover -s tools -p 'test_*.py'

# Utility
clean:
	rm -rf dist node_modules .astro

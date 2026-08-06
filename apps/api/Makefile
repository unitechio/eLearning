# eEnglish AMS Service — Makefile

.PHONY: dev build migrate test lint clean

## Run with air hot-reload (requires: go install github.com/air-verse/air@latest)
dev:
	air -c .air.toml

## Build the production binary
build:
	go run ./cmd/build/main.go

## Run migrations only (startup also runs migrations automatically)
migrate:
	go run ./cmd/server --migrate-only

## Run all tests
test:
	go test ./... -v -race -count=1

## Run linter
lint:
	golangci-lint run ./...

## Clean build artifacts
clean:
	rm -rf bin/

# eEnglish AMS Service — Makefile

.PHONY: dev build migrate test lint clean

## Run with air hot-reload
dev:
	air -c .air.toml

## Build the production binary
build:
	go run ./cmd/build/main.go

## Run all tests
test:
	go test ./... -v -race -count=1

## Run linter
lint:
	golangci-lint run ./...

## Clean build artifacts
clean:
	rm -rf tmp/ bin/

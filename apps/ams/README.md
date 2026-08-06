# eEnglish AMS Service

## Overview

The Access Management System (AMS) is a standalone Go microservice that provides enterprise-grade identity and access management for the eEnglish platform.

**Features:**
- RBAC: Roles, Permissions (with data scopes: self/dept/org/global)
- JWT-based auth with refresh token rotation and device fingerprinting
- SSO: OIDC and SAML providers
- OAuth2 / M2M auth clients
- Login channels with per-channel MFA enforcement
- Security policies (step-up auth, rate-limiting)
- Trusted device management
- Comprehensive audit logging

## Development

### Prerequisites

- Go 1.22+
- PostgreSQL 14+ (a separate `eenglish_ams` database)
- [air](https://github.com/air-verse/air) for hot reload: `go install github.com/air-verse/air@latest`

### Setup

```bash
# Copy the example env and edit your DB credentials
cp .env.dev .env

# Install dependencies
go mod download

# Run with hot reload
make dev
```

The AMS server runs on **http://localhost:8082** by default.

### Database

The AMS uses its own PostgreSQL database (`eenglish_ams`). Migrations are applied automatically at startup.

```sql
CREATE DATABASE eenglish_ams;
```

Configure `DB_DSN` in `.env` accordingly.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8082` |
| `DB_DSN` | PostgreSQL DSN | see `.env` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_ACCESS_TTL` | Access token TTL | `15m` |
| `JWT_REFRESH_TTL` | Refresh token TTL | `168h` |
| `CORS_ALLOW_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |
| `VITE_AMS_API_URL` | Frontend env variable | `http://localhost:8082/api/v1` |

## API

Base URL: `http://localhost:8082/api/v1`

See [../../apps/web/src/domains/admin/api/ams/service.ts](../../apps/web/src/domains/admin/api/ams/service.ts) for the full endpoint list.

## Integration with eEnglish Frontend

In `apps/web/.env.local`, add:

```
VITE_AMS_API_URL=http://localhost:8082/api/v1
```

The Vite dev server is already configured to proxy `/api/ams/*` to `http://localhost:8082`.

## Architecture

```
cmd/server/main.go              ← Entry point
internal/
  config/                       ← Config loading (viper)
  domain/                       ← Entities (User, Role, Permission, …)
  repository/                   ← GORM repositories
  usecase/                      ← Business logic
  http/
    handler/                    ← Gin handlers
    middleware/                 ← Auth, Audit, Permission enforcement
    router.go                   ← Route registration
  authorization/
    authz/                      ← Permission checker
    permission/                 ← Permission registry
    specification/              ← Policy specs
  jwt/                          ← JWT generation/validation
  security/                     ← TOTP, step-up, hashing
  bootstrap/                    ← Dependency wiring
migrations/                     ← SQL migration files
```

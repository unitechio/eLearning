// Package ratelimit provides a portable interface for rate limiting,
// decoupling business logic from any specific backend (Redis, in-memory, etc.).
//
// The interface is intentionally minimal. Only the Allow method is required.
// Implementations live in infrastructure packages (e.g., internal/infrastructure/cache).
package ratelimit

import (
	"context"
	"time"
)

// Limiter is the rate limiting contract.
// It is placed in pkg/ so both the usecase layer and infrastructure
// can import it without creating circular dependencies.
type Limiter interface {
	// Allow checks whether the given key is still within the allowed rate.
	// key    — unique identifier for the rate limit bucket (e.g., "forgot:user@example.com")
	// limit  — maximum number of requests allowed within the window
	// window — duration of the sliding window
	//
	// Returns:
	//   allowed   — true if the request is permitted
	//   remaining — number of remaining requests before the limit is hit
	//   err       — non-nil if the underlying store fails (callers should fail-open or fail-closed as appropriate)
	Allow(ctx context.Context, key string, limit int, window time.Duration) (allowed bool, remaining int, err error)
}

// NoopLimiter is a Limiter that always permits every request.
// It is used as a safe fallback when the underlying rate-limit backend
// (e.g., Redis) is unavailable at startup.
type NoopLimiter struct{}

// Allow always returns allowed=true with the full limit remaining.
func (NoopLimiter) Allow(_ context.Context, _ string, limit int, _ time.Duration) (bool, int, error) {
	return true, limit, nil
}

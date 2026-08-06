package cache

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
	ratelimit "github.com/unitechio/eLearning/apps/api/pkg/ratelimit"
)

// RedisRateLimiter implements ratelimit.Limiter using Redis counters with
// an atomic INCR + TTL pipeline. It satisfies the interface defined in
// pkg/ratelimit so the usecase layer never imports this package directly.
type RedisRateLimiter struct {
	client *redis.Client
}

// NewRedisRateLimiter constructs a RedisRateLimiter from an existing Redis client.
func NewRedisRateLimiter(client *redis.Client) ratelimit.Limiter {
	return &RedisRateLimiter{client: client}
}

// Allow atomically increments the request counter for key and checks whether
// the result is within the given limit. On the first request within a window,
// the TTL is set.
func (r *RedisRateLimiter) Allow(ctx context.Context, key string, limit int, window time.Duration) (bool, int, error) {
	rateLimitKey := constants.PrefixRateLimit + key

	pipe := r.client.TxPipeline()
	incrCmd := pipe.Incr(ctx, rateLimitKey)
	ttlCmd := pipe.TTL(ctx, rateLimitKey)

	if _, err := pipe.Exec(ctx); err != nil {
		return false, 0, err
	}

	current := incrCmd.Val()

	// First request in this window — set the expiry.
	if ttlCmd.Val() < 0 {
		if err := r.client.Expire(ctx, rateLimitKey, window).Err(); err != nil {
			return false, 0, err
		}
	}

	allowed := current <= int64(limit)
	remaining := max(0, int64(limit)-current)
	return allowed, int(remaining), nil
}

func max(a, b int64) int64 {
	if a > b {
		return a
	}
	return b
}

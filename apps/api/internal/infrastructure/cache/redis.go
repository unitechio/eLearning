package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
)

var Client *redis.Client

func Init(cfg *config.RedisConfig) error {
	addr := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	Client = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := Client.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	slog.Info("Redis connected successfully",
		slog.String("addr", addr),
		slog.Int("db", cfg.DB),
	)

	return nil
}

func Close() error {
	if Client != nil {
		return Client.Close()
	}
	return nil
}

func GetClient() *redis.Client {
	return Client
}

func Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return Client.Set(ctx, key, value, expiration).Err()
}

func Get(ctx context.Context, key string) (string, error) {
	return Client.Get(ctx, key).Result()
}

func Delete(ctx context.Context, keys ...string) error {
	return Client.Del(ctx, keys...).Err()
}

func Exists(ctx context.Context, keys ...string) (int64, error) {
	return Client.Exists(ctx, keys...).Result()
}

// Expire sets an expiration on a key
func Expire(ctx context.Context, key string, expiration time.Duration) error {
	return Client.Expire(ctx, key, expiration).Err()
}

// HSet sets a hash field
func HSet(ctx context.Context, key string, values ...interface{}) error {
	return Client.HSet(ctx, key, values...).Err()
}

// HGet gets a hash field
func HGet(ctx context.Context, key, field string) (string, error) {
	return Client.HGet(ctx, key, field).Result()
}

// HGetAll gets all hash fields
func HGetAll(ctx context.Context, key string) (map[string]string, error) {
	return Client.HGetAll(ctx, key).Result()
}

// HDel deletes hash fields
func HDel(ctx context.Context, key string, fields ...string) error {
	return Client.HDel(ctx, key, fields...).Err()
}

// Incr increments a key
func Incr(ctx context.Context, key string) (int64, error) {
	return Client.Incr(ctx, key).Result()
}

// Decr decrements a key
func Decr(ctx context.Context, key string) (int64, error) {
	return Client.Decr(ctx, key).Result()
}

// SetNX sets a key only if it doesn't exist
func SetNX(ctx context.Context, key string, value interface{}, expiration time.Duration) (bool, error) {
	return Client.SetNX(ctx, key, value, expiration).Result()
}

// GetDel gets and deletes a key
func GetDel(ctx context.Context, key string) (string, error) {
	return Client.GetDel(ctx, key).Result()
}

// Keys returns all keys matching pattern
func Keys(ctx context.Context, pattern string) ([]string, error) {
	return Client.Keys(ctx, pattern).Result()
}

// FlushDB flushes the current database
func FlushDB(ctx context.Context) error {
	return Client.FlushDB(ctx).Err()
}

// BuildKey builds a cache key with prefix
func BuildKey(prefix, id string) string {
	return prefix + id
}

// CacheUserSession caches a user session
func CacheUserSession(ctx context.Context, sessionID string, userID uuid.UUID, expiration time.Duration) error {
	key := BuildKey(constants.PrefixSession, sessionID)
	return Set(ctx, key, userID.String(), expiration)
}

// GetUserSession gets a user session
func GetUserSession(ctx context.Context, sessionID string) (string, error) {
	key := BuildKey(constants.PrefixSession, sessionID)
	return Get(ctx, key)
}

// DeleteUserSession deletes a user session
func DeleteUserSession(ctx context.Context, sessionID string) error {
	key := BuildKey(constants.PrefixSession, sessionID)
	return Delete(ctx, key)
}

func SaveOTP(
	ctx context.Context, scope string, id string, otp string, ttl time.Duration) error {
	key := BuildKey(constants.PrefixOTP, scope+":"+id)
	return Client.Set(ctx, key, otp, ttl).Err()
}

func GetOTP(ctx context.Context, scope string, id string) (string, error) {
	key := BuildKey(constants.PrefixOTP, scope+":"+id)
	return Client.Get(ctx, key).Result()
}

func DeleteOTP(ctx context.Context, scope string, id string) error {
	key := BuildKey(constants.PrefixOTP, scope+":"+id)
	return Client.Del(ctx, key).Err()
}

// CachePermissions caches user permissions
func CachePermissions(ctx context.Context, userID uuid.UUID, permissions []string, expiration time.Duration) error {
	key := BuildKey(constants.PrefixPermission, userID.String())
	// Store as hash for efficient access
	values := make([]interface{}, 0, len(permissions)*2)
	for _, perm := range permissions {
		values = append(values, perm, "1")
	}
	if err := HSet(ctx, key, values...); err != nil {
		return err
	}
	return Expire(ctx, key, expiration)
}

// GetPermissions gets cached user permissions
func GetPermissions(ctx context.Context, userID uuid.UUID) (map[string]string, error) {
	key := BuildKey(constants.PrefixPermission, userID.String())
	return HGetAll(ctx, key)
}

// InvalidatePermissions invalidates user permissions cache
func InvalidatePermissions(ctx context.Context, userID uuid.UUID) error {
	key := BuildKey(constants.PrefixPermission, userID.String())
	return Delete(ctx, key)
}

// CheckRateLimit increments the request counter and checks whether
// the request is still within the allowed limit.
//
// Returns:
//   - allowed: whether the request is allowed
//   - current: current request count within the window
//   - remaining: remaining requests before reaching the limit
func CheckRateLimit(ctx context.Context, key string, limit int64, window time.Duration) (allowed bool, current int64, remaining int64, err error) {
	rateLimitKey := BuildKey(constants.PrefixRateLimit, key)
	pipe := Client.TxPipeline()
	incr := pipe.Incr(ctx, rateLimitKey)
	ttl := pipe.TTL(ctx, rateLimitKey)

	if _, err = pipe.Exec(ctx); err != nil {
		return false, 0, 0, err
	}

	current = incr.Val()

	// First request -> set expiration
	if ttl.Val() < 0 {
		if err = Client.Expire(ctx, rateLimitKey, window).Err(); err != nil {
			return false, current, 0, err
		}
	}

	allowed = current <= limit
	if current >= limit {
		remaining = 0
	} else {
		remaining = limit - current
	}

	return
}

func SetJSON[T any](ctx context.Context, key string, value T, ttl time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return Client.Set(ctx, key, b, ttl).Err()
}

func GetJSON[T any](ctx context.Context, key string) (*T, error) {
	val, err := Client.Get(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	var obj T
	if err := json.Unmarshal([]byte(val), &obj); err != nil {
		return nil, err
	}

	return &obj, nil
}

func HSetJSON[T any](ctx context.Context, key, field string, value T) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return Client.HSet(ctx, key, field, b).Err()
}

// HGetJSON retrieves json from hash.
func HGetJSON[T any](ctx context.Context, key, field string) (*T, error) {
	val, err := Client.HGet(ctx, key, field).Result()
	if err != nil {
		return nil, err
	}

	var obj T
	if err := json.Unmarshal([]byte(val), &obj); err != nil {
		return nil, err
	}

	return &obj, nil
}

// GetOrSet tries Redis first.
// If missing, calls loader() then caches result.
func GetOrSet[T any](
	ctx context.Context,
	key string,
	ttl time.Duration,
	loader func() (*T, error),
) (*T, error) {

	obj, err := GetJSON[T](ctx, key)
	if err == nil {
		return obj, nil
	}

	obj, err = loader()
	if err != nil {
		return nil, err
	}

	if obj != nil {
		_ = SetJSON(ctx, key, *obj, ttl)
	}

	return obj, nil
}

//
// ========================
// Distributed Lock
// ========================
//

func AcquireLock(
	ctx context.Context,
	key string,
	ttl time.Duration,
) (bool, error) {

	return Client.SetNX(ctx, "lock:"+key, "1", ttl).Result()
}

func ReleaseLock(
	ctx context.Context,
	key string,
) error {

	return Client.Del(ctx, "lock:"+key).Err()
}

//
// ========================
// Counter
// ========================
//

// IncrementWithTTL increments a counter.
// First increment will automatically set ttl.
func IncrementWithTTL(
	ctx context.Context,
	key string,
	ttl time.Duration,
) (int64, error) {

	n, err := Client.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}

	if n == 1 {
		_ = Client.Expire(ctx, key, ttl).Err()
	}

	return n, nil
}

//
// ========================
// Rate Limit
// ========================
//

func ScanKeys(
	ctx context.Context,
	pattern string,
) ([]string, error) {

	var (
		cursor uint64
		keys   []string
	)

	for {
		k, next, err := Client.Scan(ctx, cursor, pattern, 200).Result()
		if err != nil {
			return nil, err
		}

		keys = append(keys, k...)

		cursor = next
		if cursor == 0 {
			break
		}
	}

	return keys, nil
}

func DeleteByPattern(ctx context.Context, pattern string) error {
	keys, err := ScanKeys(ctx, pattern)
	if err != nil {
		return err
	}

	if len(keys) == 0 {
		return nil
	}

	return Client.Del(ctx, keys...).Err()
}

func Remember[T any](
	ctx context.Context,
	prefix string,
	id any,
	ttl time.Duration,
	loader func() (*T, error),
) (*T, error) {

	key := fmt.Sprintf("%s:%v", prefix, id)

	return GetOrSet(ctx, key, ttl, loader)
}

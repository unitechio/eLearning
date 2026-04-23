package repository

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LoginAttemptRepository interface {
	Create(ctx context.Context, attempt *domain.LoginAttempt) error
	GetRecentAttempts(ctx context.Context, username, ipAddress string, duration time.Duration) ([]*domain.LoginAttempt, error)
	GetFailedAttempts(ctx context.Context, username, ipAddress string, duration time.Duration) (int64, error)
	DeleteOlderThan(ctx context.Context, duration time.Duration) error
}

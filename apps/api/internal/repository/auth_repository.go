package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type TokenUsageStats struct {
	TotalTokens   int64
	ActiveTokens  int64
	RevokedTokens int64
	ExpiredTokens int64
	LastUsedAt    *time.Time
}

type AuthRepository interface {
	SaveRefreshToken(ctx context.Context, token *domain.RefreshToken) error
	GetRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) (*domain.RefreshToken, error)
	GetRefreshTokenByToken(ctx context.Context, token string) (*domain.RefreshToken, error)
	GetRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error)
	UpdateRefreshToken(ctx context.Context, token *domain.RefreshToken) error
	DeleteRefreshToken(ctx context.Context, tokenID uuid.UUID) error
	IsTokenValid(ctx context.Context, token string) (bool, error)
	GetActiveRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error)
	GetUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error)
	GetActiveUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error)
	RevokeRefreshToken(ctx context.Context, tokenID uuid.UUID) error
	RevokeRefreshTokenByToken(ctx context.Context, token string) error
	RevokeAllRefreshTokensForUser(ctx context.Context, userID uuid.UUID) error
	RevokeOldestTokensForUser(ctx context.Context, userID uuid.UUID, keepCount int) error
	DeleteExpiredRefreshTokens(ctx context.Context) error
	DeleteRevokedRefreshTokens(ctx context.Context, olderThan time.Time) error
	CleanupUserTokens(ctx context.Context, userID uuid.UUID, maxTokens int) error
	// UpdateLastUsedAt records when a token was last used for rotation tracking.
	// Uses a dedicated last_used_at column, not the updated_at audit timestamp.
	UpdateLastUsedAt(ctx context.Context, tokenID uuid.UUID) error
	GetTokenUsageStats(ctx context.Context, userID uuid.UUID) (*TokenUsageStats, error)
	SaveRefreshTokens(ctx context.Context, tokens []*domain.RefreshToken) error
	// RevokeRefreshTokens bulk-revokes the given token IDs.
	RevokeRefreshTokens(ctx context.Context, tokenIDs []uuid.UUID) error
}

package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

var (
	ErrRefreshTokenNotFound = errors.New("refresh token not found")
	ErrRefreshTokenExpired  = errors.New("refresh token expired")
	ErrRefreshTokenRevoked  = errors.New("refresh token revoked")
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
	GetRefreshTokenByID(ctx context.Context, tokenID string) (*domain.RefreshToken, error)
	GetRefreshTokenByToken(ctx context.Context, token string) (*domain.RefreshToken, error)
	GetRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error)
	UpdateRefreshToken(ctx context.Context, token *domain.RefreshToken) error
	DeleteRefreshToken(ctx context.Context, tokenID string) error
	IsTokenValid(ctx context.Context, token string) (bool, error)
	GetActiveRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error)
	GetUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error)
	GetActiveUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error)
	RevokeRefreshToken(ctx context.Context, tokenID string) error
	RevokeRefreshTokenByToken(ctx context.Context, token string) error
	RevokeAllRefreshTokensForUser(ctx context.Context, userID uuid.UUID) error
	RevokeOldestTokensForUser(ctx context.Context, userID uuid.UUID, keepCount int) error
	DeleteExpiredRefreshTokens(ctx context.Context) error
	DeleteRevokedRefreshTokens(ctx context.Context, olderThan time.Time) error
	CleanupUserTokens(ctx context.Context, userID uuid.UUID, maxTokens int) error
	UpdateLastUsedAt(ctx context.Context, tokenID string) error
	GetTokenUsageStats(ctx context.Context, userID uuid.UUID) (*TokenUsageStats, error)
	SaveRefreshTokens(ctx context.Context, tokens []*domain.RefreshToken) error
	RevokeRefreshTokens(ctx context.Context, tokenIDs []string) error
}

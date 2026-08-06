package impl

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

// AuthRepository implements repository.AuthRepository using GORM.
type AuthRepository struct {
	db *gorm.DB
}

// NewAuthRepository constructs an AuthRepository backed by the given DB connection.
func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) SaveRefreshToken(ctx context.Context, token *domain.RefreshToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *AuthRepository) GetRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) (*domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken
	err := r.db.WithContext(ctx).Where("id = ?", tokenID).First(&refreshToken).Error
	if err != nil {
		return nil, wrapNotFoundErr(err, errs.ErrRefreshTokenNotFound)
	}
	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokenByToken(ctx context.Context, token string) (*domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken
	err := r.db.WithContext(ctx).Where("token = ?", token).First(&refreshToken).Error
	if err != nil {
		return nil, wrapNotFoundErr(err, errs.ErrRefreshTokenNotFound)
	}
	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error) {
	var tokens []*domain.RefreshToken
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&tokens).Error
	return tokens, err
}

func (r *AuthRepository) UpdateRefreshToken(ctx context.Context, token *domain.RefreshToken) error {
	result := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("id = ?", token.ID).
		Updates(token)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errs.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) DeleteRefreshToken(ctx context.Context, tokenID uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&domain.RefreshToken{}, "id = ?", tokenID)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errs.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) IsTokenValid(ctx context.Context, token string) (bool, error) {
	refreshToken, err := r.GetRefreshTokenByToken(ctx, token)
	if err != nil {
		return false, err
	}
	if refreshToken.Revoked {
		return false, errs.ErrRefreshTokenRevoked
	}
	if refreshToken.IsExpired() {
		return false, errs.ErrRefreshTokenExpired
	}
	return true, nil
}

func (r *AuthRepository) GetActiveRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error) {
	var tokens []*domain.RefreshToken
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND revoked = false AND expires_at > ?", userID, time.Now()).
		Order("created_at DESC").
		Find(&tokens).Error
	return tokens, err
}

func (r *AuthRepository) GetUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	return count, err
}

func (r *AuthRepository) GetActiveUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("user_id = ? AND revoked = false AND expires_at > ?", userID, time.Now()).
		Count(&count).Error
	return count, err
}

func (r *AuthRepository) RevokeRefreshToken(ctx context.Context, tokenID uuid.UUID) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("id = ?", tokenID).
		Updates(map[string]any{"revoked": true, "revoked_at": &now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errs.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) RevokeRefreshTokenByToken(ctx context.Context, token string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("token = ?", token).
		Updates(map[string]any{"revoked": true, "revoked_at": &now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errs.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) RevokeAllRefreshTokensForUser(ctx context.Context, userID uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("user_id = ? AND revoked = false", userID).
		Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

func (r *AuthRepository) RevokeOldestTokensForUser(ctx context.Context, userID uuid.UUID, keepCount int) error {
	var tokens []*domain.RefreshToken
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND revoked = false", userID).
		Order("created_at DESC").
		Find(&tokens).Error; err != nil {
		return err
	}
	if len(tokens) <= keepCount {
		return nil
	}
	tokenIDsToRevoke := collectTokenIDs(tokens[keepCount:])
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("id IN ?", tokenIDsToRevoke).
		Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

func (r *AuthRepository) DeleteExpiredRefreshTokens(ctx context.Context) error {
	return r.db.WithContext(ctx).
		Where("expires_at < ?", time.Now()).
		Delete(&domain.RefreshToken{}).Error
}

func (r *AuthRepository) DeleteRevokedRefreshTokens(ctx context.Context, olderThan time.Time) error {
	return r.db.WithContext(ctx).
		Where("revoked = true AND revoked_at < ?", olderThan).
		Delete(&domain.RefreshToken{}).Error
}

func (r *AuthRepository) CleanupUserTokens(ctx context.Context, userID uuid.UUID, maxTokens int) error {
	count, err := r.GetActiveUserTokenCount(ctx, userID)
	if err != nil {
		return err
	}
	if count <= int64(maxTokens) {
		return nil
	}
	return r.RevokeOldestTokensForUser(ctx, userID, maxTokens)
}

// UpdateLastUsedAt records the time a refresh token was last used for rotation tracking.
// Uses a dedicated `last_used_at` column rather than abusing `updated_at`.
func (r *AuthRepository) UpdateLastUsedAt(ctx context.Context, tokenID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("id = ?", tokenID).
		Update("last_used_at", time.Now())
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errs.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) GetTokenUsageStats(ctx context.Context, userID uuid.UUID) (*repository.TokenUsageStats, error) {
	now := time.Now()
	stats := &repository.TokenUsageStats{}

	queries := []struct {
		dest  *int64
		where string
		args  []any
	}{
		{&stats.TotalTokens, "user_id = ?", []any{userID}},
		{&stats.ActiveTokens, "user_id = ? AND revoked = false AND expires_at > ?", []any{userID, now}},
		{&stats.RevokedTokens, "user_id = ? AND revoked = true", []any{userID}},
		{&stats.ExpiredTokens, "user_id = ? AND revoked = false AND expires_at <= ?", []any{userID, now}},
	}
	for _, q := range queries {
		if err := r.db.WithContext(ctx).
			Model(&domain.RefreshToken{}).
			Where(q.where, q.args...).
			Count(q.dest).Error; err != nil {
			return nil, err
		}
	}

	var lastUsedAt time.Time
	if err := r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("user_id = ?", userID).
		Select("MAX(last_used_at)").
		Scan(&lastUsedAt).Error; err == nil && !lastUsedAt.IsZero() {
		stats.LastUsedAt = &lastUsedAt
	}
	return stats, nil
}

func (r *AuthRepository) SaveRefreshTokens(ctx context.Context, tokens []*domain.RefreshToken) error {
	if len(tokens) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).CreateInBatches(tokens, batchSize).Error
}

func (r *AuthRepository) RevokeRefreshTokens(ctx context.Context, tokenIDs []uuid.UUID) error {
	if len(tokenIDs) == 0 {
		return nil
	}
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.RefreshToken{}).
		Where("id IN ?", tokenIDs).
		Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

const batchSize = 100

func collectTokenIDs(tokens []*domain.RefreshToken) []uuid.UUID {
	ids := make([]uuid.UUID, 0, len(tokens))
	for _, t := range tokens {
		ids = append(ids, t.ID)
	}
	return ids
}

// ensure wrapNotFoundErr is referenced — it is defined in user_repository_impl.go
var _ = errors.Is

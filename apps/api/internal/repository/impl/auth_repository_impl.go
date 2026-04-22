package impl

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

var (
	ErrRefreshTokenNotFound = errors.New("refresh token not found")
	ErrRefreshTokenExpired  = errors.New("refresh token expired")
	ErrRefreshTokenRevoked  = errors.New("refresh token revoked")
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

// Basic CRUD operations
func (r *AuthRepository) SaveRefreshToken(ctx context.Context, token *model.RefreshToken) error {
	if err := r.db.WithContext(ctx).Create(token).Error; err != nil {
		return fmt.Errorf("failed to save refresh token: %w", err)
	}
	return nil
}

func (r *AuthRepository) GetRefreshTokenByID(ctx context.Context, tokenID string) (*model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	err := r.db.WithContext(ctx).
		First(&refreshToken, "id = ?", tokenID).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrRefreshTokenNotFound
		}
		return nil, fmt.Errorf("failed to get refresh token by ID: %w", err)
	}

	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokenByToken(ctx context.Context, token string) (*model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	err := r.db.WithContext(ctx).
		First(&refreshToken, "token = ?", token).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrRefreshTokenNotFound
		}
		return nil, fmt.Errorf("failed to get refresh token: %w", err)
	}

	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokensByUserID(ctx context.Context, userID string) ([]*model.RefreshToken, error) {
	var tokens []*model.RefreshToken
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&tokens).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get refresh tokens by user ID: %w", err)
	}

	return tokens, nil
}

func (r *AuthRepository) UpdateRefreshToken(ctx context.Context, token *model.RefreshToken) error {
	result := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("id = ?", token.ID).
		Updates(token)

	if result.Error != nil {
		return fmt.Errorf("failed to update refresh token: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrRefreshTokenNotFound
	}

	return nil
}

func (r *AuthRepository) DeleteRefreshToken(ctx context.Context, tokenID string) error {
	result := r.db.WithContext(ctx).
		Delete(&model.RefreshToken{}, "id = ?", tokenID)

	if result.Error != nil {
		return fmt.Errorf("failed to delete refresh token: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrRefreshTokenNotFound
	}

	return nil
}

// Token validation and status

func (r *AuthRepository) IsTokenValid(ctx context.Context, token string) (bool, error) {
	var refreshToken model.RefreshToken
	err := r.db.WithContext(ctx).
		Select("id, expires_at, is_revoked").
		First(&refreshToken, "token = ?", token).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, ErrRefreshTokenNotFound
		}
		return false, fmt.Errorf("failed to check token validity: %w", err)
	}

	if refreshToken.IsRevoked {
		return false, ErrRefreshTokenRevoked
	}

	if refreshToken.ExpiresAt.Before(time.Now()) {
		return false, ErrRefreshTokenExpired
	}

	return true, nil
}

func (r *AuthRepository) GetActiveRefreshTokensByUserID(ctx context.Context, userID string) ([]*model.RefreshToken, error) {
	var tokens []*model.RefreshToken
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND is_revoked = false AND expires_at > ?", userID, time.Now()).
		Order("created_at DESC").
		Find(&tokens).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get active refresh tokens: %w", err)
	}

	return tokens, nil
}

func (r *AuthRepository) GetUserTokenCount(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ?", userID).
		Count(&count).Error

	if err != nil {
		return 0, fmt.Errorf("failed to get user token count: %w", err)
	}

	return count, nil
}

func (r *AuthRepository) GetActiveUserTokenCount(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ? AND is_revoked = false AND expires_at > ?", userID, time.Now()).
		Count(&count).Error

	if err != nil {
		return 0, fmt.Errorf("failed to get active user token count: %w", err)
	}

	return count, nil
}

// Token revocation

func (r *AuthRepository) RevokeRefreshToken(ctx context.Context, tokenID string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("id = ?", tokenID).
		Updates(map[string]interface{}{
			"is_revoked": true,
			"revoked_at": now,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to revoke refresh token: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrRefreshTokenNotFound
	}

	return nil
}

func (r *AuthRepository) RevokeRefreshTokenByToken(ctx context.Context, token string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("token = ?", token).
		Updates(map[string]interface{}{
			"is_revoked": true,
			"revoked_at": now,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to revoke refresh token by token: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrRefreshTokenNotFound
	}

	return nil
}

func (r *AuthRepository) RevokeAllRefreshTokensForUser(ctx context.Context, userID string) error {
	now := time.Now()
	err := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ? AND is_revoked = false", userID).
		Updates(map[string]interface{}{
			"is_revoked": true,
			"revoked_at": now,
		}).Error

	if err != nil {
		return fmt.Errorf("failed to revoke all refresh tokens for user: %w", err)
	}

	return nil
}

func (r *AuthRepository) RevokeOldestTokensForUser(ctx context.Context, userID string, keepCount int) error {
	// Get all tokens ordered by creation date (newest first)
	var tokens []*model.RefreshToken
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND is_revoked = false", userID).
		Order("created_at DESC").
		Find(&tokens).Error

	if err != nil {
		return fmt.Errorf("failed to get tokens for revocation: %w", err)
	}

	// If we have fewer tokens than keepCount, nothing to revoke
	if len(tokens) <= keepCount {
		return nil
	}

	// Get token IDs to revoke (oldest ones)
	tokensToRevoke := tokens[keepCount:]
	tokenIDs := make([]string, len(tokensToRevoke))
	for i, token := range tokensToRevoke {
		tokenIDs[i] = token.ID
	}

	// Revoke the oldest tokens
	now := time.Now()
	err = r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("id IN ?", tokenIDs).
		Updates(map[string]interface{}{
			"is_revoked": true,
			"revoked_at": now,
		}).Error

	if err != nil {
		return fmt.Errorf("failed to revoke oldest tokens: %w", err)
	}

	return nil
}

// Token cleanup and maintenance

func (r *AuthRepository) DeleteExpiredRefreshTokens(ctx context.Context) error {
	err := r.db.WithContext(ctx).
		Where("expires_at < ?", time.Now()).
		Delete(&model.RefreshToken{}).Error

	if err != nil {
		return fmt.Errorf("failed to delete expired refresh tokens: %w", err)
	}

	return nil
}

func (r *AuthRepository) DeleteRevokedRefreshTokens(ctx context.Context, olderThan time.Time) error {
	err := r.db.WithContext(ctx).
		Where("is_revoked = true AND revoked_at < ?", olderThan).
		Delete(&model.RefreshToken{}).Error

	if err != nil {
		return fmt.Errorf("failed to delete revoked refresh tokens: %w", err)
	}

	return nil
}

func (r *AuthRepository) CleanupUserTokens(ctx context.Context, userID string, maxTokens int) error {
	// Get count of active tokens
	count, err := r.GetActiveUserTokenCount(ctx, userID)
	if err != nil {
		return err
	}

	// If under limit, no cleanup needed
	if count <= int64(maxTokens) {
		return nil
	}

	// Revoke oldest tokens to bring count down to maxTokens
	return r.RevokeOldestTokensForUser(ctx, userID, maxTokens)
}

// Token usage tracking

func (r *AuthRepository) UpdateLastUsedAt(ctx context.Context, tokenID string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("id = ?", tokenID).
		Update("last_used_at", now)

	if result.Error != nil {
		return fmt.Errorf("failed to update last used at: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrRefreshTokenNotFound
	}

	return nil
}

func (r *AuthRepository) GetTokenUsageStats(ctx context.Context, userID string) (*TokenUsageStats, error) {
	var stats TokenUsageStats
	now := time.Now()

	// Total tokens
	err := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ?", userID).
		Count(&stats.TotalTokens).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get total token count: %w", err)
	}

	// Active tokens
	err = r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ? AND is_revoked = false AND expires_at > ?", userID, now).
		Count(&stats.ActiveTokens).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get active token count: %w", err)
	}

	// Revoked tokens
	err = r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ? AND is_revoked = true", userID).
		Count(&stats.RevokedTokens).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get revoked token count: %w", err)
	}

	// Expired tokens
	err = r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ? AND is_revoked = false AND expires_at <= ?", userID, now).
		Count(&stats.ExpiredTokens).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get expired token count: %w", err)
	}

	// Last used at
	var lastUsed time.Time
	err = r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("user_id = ?", userID).
		Select("MAX(last_used_at)").
		Scan(&lastUsed).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to get last used at: %w", err)
	}
	if !lastUsed.IsZero() {
		stats.LastUsedAt = &lastUsed
	}

	return &stats, nil
}

// Batch operations

func (r *AuthRepository) SaveRefreshTokens(ctx context.Context, tokens []*model.RefreshToken) error {
	if len(tokens) == 0 {
		return nil
	}

	err := r.db.WithContext(ctx).
		CreateInBatches(tokens, 100).Error

	if err != nil {
		return fmt.Errorf("failed to save refresh tokens in batch: %w", err)
	}

	return nil
}

func (r *AuthRepository) RevokeRefreshTokens(ctx context.Context, tokenIDs []string) error {
	if len(tokenIDs) == 0 {
		return nil
	}

	now := time.Now()
	err := r.db.WithContext(ctx).
		Model(&model.RefreshToken{}).
		Where("id IN ?", tokenIDs).
		Updates(map[string]interface{}{
			"is_revoked": true,
			"revoked_at": now,
		}).Error

	if err != nil {
		return fmt.Errorf("failed to revoke refresh tokens in batch: %w", err)
	}

	return nil
}

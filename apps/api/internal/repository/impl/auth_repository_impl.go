package impl

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) SaveRefreshToken(ctx context.Context, token *domain.RefreshToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *AuthRepository) GetRefreshTokenByID(ctx context.Context, tokenID string) (*domain.RefreshToken, error) {
	id, err := uuid.Parse(tokenID)
	if err != nil {
		return nil, err
	}
	var refreshToken domain.RefreshToken
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&refreshToken).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, repository.ErrRefreshTokenNotFound
		}
		return nil, err
	}
	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokenByToken(ctx context.Context, token string) (*domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken
	if err := r.db.WithContext(ctx).Where("token = ?", token).First(&refreshToken).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, repository.ErrRefreshTokenNotFound
		}
		return nil, err
	}
	return &refreshToken, nil
}

func (r *AuthRepository) GetRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error) {
	var tokens []*domain.RefreshToken
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at DESC").Find(&tokens).Error; err != nil {
		return nil, err
	}
	return tokens, nil
}

func (r *AuthRepository) UpdateRefreshToken(ctx context.Context, token *domain.RefreshToken) error {
	result := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("id = ?", token.ID).Updates(token)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) DeleteRefreshToken(ctx context.Context, tokenID string) error {
	id, err := uuid.Parse(tokenID)
	if err != nil {
		return err
	}
	result := r.db.WithContext(ctx).Delete(&domain.RefreshToken{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) IsTokenValid(ctx context.Context, token string) (bool, error) {
	refreshToken, err := r.GetRefreshTokenByToken(ctx, token)
	if err != nil {
		return false, err
	}
	if refreshToken.Revoked {
		return false, repository.ErrRefreshTokenRevoked
	}
	if refreshToken.IsExpired() {
		return false, repository.ErrRefreshTokenExpired
	}
	return true, nil
}

func (r *AuthRepository) GetActiveRefreshTokensByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.RefreshToken, error) {
	var tokens []*domain.RefreshToken
	if err := r.db.WithContext(ctx).Where("user_id = ? AND revoked = false AND expires_at > ?", userID, time.Now()).Order("created_at DESC").Find(&tokens).Error; err != nil {
		return nil, err
	}
	return tokens, nil
}

func (r *AuthRepository) GetUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}

func (r *AuthRepository) GetActiveUserTokenCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked = false AND expires_at > ?", userID, time.Now()).Count(&count).Error
	return count, err
}

func (r *AuthRepository) RevokeRefreshToken(ctx context.Context, tokenID string) error {
	id, err := uuid.Parse(tokenID)
	if err != nil {
		return err
	}
	now := time.Now()
	result := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("id = ?", id).Updates(map[string]any{"revoked": true, "revoked_at": &now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) RevokeRefreshTokenByToken(ctx context.Context, token string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("token = ?", token).Updates(map[string]any{"revoked": true, "revoked_at": &now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) RevokeAllRefreshTokensForUser(ctx context.Context, userID uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked = false", userID).Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

func (r *AuthRepository) RevokeOldestTokensForUser(ctx context.Context, userID uuid.UUID, keepCount int) error {
	var tokens []*domain.RefreshToken
	if err := r.db.WithContext(ctx).Where("user_id = ? AND revoked = false", userID).Order("created_at DESC").Find(&tokens).Error; err != nil {
		return err
	}
	if len(tokens) <= keepCount {
		return nil
	}
	ids := make([]uint, 0, len(tokens)-keepCount)
	for _, token := range tokens[keepCount:] {
		ids = append(ids, token.ID)
	}
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("id IN ?", ids).Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

func (r *AuthRepository) DeleteExpiredRefreshTokens(ctx context.Context) error {
	return r.db.WithContext(ctx).Where("expires_at < ?", time.Now()).Delete(&domain.RefreshToken{}).Error
}

func (r *AuthRepository) DeleteRevokedRefreshTokens(ctx context.Context, olderThan time.Time) error {
	return r.db.WithContext(ctx).Where("revoked = true AND revoked_at < ?", olderThan).Delete(&domain.RefreshToken{}).Error
}

func (r *AuthRepository) CleanupUserTokens(ctx context.Context, userID uuid.UUID, maxTokens int) error {
	count, err := r.GetActiveUserTokenCount(ctx, userID)
	if err != nil || count <= int64(maxTokens) {
		return err
	}
	return r.RevokeOldestTokensForUser(ctx, userID, maxTokens)
}

func (r *AuthRepository) UpdateLastUsedAt(ctx context.Context, tokenID string) error {
	id, err := uuid.Parse(tokenID)
	if err != nil {
		return err
	}
	result := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("id = ?", id).Update("updated_at", time.Now())
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrRefreshTokenNotFound
	}
	return nil
}

func (r *AuthRepository) GetTokenUsageStats(ctx context.Context, userID uuid.UUID) (*repository.TokenUsageStats, error) {
	stats := &repository.TokenUsageStats{}
	now := time.Now()
	if err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ?", userID).Count(&stats.TotalTokens).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked = false AND expires_at > ?", userID, now).Count(&stats.ActiveTokens).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked = true", userID).Count(&stats.RevokedTokens).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked = false AND expires_at <= ?", userID, now).Count(&stats.ExpiredTokens).Error; err != nil {
		return nil, err
	}
	var lastUpdated time.Time
	if err := r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("user_id = ?", userID).Select("MAX(updated_at)").Scan(&lastUpdated).Error; err == nil && !lastUpdated.IsZero() {
		stats.LastUsedAt = &lastUpdated
	}
	return stats, nil
}

func (r *AuthRepository) SaveRefreshTokens(ctx context.Context, tokens []*domain.RefreshToken) error {
	if len(tokens) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).CreateInBatches(tokens, 100).Error
}

func (r *AuthRepository) RevokeRefreshTokens(ctx context.Context, tokenIDs []string) error {
	if len(tokenIDs) == 0 {
		return nil
	}
	ids := make([]uuid.UUID, 0, len(tokenIDs))
	for _, raw := range tokenIDs {
		id, err := uuid.Parse(raw)
		if err != nil {
			return err
		}
		ids = append(ids, id)
	}
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.RefreshToken{}).Where("id IN ?", ids).Updates(map[string]any{"revoked": true, "revoked_at": &now}).Error
}

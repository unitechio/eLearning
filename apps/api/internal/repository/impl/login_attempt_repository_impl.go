package impl

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type LoginAttemptRepository struct {
	db *gorm.DB
}

func NewLoginAttemptRepository(db *gorm.DB) *LoginAttemptRepository {
	return &LoginAttemptRepository{db: db}
}

func (r *LoginAttemptRepository) Create(ctx context.Context, attempt *model.LoginAttempt) error {
	return r.db.WithContext(ctx).Create(attempt).Error
}

func (r *LoginAttemptRepository) GetRecentAttempts(ctx context.Context, username, ipAddress string, duration time.Duration) ([]*model.LoginAttempt, error) {
	var attempts []*model.LoginAttempt
	since := time.Now().Add(-duration)

	err := r.db.WithContext(ctx).
		Where("username = ? AND ip_address = ? AND created_at > ?", username, ipAddress, since).
		Order("created_at DESC").
		Find(&attempts).Error

	if err != nil {
		return nil, err
	}

	return attempts, nil
}

func (r *LoginAttemptRepository) GetFailedAttempts(ctx context.Context, username, ipAddress string, duration time.Duration) (int64, error) {
	var count int64
	since := time.Now().Add(-duration)

	err := r.db.WithContext(ctx).
		Model(&model.LoginAttempt{}).
		Where("username = ? AND ip_address = ? AND success = false AND created_at > ?", username, ipAddress, since).
		Count(&count).Error

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *LoginAttemptRepository) DeleteOlderThan(ctx context.Context, duration time.Duration) error {
	cutoff := time.Now().Add(-duration)
	return r.db.WithContext(ctx).
		Where("created_at < ?", cutoff).
		Delete(&model.LoginAttempt{}).Error
}

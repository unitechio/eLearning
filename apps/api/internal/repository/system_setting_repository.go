package repository

import (
	"context"
	"errors"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

var ErrSystemSettingNotFound = errors.New("system setting not found")

type SystemSettingRepository interface {
	Create(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error)
	GetByKey(ctx context.Context, key string) (*domain.SystemSetting, error)
	GetAll(ctx context.Context) ([]*domain.SystemSetting, error)
	GetByCategory(ctx context.Context, category string) ([]*domain.SystemSetting, error)
	Update(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error)
	Delete(ctx context.Context, id string) error
}

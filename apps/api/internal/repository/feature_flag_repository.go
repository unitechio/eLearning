package repository

import "github.com/unitechio/eLearning/apps/api/internal/domain"

type FeatureFlagRepository interface {
	Create(flag *domain.FeatureFlag) (*domain.FeatureFlag, error)
	GetByName(name string) (*domain.FeatureFlag, error)
	GetByKey(key string) (*domain.FeatureFlag, error)
	GetAll() ([]*domain.FeatureFlag, error)
	GetByCategory(category string) ([]*domain.FeatureFlag, error)
	GetByTier(tier domain.LicenseTier) ([]*domain.FeatureFlag, error)
	Update(flag *domain.FeatureFlag) (*domain.FeatureFlag, error)
	Delete(id string) error
}

package usecase

import "github.com/unitechio/eLearning/apps/api/internal/domain"

type FeatureFlagUsecase interface {
	CreateFeatureFlag(flag *domain.FeatureFlag) (*domain.FeatureFlag, error)
	GetFeatureFlagByName(name string) (*domain.FeatureFlag, error)
	GetFeatureFlagByKey(key string) (*domain.FeatureFlag, error)
	GetAllFeatureFlags() ([]*domain.FeatureFlag, error)
	GetFeatureFlagsByCategory(category string) ([]*domain.FeatureFlag, error)
	GetFeatureFlagsByTier(tier domain.LicenseTier) ([]*domain.FeatureFlag, error)
	UpdateFeatureFlag(flag *domain.FeatureFlag) (*domain.FeatureFlag, error)
	DeleteFeatureFlag(id string) error
	EnableFeature(name string) (*domain.FeatureFlag, error)
	DisableFeature(name string) (*domain.FeatureFlag, error)
	IsFeatureEnabled(name string) (bool, error)
	IsFeatureAvailableForTier(key string, tier domain.LicenseTier) (bool, error)
}

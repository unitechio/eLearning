package impl

import (
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type FeatureFlagUsecase struct {
	repo repository.FeatureFlagRepository
}

func NewFeatureFlagUsecase(repo repository.FeatureFlagRepository) *FeatureFlagUsecase {
	return &FeatureFlagUsecase{repo: repo}
}
func (uc *FeatureFlagUsecase) CreateFeatureFlag(flag *domain.FeatureFlag) (*domain.FeatureFlag, error) {
	return uc.repo.Create(flag)
}
func (uc *FeatureFlagUsecase) GetFeatureFlagByName(name string) (*domain.FeatureFlag, error) {
	return uc.repo.GetByName(name)
}
func (uc *FeatureFlagUsecase) GetFeatureFlagByKey(key string) (*domain.FeatureFlag, error) {
	return uc.repo.GetByKey(key)
}
func (uc *FeatureFlagUsecase) GetAllFeatureFlags() ([]*domain.FeatureFlag, error) {
	return uc.repo.GetAll()
}

// GetFeatureFlagsByCategory retrieves all feature flags of a specific category.
func (uc *FeatureFlagUsecase) GetFeatureFlagsByCategory(category string) ([]*domain.FeatureFlag, error) {
	return uc.repo.GetByCategory(category)
}

// GetFeatureFlagsByTier retrieves all features available for a specific license tier.
func (uc *FeatureFlagUsecase) GetFeatureFlagsByTier(tier domain.LicenseTier) ([]*domain.FeatureFlag, error) {
	return uc.repo.GetByTier(tier)
}

// UpdateFeatureFlag updates an existing feature flag.
func (uc *FeatureFlagUsecase) UpdateFeatureFlag(flag *domain.FeatureFlag) (*domain.FeatureFlag, error) {
	return uc.repo.Update(flag)
}

// DeleteFeatureFlag deletes a feature flag by its ID.
func (uc *FeatureFlagUsecase) DeleteFeatureFlag(id string) error {
	return uc.repo.Delete(id)
}

// EnableFeature enables a feature flag.
func (uc *FeatureFlagUsecase) EnableFeature(name string) (*domain.FeatureFlag, error) {
	flag, err := uc.repo.GetByName(name)
	if err != nil {
		return nil, err
	}
	flag.Enabled = true
	return uc.repo.Update(flag)
}

// DisableFeature disables a feature flag.
func (uc *FeatureFlagUsecase) DisableFeature(name string) (*domain.FeatureFlag, error) {
	flag, err := uc.repo.GetByName(name)
	if err != nil {
		return nil, err
	}
	flag.Enabled = false
	return uc.repo.Update(flag)
}

// IsFeatureEnabled checks if a feature is enabled globally.
func (uc *FeatureFlagUsecase) IsFeatureEnabled(name string) (bool, error) {
	flag, err := uc.repo.GetByName(name)
	if err != nil {
		return false, err
	}
	return flag.Enabled, nil
}

// IsFeatureAvailableForTier checks if a feature is available for a specific license tier.
func (uc *FeatureFlagUsecase) IsFeatureAvailableForTier(key string, tier domain.LicenseTier) (bool, error) {
	flag, err := uc.repo.GetByKey(key)
	if err != nil {
		return false, err
	}

	if !flag.Enabled {
		return false, nil
	}

	return flag.IsAvailableForTier(tier), nil
}

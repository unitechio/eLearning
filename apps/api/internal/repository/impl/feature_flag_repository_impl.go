package impl

import (
	"github.com/google/uuid"
	"gorm.io/gorm"

)

type FeatureFlagRepository struct {
	DB *gorm.DB
}

func NewFeatureFlagRepository(db *gorm.DB) *FeatureFlagRepository {
	return &FeatureFlagRepository{DB: db}
}

func (r *FeatureFlagRepository) Create(flag *model.FeatureFlag) (*model.FeatureFlag, error) {
	flag.ID = uuid.New().String()
	if err := r.DB.Create(flag).Error; err != nil {
		return nil, err
	}
	return flag, nil
}

func (r *FeatureFlagRepository) GetByName(name string) (*model.FeatureFlag, error) {
	var flag model.FeatureFlag
	if err := r.DB.Where("name = ?", name).First(&flag).Error; err != nil {
		return nil, err
	}
	return &flag, nil
}

func (r *FeatureFlagRepository) GetByKey(key string) (*model.FeatureFlag, error) {
	var flag model.FeatureFlag
	if err := r.DB.Where("key = ?", key).First(&flag).Error; err != nil {
		return nil, err
	}
	return &flag, nil
}

func (r *FeatureFlagRepository) GetAll() ([]*model.FeatureFlag, error) {
	var flags []*model.FeatureFlag
	if err := r.DB.Find(&flags).Error; err != nil {
		return nil, err
	}
	return flags, nil
}

func (r *FeatureFlagRepository) GetByCategory(category string) ([]*model.FeatureFlag, error) {
	var flags []*model.FeatureFlag
	if err := r.DB.Where("category = ?", category).Find(&flags).Error; err != nil {
		return nil, err
	}
	return flags, nil
}

// GetByTier retrieves all features available for a specific license tier
func (r *FeatureFlagRepository) GetByTier(tier model.LicenseTier) ([]*model.FeatureFlag, error) {
	var flags []*model.FeatureFlag

	// Tier hierarchy: Free < Pro < Enterprise < Custom
	tierOrder := map[model.LicenseTier]int{
		model.TierFree:       1,
		model.TierPro:        2,
		model.TierEnterprise: 3,
		model.TierCustom:     4,
	}

	currentTierLevel := tierOrder[tier]

	// Get all features where required_tier <= current tier
	query := r.DB.Where("enabled = ?", true)

	var validTiers []string
	for t, level := range tierOrder {
		if level <= currentTierLevel {
			validTiers = append(validTiers, string(t))
		}
	}

	query = query.Where("required_tier IN ?", validTiers)

	if err := query.Find(&flags).Error; err != nil {
		return nil, err
	}
	return flags, nil
}

func (r *FeatureFlagRepository) Update(flag *model.FeatureFlag) (*model.FeatureFlag, error) {
	if err := r.DB.Save(flag).Error; err != nil {
		return nil, err
	}
	return flag, nil
}

func (r *FeatureFlagRepository) Delete(id string) error {
	return r.DB.Delete(&model.FeatureFlag{}, "id = ?", id).Error
}

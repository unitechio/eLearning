package impl

import (
	"context"
	"errors"
	"strconv"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type SystemSettingRepository struct {
	db *gorm.DB
}

func NewSystemSettingRepository(db *gorm.DB) *SystemSettingRepository {
	return &SystemSettingRepository{db: db}
}

func (r *SystemSettingRepository) Create(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error) {
	var existing domain.SystemSetting
	if err := r.db.WithContext(ctx).Where("key = ?", setting.Key).First(&existing).Error; err == nil {
		return nil, errors.New("system setting with this key already exists")
	}
	if err := r.db.WithContext(ctx).Create(setting).Error; err != nil {
		return nil, err
	}
	return setting, nil
}

func (r *SystemSettingRepository) GetByKey(ctx context.Context, key string) (*domain.SystemSetting, error) {
	var setting domain.SystemSetting
	if err := r.db.WithContext(ctx).Where("key = ?", key).First(&setting).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, repository.ErrSystemSettingNotFound
		}
		return nil, err
	}
	return &setting, nil
}

func (r *SystemSettingRepository) GetAll(ctx context.Context) ([]*domain.SystemSetting, error) {
	var settings []*domain.SystemSetting
	if err := r.db.WithContext(ctx).Order("category, key").Find(&settings).Error; err != nil {
		return nil, err
	}
	return settings, nil
}

func (r *SystemSettingRepository) GetByCategory(ctx context.Context, category string) ([]*domain.SystemSetting, error) {
	var settings []*domain.SystemSetting
	if err := r.db.WithContext(ctx).Where("category = ?", category).Order("key").Find(&settings).Error; err != nil {
		return nil, err
	}
	return settings, nil
}

func (r *SystemSettingRepository) Update(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error) {
	var existing domain.SystemSetting
	if err := r.db.WithContext(ctx).First(&existing, setting.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, repository.ErrSystemSettingNotFound
		}
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&existing).Updates(map[string]any{
		"value":       setting.Value,
		"type":        setting.Type,
		"category":    setting.Category,
		"description": setting.Description,
		"is_public":   setting.IsPublic,
		"is_editable": setting.IsEditable,
	}).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).First(&existing, setting.ID).Error; err != nil {
		return nil, err
	}
	return &existing, nil
}

func (r *SystemSettingRepository) Delete(ctx context.Context, id string) error {
	settingID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}
	result := r.db.WithContext(ctx).Delete(&domain.SystemSetting{}, uint(settingID))
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return repository.ErrSystemSettingNotFound
	}
	return nil
}

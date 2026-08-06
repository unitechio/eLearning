package impl

import (
	"context"
	"errors"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type LicenseRepository struct {
	db *gorm.DB
}

// NewLicenseRepository creates a new instance of LicenseRepository
func NewLicenseRepository(db *gorm.DB) repository.LicenseRepository {
	return &LicenseRepository{db: db}
}

// Create creates a new license
func (r *LicenseRepository) Create(ctx context.Context, license *domain.License) (*domain.License, error) {
	if err := r.db.WithContext(ctx).Create(license).Error; err != nil {
		return nil, err
	}
	return license, nil
}

// GetByID retrieves a license by its ID
func (r *LicenseRepository) GetByID(ctx context.Context, id string) (*domain.License, error) {
	var license domain.License
	if err := r.db.WithContext(ctx).Where("id = ? AND deleted_at IS NULL", id).First(&license).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("license not found")
		}
		return nil, err
	}
	return &license, nil
}

// GetByKey retrieves a license by its license key
func (r *LicenseRepository) GetByKey(ctx context.Context, key string) (*domain.License, error) {
	var license domain.License
	if err := r.db.WithContext(ctx).Where("license_key = ? AND deleted_at IS NULL", key).First(&license).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("license not found")
		}
		return nil, err
	}
	return &license, nil
}

// GetByOrganization retrieves a license by organization ID
func (r *LicenseRepository) GetByOrganization(ctx context.Context, orgID string) (*domain.License, error) {
	var license domain.License
	if err := r.db.WithContext(ctx).Where("organization_id = ? AND deleted_at IS NULL", orgID).First(&license).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("license not found")
		}
		return nil, err
	}
	return &license, nil
}

// GetAll retrieves all licenses
func (r *LicenseRepository) GetAll(ctx context.Context) ([]*domain.License, error) {
	var licenses []*domain.License
	if err := r.db.WithContext(ctx).Where("deleted_at IS NULL").Order("created_at DESC").Find(&licenses).Error; err != nil {
		return nil, err
	}
	return licenses, nil
}

// GetByTier retrieves all licenses of a specific tier
func (r *LicenseRepository) GetByTier(ctx context.Context, tier domain.LicenseTier) ([]*domain.License, error) {
	var licenses []*domain.License
	if err := r.db.WithContext(ctx).Where("tier = ? AND deleted_at IS NULL", tier).Order("created_at DESC").Find(&licenses).Error; err != nil {
		return nil, err
	}
	return licenses, nil
}

// GetByStatus retrieves all licenses with a specific status
func (r *LicenseRepository) GetByStatus(ctx context.Context, status domain.LicenseStatus) ([]*domain.License, error) {
	var licenses []*domain.License
	if err := r.db.WithContext(ctx).Where("status = ? AND deleted_at IS NULL", status).Order("created_at DESC").Find(&licenses).Error; err != nil {
		return nil, err
	}
	return licenses, nil
}

// Update updates an existing license
func (r *LicenseRepository) Update(ctx context.Context, license *domain.License) (*domain.License, error) {
	if err := r.db.WithContext(ctx).Save(license).Error; err != nil {
		return nil, err
	}
	return license, nil
}

// Delete soft deletes a license
func (r *LicenseRepository) Delete(ctx context.Context, id string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).Model(&domain.License{}).Where("id = ?", id).Update("deleted_at", now)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("license not found")
	}
	return nil
}

// LogUsage logs a usage event for a license
func (r *LicenseRepository) LogUsage(ctx context.Context, log *domain.LicenseUsageLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

// GetUsageStats retrieves usage statistics for a license within a time range
func (r *LicenseRepository) GetUsageStats(ctx context.Context, licenseID string, from, to time.Time) ([]*domain.LicenseUsageLog, error) {
	var logs []*domain.LicenseUsageLog
	if err := r.db.WithContext(ctx).Where("license_id = ? AND recorded_at BETWEEN ? AND ?", licenseID, from, to).
		Order("recorded_at DESC").
		Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

// ResetMonthlyUsage resets the monthly usage counters for a license
func (r *LicenseRepository) ResetMonthlyUsage(ctx context.Context, licenseID string) error {
	return r.db.WithContext(ctx).Model(&domain.License{}).
		Where("id = ?", licenseID).
		Updates(map[string]interface{}{
			"current_api_calls": 0,
			"current_users":     0,
		}).Error
}

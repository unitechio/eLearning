package repository

import (
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LicenseRepository interface {
	Create(license *domain.License) (*domain.License, error)
	GetByID(id string) (*domain.License, error)
	GetByKey(key string) (*domain.License, error)
	GetByOrganization(orgID string) (*domain.License, error)
	GetAll() ([]*domain.License, error)
	GetByTier(tier domain.LicenseTier) ([]*domain.License, error)
	GetByStatus(status domain.LicenseStatus) ([]*domain.License, error)
	Update(license *domain.License) (*domain.License, error)
	Delete(id string) error
	LogUsage(log *domain.LicenseUsageLog) error
	GetUsageStats(licenseID string, from, to time.Time) ([]*domain.LicenseUsageLog, error)
	ResetMonthlyUsage(licenseID string) error
}

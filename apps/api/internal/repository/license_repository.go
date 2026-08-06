package repository

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LicenseRepository interface {
	Create(ctx context.Context, license *domain.License) (*domain.License, error)
	GetByID(ctx context.Context, id string) (*domain.License, error)
	GetByKey(ctx context.Context, key string) (*domain.License, error)
	GetByOrganization(ctx context.Context, orgID string) (*domain.License, error)
	GetAll(ctx context.Context) ([]*domain.License, error)
	GetByTier(ctx context.Context, tier domain.LicenseTier) ([]*domain.License, error)
	GetByStatus(ctx context.Context, status domain.LicenseStatus) ([]*domain.License, error)
	Update(ctx context.Context, license *domain.License) (*domain.License, error)
	Delete(ctx context.Context, id string) error
	LogUsage(ctx context.Context, log *domain.LicenseUsageLog) error
	GetUsageStats(ctx context.Context, licenseID string, from, to time.Time) ([]*domain.LicenseUsageLog, error)
	ResetMonthlyUsage(ctx context.Context, licenseID string) error
}

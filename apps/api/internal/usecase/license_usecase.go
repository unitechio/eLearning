package usecase

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LicenseUsecase interface {
	// License CRUD
	CreateLicense(ctx context.Context, tier domain.LicenseTier, orgID, orgName, contactEmail string, duration *time.Duration) (*domain.License, error)
	GetLicenseByID(ctx context.Context, id string) (*domain.License, error)
	GetLicenseByKey(ctx context.Context, key string) (*domain.License, error)
	GetLicenseByOrganization(ctx context.Context, orgID string) (*domain.License, error)
	GetAllLicenses(ctx context.Context) ([]*domain.License, error)
	UpdateLicense(ctx context.Context, license *domain.License) (*domain.License, error)
	DeleteLicense(ctx context.Context, id string) error

	// License Activation & Validation
	ActivateLicense(ctx context.Context, req *domain.LicenseActivationRequest) (*domain.LicenseValidationResponse, error)
	ValidateLicense(ctx context.Context, licenseKey string) (*domain.LicenseValidationResponse, error)
	CheckLicenseExpiry(ctx context.Context, licenseKey string) (bool, int, error) // isExpired, daysLeft, error

	// Usage Tracking
	TrackAPICall(ctx context.Context, licenseKey string) error
	TrackUserLogin(ctx context.Context, licenseKey string, userID string) error
	TrackStorageUsage(ctx context.Context, licenseKey string, sizeInGB int) error
	GetUsageStatistics(ctx context.Context, licenseKey string) (*domain.LicenseLimits, error)
	ResetMonthlyUsage(ctx context.Context, licenseKey string) error

	// Tier Management
	UpgradeLicense(ctx context.Context, licenseKey string, newTier domain.LicenseTier) (*domain.License, error)
	DowngradeLicense(ctx context.Context, licenseKey string, newTier domain.LicenseTier) (*domain.License, error)

	// Status Management
	SuspendLicense(ctx context.Context, licenseKey string, reason string) error
	RevokeLicense(ctx context.Context, licenseKey string, reason string) error
	ReactivateLicense(ctx context.Context, licenseKey string) error
}

package service

import (
	"einfra/api/internal/domain"
	"time"
)

type LicenseUsecase interface {
	// License CRUD
	CreateLicense(tier domain.LicenseTier, orgID, orgName, contactEmail string, duration *time.Duration) (*domain.License, error)
	GetLicenseByID(id string) (*domain.License, error)
	GetLicenseByKey(key string) (*domain.License, error)
	GetLicenseByOrganization(orgID string) (*domain.License, error)
	GetAllLicenses() ([]*domain.License, error)
	UpdateLicense(license *domain.License) (*domain.License, error)
	DeleteLicense(id string) error

	// License Activation & Validation
	ActivateLicense(req *domain.LicenseActivationRequest) (*domain.LicenseValidationResponse, error)
	ValidateLicense(licenseKey string) (*domain.LicenseValidationResponse, error)
	CheckLicenseExpiry(licenseKey string) (bool, int, error) // isExpired, daysLeft, error

	// Usage Tracking
	TrackAPICall(licenseKey string) error
	TrackUserLogin(licenseKey string, userID string) error
	TrackStorageUsage(licenseKey string, sizeInGB int) error
	GetUsageStatistics(licenseKey string) (*domain.LicenseLimits, error)
	ResetMonthlyUsage(licenseKey string) error

	// Tier Management
	UpgradeLicense(licenseKey string, newTier domain.LicenseTier) (*domain.License, error)
	DowngradeLicense(licenseKey string, newTier domain.LicenseTier) (*domain.License, error)

	// Status Management
	SuspendLicense(licenseKey string, reason string) error
	RevokeLicense(licenseKey string, reason string) error
	ReactivateLicense(licenseKey string) error
}

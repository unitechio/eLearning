package impl

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type LicenseUsecase struct {
	repo repository.LicenseRepository
}

// NewLicenseUsecase creates a new instance of LicenseUsecase
func NewLicenseUsecase(repo repository.LicenseRepository) *LicenseUsecase {
	return &LicenseUsecase{repo: repo}
}

// CreateLicense creates a new license with the specified tier
func (u *LicenseUsecase) CreateLicense(ctx context.Context, tier domain.LicenseTier, orgID, orgName, contactEmail string, duration *time.Duration) (*domain.License, error) {
	// Generate license key
	licenseKey, err := domain.GenerateLicenseKey()
	if err != nil {
		return nil, fmt.Errorf("failed to generate license key: %w", err)
	}

	// Get tier limits
	maxUsers, maxAPICalls, maxStorage := domain.GetTierLimits(tier)

	// Calculate expiry
	var expiresAt *time.Time
	if duration != nil {
		expiry := time.Now().Add(*duration)
		expiresAt = &expiry
	}

	var organizationID *uuid.UUID
	if orgID != "" {
		parsedID, err := uuid.Parse(orgID)
		if err != nil {
			return nil, fmt.Errorf("invalid organization id: %w", err)
		}
		organizationID = &parsedID
	}
	var organizationName *string
	if orgName != "" {
		organizationName = &orgName
	}
	var email *string
	if contactEmail != "" {
		email = &contactEmail
	}

	license := &domain.License{
		LicenseKey:       licenseKey,
		Tier:             string(tier),
		Status:           string(domain.LicenseStatusActive),
		OrganizationID:   organizationID,
		OrganizationName: organizationName,
		ContactEmail:     email,
		MaxUsers:         maxUsers,
		MaxAPICalls:      maxAPICalls,
		MaxStorage:       maxStorage,
		IssuedAt:         time.Now(),
		ExpiresAt:        expiresAt,
	}

	return u.repo.Create(ctx, license)
}

// GetLicenseByID retrieves a license by ID
func (u *LicenseUsecase) GetLicenseByID(ctx context.Context, id string) (*domain.License, error) {
	return u.repo.GetByID(ctx, id)
}

// GetLicenseByKey retrieves a license by license key
func (u *LicenseUsecase) GetLicenseByKey(ctx context.Context, key string) (*domain.License, error) {
	return u.repo.GetByKey(ctx, key)
}

// GetLicenseByOrganization retrieves a license by organization ID
func (u *LicenseUsecase) GetLicenseByOrganization(ctx context.Context, orgID string) (*domain.License, error) {
	return u.repo.GetByOrganization(ctx, orgID)
}

// GetAllLicenses retrieves all licenses
func (u *LicenseUsecase) GetAllLicenses(ctx context.Context) ([]*domain.License, error) {
	return u.repo.GetAll(ctx)
}

// UpdateLicense updates an existing license
func (u *LicenseUsecase) UpdateLicense(ctx context.Context, license *domain.License) (*domain.License, error) {
	return u.repo.Update(ctx, license)
}

// DeleteLicense deletes a license
func (u *LicenseUsecase) DeleteLicense(ctx context.Context, id string) error {
	return u.repo.Delete(ctx, id)
}

// ActivateLicense activates a license for an organization
func (u *LicenseUsecase) ActivateLicense(ctx context.Context, req *domain.LicenseActivationRequest) (*domain.LicenseValidationResponse, error) {
	// Get license by key
	license, err := u.repo.GetByKey(ctx, req.LicenseKey)
	if err != nil {
		return &domain.LicenseValidationResponse{
			Valid:   false,
			Message: "Invalid license key",
		}, err
	}

	// Check if already activated
	if license.ActivatedAt != nil {
		return &domain.LicenseValidationResponse{
			Valid:   false,
			Message: "License already activated",
		}, errors.New("license already activated")
	}

	// Activate license
	now := time.Now()
	license.ActivatedAt = &now
	license.OrganizationID = req.OrganizationID
	license.OrganizationName = req.OrganizationName
	license.ContactEmail = req.ContactEmail

	license, err = u.repo.Update(ctx, license)
	if err != nil {
		return nil, err
	}

	return u.buildValidationResponse(license), nil
}

// ValidateLicense validates a license key
func (u *LicenseUsecase) ValidateLicense(ctx context.Context, licenseKey string) (*domain.LicenseValidationResponse, error) {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return &domain.LicenseValidationResponse{
			Valid:   false,
			Message: "Invalid license key",
		}, err
	}

	return u.buildValidationResponse(license), nil
}

// CheckLicenseExpiry checks if a license is expired and returns days left
func (u *LicenseUsecase) CheckLicenseExpiry(ctx context.Context, licenseKey string) (bool, int, error) {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return true, 0, err
	}

	if license.ExpiresAt == nil {
		return false, -1, nil // Perpetual license
	}

	daysLeft := int(time.Until(*license.ExpiresAt).Hours() / 24)
	isExpired := license.IsExpired()

	return isExpired, daysLeft, nil
}

// TrackAPICall increments the API call counter
func (u *LicenseUsecase) TrackAPICall(ctx context.Context, licenseKey string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	// Check if limit exceeded
	if !license.CanMakeAPICall() {
		return errors.New("API call limit exceeded")
	}

	// Increment counter
	license.CurrentAPICalls++
	_, err = u.repo.Update(ctx, license)
	if err != nil {
		return err
	}

	// Log usage
	return u.repo.LogUsage(ctx, &domain.LicenseUsageLog{
		LicenseID:  license.ID,
		UsageType:  "api_call",
		Count:      1,
		RecordedAt: time.Now(),
	})
}

// TrackUserLogin tracks a user login event
func (u *LicenseUsecase) TrackUserLogin(ctx context.Context, licenseKey string, userID string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	// Log usage
	metadata, _ := json.Marshal(map[string]string{"user_id": userID})
	return u.repo.LogUsage(ctx, &domain.LicenseUsageLog{
		LicenseID:  license.ID,
		UsageType:  "user_login",
		Count:      1,
		Metadata:   metadata,
		RecordedAt: time.Now(),
	})
}

// TrackStorageUsage updates storage usage
func (u *LicenseUsecase) TrackStorageUsage(ctx context.Context, licenseKey string, sizeInGB int) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	license.CurrentStorage = sizeInGB
	_, err = u.repo.Update(ctx, license)
	return err
}

// GetUsageStatistics retrieves current usage statistics
func (u *LicenseUsecase) GetUsageStatistics(ctx context.Context, licenseKey string) (*domain.LicenseLimits, error) {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return nil, err
	}

	return &domain.LicenseLimits{
		MaxUsers:        license.MaxUsers,
		CurrentUsers:    license.CurrentUsers,
		MaxAPICalls:     license.MaxAPICalls,
		CurrentAPICalls: license.CurrentAPICalls,
		MaxStorage:      license.MaxStorage,
		CurrentStorage:  license.CurrentStorage,
	}, nil
}

// ResetMonthlyUsage resets monthly usage counters
func (u *LicenseUsecase) ResetMonthlyUsage(ctx context.Context, licenseKey string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	return u.repo.ResetMonthlyUsage(ctx, license.ID.String())
}

// UpgradeLicense upgrades a license to a higher tier
func (u *LicenseUsecase) UpgradeLicense(ctx context.Context, licenseKey string, newTier domain.LicenseTier) (*domain.License, error) {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return nil, err
	}

	// Update tier and limits
	license.Tier = string(newTier)
	maxUsers, maxAPICalls, maxStorage := domain.GetTierLimits(newTier)
	license.MaxUsers = maxUsers
	license.MaxAPICalls = maxAPICalls
	license.MaxStorage = maxStorage

	return u.repo.Update(ctx, license)
}

// DowngradeLicense downgrades a license to a lower tier
func (u *LicenseUsecase) DowngradeLicense(ctx context.Context, licenseKey string, newTier domain.LicenseTier) (*domain.License, error) {
	return u.UpgradeLicense(ctx, licenseKey, newTier) // Same logic
}

// SuspendLicense suspends a license
func (u *LicenseUsecase) SuspendLicense(ctx context.Context, licenseKey string, reason string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	now := time.Now()
	license.Status = string(domain.LicenseStatusSuspended)
	license.SuspendedAt = &now
	license.Notes = &reason

	_, err = u.repo.Update(ctx, license)
	return err
}

// RevokeLicense revokes a license permanently
func (u *LicenseUsecase) RevokeLicense(ctx context.Context, licenseKey string, reason string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	license.Status = string(domain.LicenseStatusRevoked)
	license.Notes = &reason

	_, err = u.repo.Update(ctx, license)
	return err
}

// ReactivateLicense reactivates a suspended license
func (u *LicenseUsecase) ReactivateLicense(ctx context.Context, licenseKey string) error {
	license, err := u.repo.GetByKey(ctx, licenseKey)
	if err != nil {
		return err
	}

	license.Status = string(domain.LicenseStatusActive)
	license.SuspendedAt = nil

	_, err = u.repo.Update(ctx, license)
	return err
}

// buildValidationResponse builds a validation response from a license
func (u *LicenseUsecase) buildValidationResponse(license *domain.License) *domain.LicenseValidationResponse {
	response := &domain.LicenseValidationResponse{
		Valid:     license.IsValid(),
		License:   license,
		Tier:      license.Tier,
		Status:    license.Status,
		ExpiresAt: license.ExpiresAt,
		Limits: domain.LicenseLimits{
			MaxUsers:        license.MaxUsers,
			CurrentUsers:    license.CurrentUsers,
			MaxAPICalls:     license.MaxAPICalls,
			CurrentAPICalls: license.CurrentAPICalls,
			MaxStorage:      license.MaxStorage,
			CurrentStorage:  license.CurrentStorage,
		},
	}

	if license.ExpiresAt != nil {
		daysLeft := int(time.Until(*license.ExpiresAt).Hours() / 24)
		response.DaysLeft = daysLeft

		if license.IsExpired() {
			response.Valid = false
			response.Message = "License has expired"
		} else if daysLeft <= 30 {
			response.Message = fmt.Sprintf("License expires in %d days", daysLeft)
		}
	}

	if license.Status != string(domain.LicenseStatusActive) {
		response.Valid = false
		response.Message = fmt.Sprintf("License is %s", license.Status)
	}

	return response
}

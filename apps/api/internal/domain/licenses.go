package domain

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type LicenseTier string

const (
	LicenseTierFree       LicenseTier = "free"
	LicenseTierStarter    LicenseTier = "starter"
	LicenseTierPro        LicenseTier = "pro"
	LicenseTierEnterprise LicenseTier = "enterprise"
)

type LicenseStatus string

const (
	LicenseStatusActive    LicenseStatus = "active"
	LicenseStatusSuspended LicenseStatus = "suspended"
	LicenseStatusRevoked   LicenseStatus = "revoked"
	LicenseStatusExpired   LicenseStatus = "expired"
)

type License struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	LicenseKey string    `gorm:"type:varchar(512);uniqueIndex;not null" json:"license_key"`
	Tier       string    `gorm:"type:varchar(50);not null;default:free;index:idx_licenses_tier" json:"tier"`
	Status     string    `gorm:"type:varchar(50);not null;default:active;index:idx_licenses_status" json:"status"`

	// Organization Info
	OrganizationID   *uuid.UUID `gorm:"type:uuid;index:idx_licenses_organization" json:"organization_id,omitempty"`
	OrganizationName *string    `gorm:"type:varchar(255)" json:"organization_name,omitempty"`
	ContactEmail     *string    `gorm:"type:varchar(255)" json:"contact_email,omitempty"`

	// License Limits
	MaxUsers    int `gorm:"default:0" json:"max_users"`
	MaxAPICalls int `gorm:"default:0" json:"max_api_calls"`
	MaxStorage  int `gorm:"default:0" json:"max_storage"`

	// Usage Tracking
	CurrentUsers    int `gorm:"default:0" json:"current_users"`
	CurrentAPICalls int `gorm:"default:0" json:"current_api_calls"`
	CurrentStorage  int `gorm:"default:0" json:"current_storage"`

	// Time
	IssuedAt    time.Time  `gorm:"autoCreateTime" json:"issued_at"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
	ActivatedAt *time.Time `json:"activated_at,omitempty"`
	SuspendedAt *time.Time `json:"suspended_at,omitempty"`

	// Metadata
	Metadata json.RawMessage `gorm:"type:jsonb" json:"metadata" swaggertype:"object"`
	Notes    *string         `gorm:"type:text" json:"notes,omitempty"`

	// Audit
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt *time.Time `gorm:"index:idx_licenses_deleted" json:"deleted_at,omitempty"`
}

type LicenseUsageLog struct {
	ID         uuid.UUID       `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	LicenseID  uuid.UUID       `gorm:"type:uuid;not null;index:idx_license_usage_license" json:"license_id"`
	UsageType  string          `gorm:"type:varchar(50);not null;index:idx_license_usage_type" json:"usage_type"`
	Count      int             `gorm:"default:1" json:"count"`
	Metadata   json.RawMessage `gorm:"type:jsonb" json:"metadata" swaggertype:"object"`
	RecordedAt time.Time       `gorm:"autoCreateTime;index:idx_license_usage_recorded" json:"recorded_at"`
}

type LicenseActivationRequest struct {
	LicenseKey       string
	OrganizationID   *uuid.UUID
	OrganizationName *string
	ContactEmail     *string
}

type LicenseLimits struct {
	MaxUsers        int `json:"max_users"`
	CurrentUsers    int `json:"current_users"`
	MaxAPICalls     int `json:"max_api_calls"`
	CurrentAPICalls int `json:"current_api_calls"`
	MaxStorage      int `json:"max_storage"`
	CurrentStorage  int `json:"current_storage"`
}

type LicenseValidationResponse struct {
	Valid     bool          `json:"valid"`
	Message   string        `json:"message"`
	License   *License      `json:"license,omitempty"`
	Tier      string        `json:"tier"`
	Status    string        `json:"status"`
	ExpiresAt *time.Time    `json:"expires_at,omitempty"`
	DaysLeft  int           `json:"days_left"`
	Limits    LicenseLimits `json:"limits"`
}

func GenerateLicenseKey() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return "lic_" + hex.EncodeToString(buf), nil
}

func GetTierLimits(tier LicenseTier) (maxUsers, maxAPICalls, maxStorage int) {
	switch tier {
	case LicenseTierEnterprise:
		return 1000, 1000000, 5000
	case LicenseTierPro:
		return 250, 250000, 1000
	case LicenseTierStarter:
		return 50, 50000, 200
	default:
		return 5, 5000, 10
	}
}

func (l *License) IsExpired() bool {
	return l.ExpiresAt != nil && time.Now().After(*l.ExpiresAt)
}

func (l *License) IsValid() bool {
	return LicenseStatus(l.Status) == LicenseStatusActive && !l.IsExpired()
}

func (l *License) CanMakeAPICall() bool {
	if l.MaxAPICalls <= 0 {
		return true
	}
	return l.CurrentAPICalls < l.MaxAPICalls
}

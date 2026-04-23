package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
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
	Metadata json.RawMessage `gorm:"type:jsonb" json:"metadata"`
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
	Metadata   json.RawMessage `gorm:"type:jsonb" json:"metadata"`
	RecordedAt time.Time       `gorm:"autoCreateTime;index:idx_license_usage_recorded" json:"recorded_at"`
}

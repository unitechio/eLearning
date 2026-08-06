package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// IntegrationStatus defines the connection status of an app integration
type IntegrationStatus string

const (
	IntegrationStatusConnected    IntegrationStatus = "connected"
	IntegrationStatusDisconnected IntegrationStatus = "disconnected"
	IntegrationStatusExpired      IntegrationStatus = "expired"
)

// IntegrationCatalog represents an available integration app in the Marketplace catalog
type IntegrationCatalog struct {
	UUIDModel
	Name            string         `gorm:"type:varchar(100);not null" json:"name"`
	Slug            string         `gorm:"type:varchar(50);not null;uniqueIndex" json:"slug"`
	Provider        string         `gorm:"type:varchar(100);not null" json:"provider"`
	Category        string         `gorm:"type:varchar(50);not null;default:'communication';index" json:"category"`
	Description     string         `gorm:"type:text;not null" json:"description"`
	IconURL         string         `gorm:"type:text;not null" json:"icon_url"`
	Developer       string         `gorm:"type:varchar(100);not null" json:"developer"`
	StepsCount      int            `gorm:"default:4" json:"steps_count"`
	IsPro           bool           `gorm:"default:false" json:"is_pro"`
	IsNew           bool           `gorm:"default:false" json:"is_new"`
	FeaturesJSON    datatypes.JSON `gorm:"type:jsonb;default:'[]'" json:"features"`
	OverviewText    string         `gorm:"type:text" json:"overview_text"`
	HowItWorksText  string         `gorm:"type:text" json:"how_it_works_text"`
}

func (IntegrationCatalog) TableName() string {
	return "integration_catalog"
}

// UserIntegration represents a tenant/user's connected instance of an integration
type UserIntegration struct {
	UUIDModel
	TenantID           uuid.UUID          `gorm:"type:uuid;not null;index:idx_user_integrations_tenant_status" json:"tenant_id"`
	UserID             uuid.UUID          `gorm:"type:uuid;not null" json:"user_id"`
	CatalogID          uuid.UUID          `gorm:"type:uuid;not null;index" json:"catalog_id"`
	Status             IntegrationStatus  `gorm:"type:varchar(30);default:'disconnected';index:idx_user_integrations_tenant_status" json:"status"`
	AccountIdentifier  string             `gorm:"type:varchar(255)" json:"account_identifier"`
	AccountDetailsJSON datatypes.JSON     `gorm:"type:jsonb;default:'{}'" json:"account_details"`
	ErrorMessage       string             `gorm:"type:text" json:"error_message,omitempty"`
	IsEnabled          bool               `gorm:"default:true" json:"is_enabled"`
	ConfigJSON         datatypes.JSON     `gorm:"type:jsonb;default:'{}'" json:"config"`
	LastSyncedAt       *time.Time         `json:"last_synced_at,omitempty"`
	AuthExpiresAt      *time.Time         `json:"auth_expires_at,omitempty"`

	// Relationships
	Catalog *IntegrationCatalog `gorm:"foreignKey:CatalogID" json:"catalog,omitempty"`
}

func (UserIntegration) TableName() string {
	return "user_integrations"
}

// IntegrationLog records sync and webhook events
type IntegrationLog struct {
	UUIDModel
	UserIntegrationID uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_integration_id"`
	TenantID          uuid.UUID      `gorm:"type:uuid;not null" json:"tenant_id"`
	EventType         string         `gorm:"type:varchar(50);not null" json:"event_type"`
	Status            string         `gorm:"type:varchar(30);not null" json:"status"`
	Message           string         `gorm:"type:text" json:"message"`
	PayloadJSON       datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"payload"`
}

func (IntegrationLog) TableName() string {
	return "integration_logs"
}

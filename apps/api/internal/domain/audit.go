package domain

import (
	"time"

	"github.com/google/uuid"
)

// AuditAction represents the type of action performed
type AuditAction string

const (
	AuditActionCreate AuditAction = "create"
	AuditActionRead   AuditAction = "read"
	AuditActionUpdate AuditAction = "update"
	AuditActionDelete AuditAction = "delete"
	AuditActionLogin  AuditAction = "login"
	AuditActionLogout AuditAction = "logout"
	AuditActionExport AuditAction = "export"
	AuditActionImport AuditAction = "import"
)

// AuditLog represents an audit log entry for tracking user actions
type AuditLog struct {
	ID           uint        `gorm:"primarykey" json:"id"`
	UserID       *uuid.UUID  `gorm:"type:uuid;index" json:"user_id,omitempty"`
	Action       AuditAction `gorm:"type:varchar(50);not null;index" json:"action"`
	Resource     string      `gorm:"size:100;not null;index" json:"resource"` // e.g., "users", "posts"
	ResourceID   *string     `gorm:"size:100;index" json:"resource_id,omitempty"`
	Description  string      `gorm:"type:text" json:"description"`
	IPAddress    string      `gorm:"size:45" json:"ip_address"`
	UserAgent    string      `gorm:"size:500" json:"user_agent"`
	Method       string      `gorm:"size:10" json:"method"` // HTTP method
	Path         string      `gorm:"size:500" json:"path"`  // Request path
	StatusCode   int         `json:"status_code"`
	Duration     int64       `json:"duration"`                                 // Request duration in milliseconds
	RequestBody  *string     `gorm:"type:text" json:"request_body,omitempty"`  // Full request body (CLOB)
	ResponseBody *string     `gorm:"type:text" json:"response_body,omitempty"` // Full response body (CLOB)
	OldValues    *string     `gorm:"type:jsonb" json:"old_values,omitempty"`   // JSON of old values (for updates)
	NewValues    *string     `gorm:"type:jsonb" json:"new_values,omitempty"`   // JSON of new values (for updates)
	Metadata     *string     `gorm:"type:jsonb" json:"metadata,omitempty"`     // Additional metadata
	CreatedAt    time.Time   `gorm:"index" json:"created_at"`                  // Start time
	FinishedAt   *time.Time  `gorm:"index" json:"finished_at,omitempty"`       // Finish time

	// Relationships
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type AuditFilter struct {
	Page       int
	PageSize   int
	UserID     *uuid.UUID
	Action     *AuditAction
	Resource   string
	ResourceID *string
	IPAddress  string
	Method     string
	Path       string
	StartDate  *time.Time
	EndDate    *time.Time
	SortBy     string
	SortOrder  string
}

func (f AuditFilter) Normalize() AuditFilter {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 {
		f.PageSize = 20
	}
	if f.PageSize > 100 {
		f.PageSize = 100
	}
	return f
}

type AuditStatistics struct {
	TotalLogs         int64                 `json:"total_logs"`
	SuccessfulActions int64                 `json:"successful_actions"`
	FailedActions     int64                 `json:"failed_actions"`
	UniqueUsers       int64                 `json:"unique_users"`
	ActionBreakdown   map[AuditAction]int64 `json:"action_breakdown"`
	ResourceBreakdown map[string]int64      `json:"resource_breakdown"`
}

// TableName specifies the table name for AuditLog
func (AuditLog) TableName() string {
	return "audit_logs"
}

// SystemSetting represents system-wide configuration settings
type SystemSetting struct {
	BaseModel
	Key         string `gorm:"uniqueIndex;size:200;not null" json:"key"`
	Value       string `gorm:"type:text" json:"value"`
	Type        string `gorm:"size:50;not null" json:"type"` // string, number, boolean, json
	Category    string `gorm:"size:100" json:"category"`
	Description string `gorm:"type:text" json:"description"`
	IsPublic    bool   `gorm:"default:false" json:"is_public"`  // Can be accessed without authentication
	IsEditable  bool   `gorm:"default:true" json:"is_editable"` // Can be edited via UI
}

// TableName specifies the table name for SystemSetting
func (SystemSetting) TableName() string {
	return "system_settings"
}

// ActivityLog represents user activity tracking
type ActivityLog struct {
	BaseModel
	UserID      uuid.UUID `gorm:"type:uuid;index;not null" json:"user_id"`
	Activity    string    `gorm:"size:200;not null" json:"activity"`
	Description string    `gorm:"type:text" json:"description"`
	IPAddress   string    `gorm:"size:45" json:"ip_address"`
	UserAgent   string    `gorm:"size:500" json:"user_agent"`
	Metadata    string    `gorm:"type:jsonb" json:"metadata,omitempty"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for ActivityLog
func (ActivityLog) TableName() string {
	return "activity_logs"
}

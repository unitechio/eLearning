package domain

import (
	"time"

	"github.com/google/uuid"
)

type NotificationType string

const (
	// User-level notifications
	NotificationTypeInfo    NotificationType = "info"
	NotificationTypeSuccess NotificationType = "success"
	NotificationTypeWarning NotificationType = "warning"
	NotificationTypeError   NotificationType = "error"
	// System-wide notifications
	NotificationTypeSystem       NotificationType = "system"
	NotificationTypeAnnouncement NotificationType = "announcement"
	NotificationTypeAlert        NotificationType = "alert"
	NotificationTypeMaintenance  NotificationType = "maintenance"
)

// NotificationPriority represents the priority level of notification
type NotificationPriority string

const (
	NotificationPriorityLow    NotificationPriority = "low"
	NotificationPriorityNormal NotificationPriority = "normal"
	NotificationPriorityHigh   NotificationPriority = "high"
	NotificationPriorityUrgent NotificationPriority = "urgent"
)

// Notification represents a notification entity
type Notification struct {
	ID       uint                 `json:"id" gorm:"primaryKey"`
	UserID   *uuid.UUID           `json:"user_id" gorm:"type:uuid;index"` // nil for broadcast notifications
	Type     NotificationType     `json:"type" gorm:"type:varchar(20);not null;default:'info'"`
	Priority NotificationPriority `json:"priority" gorm:"type:varchar(20);not null;default:'normal'"`
	Category string               `json:"category" gorm:"type:varchar(50);index"` // e.g., "user", "post", "order", "system"
	Title    string               `json:"title" gorm:"type:varchar(255);not null"`
	Message  string               `json:"message" gorm:"type:text;not null"`
	Data     *string              `json:"data,omitempty" gorm:"type:jsonb"` // Additional JSON data

	// Targeting (for system-wide notifications)
	TargetType   string `json:"target_type" gorm:"type:varchar(50);default:'user'"` // "all", "user", "role"
	TargetRoleID *uint  `json:"target_role_id" gorm:"index"`                        // For role-based notifications

	// Read status
	IsRead  bool       `json:"is_read" gorm:"default:false;index"`
	ReadAt  *time.Time `json:"read_at,omitempty"`
	Channel string     `json:"channel" gorm:"type:text;not null;index:idx_notifications_channel" `
	// Display options
	Link          *string `json:"link,omitempty" gorm:"type:varchar(500)"` // Optional action link
	ImageURL      *string `json:"image_url,omitempty" gorm:"type:varchar(500)"`
	Icon          *string `json:"icon,omitempty" gorm:"type:varchar(100)"`        // Icon class/name
	ActionURL     *string `json:"action_url,omitempty" gorm:"type:varchar(500)"`  // Action button URL
	ActionText    *string `json:"action_text,omitempty" gorm:"type:varchar(100)"` // Action button text
	IsDismissible bool    `json:"is_dismissible" gorm:"default:true"`             // Can user dismiss it?

	// Scheduling
	ScheduledAt *time.Time `json:"scheduled_at,omitempty" gorm:"index"` // For scheduled notifications
	ExpiresAt   *time.Time `json:"expires_at,omitempty" gorm:"index"`   // Auto-expire after this

	// Audit
	CreatedBy uuid.UUID  `json:"created_by" gorm:"type:uuid;not null"`
	CreatedAt time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"index"`

	// Relations
	User    *User `json:"user,omitempty" gorm:"foreignKey:UserID;references:ID"`
	Creator *User `json:"creator,omitempty" gorm:"foreignKey:CreatedBy;references:ID"`
}

// TableName specifies the table name for Notification
func (Notification) TableName() string {
	return "notifications"
}

type NotificationPreference struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID           uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"user_id"`
	OrganizationID   uuid.UUID `gorm:"type:uuid;not null;index:idx_notification_preferences_org" json:"organization_id"`
	InAppEnabled     bool      `gorm:"default:true" json:"in_app_enabled"`
	EmailEnabled     bool      `gorm:"default:true" json:"email_enabled"`
	TelegramEnabled  bool      `gorm:"default:false" json:"telegram_enabled"`
	WhatsAppEnabled  bool      `gorm:"default:false" json:"whatsapp_enabled"`
	OnlyHighPriority bool      `gorm:"default:false" json:"only_high_priority"`
	Digest           string    `gorm:"type:text;default:realtime" json:"digest"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt        time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// TableName specifies the table name for Notification
func (NotificationPreference) TableName() string {
	return "NotificationPreference"
}

// IsExpired checks if the notification has expired
func (n *Notification) IsExpired() bool {
	if n.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*n.ExpiresAt)
}

// MarkAsRead marks the notification as read
func (n *Notification) MarkAsRead() {
	now := time.Now()
	n.IsRead = true
	n.ReadAt = &now
}

// MarkAsUnread marks the notification as unread
func (n *Notification) MarkAsUnread() {
	n.IsRead = false
	n.ReadAt = nil
}

// CreateNotificationRequest represents the request to create a notification
type CreateNotificationRequest struct {
	UserID    *uuid.UUID           `json:"user_id,omitempty"` // nil for broadcast
	Type      NotificationType     `json:"type" binding:"required,oneof=info success warning error"`
	Priority  NotificationPriority `json:"priority" binding:"omitempty,oneof=low normal high urgent"`
	Title     string               `json:"title" binding:"required,max=255"`
	Message   string               `json:"message" binding:"required"`
	Data      *string              `json:"data,omitempty"`
	Link      *string              `json:"link,omitempty"`
	ImageURL  *string              `json:"image_url,omitempty"`
	ExpiresAt *time.Time           `json:"expires_at,omitempty"`
}

// UpdateNotificationRequest represents the request to update a notification
type UpdateNotificationRequest struct {
	Type      *NotificationType     `json:"type,omitempty" binding:"omitempty,oneof=info success warning error"`
	Priority  *NotificationPriority `json:"priority,omitempty" binding:"omitempty,oneof=low normal high urgent"`
	Title     *string               `json:"title,omitempty" binding:"omitempty,max=255"`
	Message   *string               `json:"message,omitempty"`
	Data      *string               `json:"data,omitempty"`
	Link      *string               `json:"link,omitempty"`
	ImageURL  *string               `json:"image_url,omitempty"`
	IsRead    *bool                 `json:"is_read,omitempty"`
	ExpiresAt *time.Time            `json:"expires_at,omitempty"`
}

// NotificationFilter represents filters for querying notifications
type NotificationFilter struct {
	UserID   *uuid.UUID            `json:"user_id,omitempty"`
	Type     *NotificationType     `json:"type,omitempty"`
	Priority *NotificationPriority `json:"priority,omitempty"`
	IsRead   *bool                 `json:"is_read,omitempty"`
	FromDate *time.Time            `json:"from_date,omitempty"`
	ToDate   *time.Time            `json:"to_date,omitempty"`
	Channel  *string               `json:"channel,omitempty"`
	IsSent   *string               `json:"is_sent,omitempty"`
	Page     int                   `json:"page,omitempty"`
	PageSize int                   `json:"page_size,omitempty"`
}

// NotificationStats represents notification statistics
type NotificationStats struct {
	Total      int64                          `json:"total"`
	Unread     int64                          `json:"unread"`
	Read       int64                          `json:"read"`
	ByType     map[NotificationType]int64     `json:"by_type"`
	ByPriority map[NotificationPriority]int64 `json:"by_priority"`
}

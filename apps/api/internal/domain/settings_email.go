package domain

import (
	"strings"
	"time"

	"github.com/google/uuid"
)

type UserSettings struct {
	BaseModel
	UserID               uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"user_id"`
	Theme                string    `gorm:"size:20;default:'system'" json:"theme"`
	FontSize             string    `gorm:"size:20;default:'medium'" json:"font_size"`
	FontFamily           string    `gorm:"size:100;default:'Inter'" json:"font_family"`
	CompactMode          bool      `gorm:"default:false" json:"compact_mode"`
	SidebarCollapsed     bool      `gorm:"default:false" json:"sidebar_collapsed"`
	Sidebar              string    `gorm:"type:jsonb;default:'[]'" json:"sidebar"`
	Language             string    `gorm:"size:20;default:'en'" json:"language"`
	Timezone             string    `gorm:"size:100;default:'Asia/Saigon'" json:"timezone"`
	DateFormat           string    `gorm:"size:30;default:'2006-01-02'" json:"date_format"`
	TimeFormat           string    `gorm:"size:20;default:'24h'" json:"time_format"`
	Currency             string    `gorm:"size:10;default:'USD'" json:"currency"`
	NotificationLevel    string    `gorm:"size:20;default:'all'" json:"notification_level"`
	EmailNotifications   bool      `gorm:"default:true" json:"email_notifications"`
	PushNotifications    bool      `gorm:"default:true" json:"push_notifications"`
	DesktopNotifications bool      `gorm:"default:false" json:"desktop_notifications"`
	NotificationSound    bool      `gorm:"default:true" json:"notification_sound"`
	DigestFrequency      string    `gorm:"size:20;default:'daily'" json:"digest_frequency"`
	DefaultDashboard     string    `gorm:"size:50;default:'academy'" json:"default_dashboard"`
	WidgetLayout         string    `gorm:"type:jsonb;default:'[]'" json:"widget_layout"`
	DefaultPageSize      int       `gorm:"default:20" json:"default_page_size"`
	TableDensity         string    `gorm:"size:20;default:'comfortable'" json:"table_density"`
	HighContrast         bool      `gorm:"default:false" json:"high_contrast"`
	ReduceMotion         bool      `gorm:"default:false" json:"reduce_motion"`
	ShowOnlineStatus     bool      `gorm:"default:true" json:"show_online_status"`
	DeveloperMode        bool      `gorm:"default:false" json:"developer_mode"`
	BetaFeatures         bool      `gorm:"default:false" json:"beta_features"`
}

func (UserSettings) TableName() string {
	return "user_settings"
}

type UserSettingsUpdate struct {
	Theme                *string `json:"theme,omitempty"`
	FontSize             *string `json:"font_size,omitempty"`
	FontFamily           *string `json:"font_family,omitempty"`
	CompactMode          *bool   `json:"compact_mode,omitempty"`
	SidebarCollapsed     *bool   `json:"sidebar_collapsed,omitempty"`
	Sidebar              *string `json:"sidebar,omitempty"`
	Language             *string `json:"language,omitempty"`
	Timezone             *string `json:"timezone,omitempty"`
	DateFormat           *string `json:"date_format,omitempty"`
	TimeFormat           *string `json:"time_format,omitempty"`
	Currency             *string `json:"currency,omitempty"`
	NotificationLevel    *string `json:"notification_level,omitempty"`
	EmailNotifications   *bool   `json:"email_notifications,omitempty"`
	PushNotifications    *bool   `json:"push_notifications,omitempty"`
	DesktopNotifications *bool   `json:"desktop_notifications,omitempty"`
	NotificationSound    *bool   `json:"notification_sound,omitempty"`
	DigestFrequency      *string `json:"digest_frequency,omitempty"`
	DefaultDashboard     *string `json:"default_dashboard,omitempty"`
	WidgetLayout         *string `json:"widget_layout,omitempty"`
	DefaultPageSize      *int    `json:"default_page_size,omitempty"`
	TableDensity         *string `json:"table_density,omitempty"`
	HighContrast         *bool   `json:"high_contrast,omitempty"`
	ReduceMotion         *bool   `json:"reduce_motion,omitempty"`
	ShowOnlineStatus     *bool   `json:"show_online_status,omitempty"`
	DeveloperMode        *bool   `json:"developer_mode,omitempty"`
	BetaFeatures         *bool   `json:"beta_features,omitempty"`
}

func GetDefaultSettings(userID string) *UserSettings {
	uid, err := uuid.Parse(userID)
	if err != nil {
		uid = uuid.Nil
	}
	return &UserSettings{
		UserID:             uid,
		Theme:              "system",
		FontSize:           "medium",
		FontFamily:         "Inter",
		Sidebar:            "[]",
		Language:           "en",
		Timezone:           "Asia/Saigon",
		DateFormat:         "2006-01-02",
		TimeFormat:         "24h",
		Currency:           "USD",
		NotificationLevel:  "all",
		EmailNotifications: true,
		PushNotifications:  true,
		NotificationSound:  true,
		DigestFrequency:    "daily",
		DefaultDashboard:   "academy",
		WidgetLayout:       "[]",
		DefaultPageSize:    20,
		TableDensity:       "comfortable",
		ShowOnlineStatus:   true,
	}
}

type EmailStatus string

const (
	EmailStatusPending   EmailStatus = "pending"
	EmailStatusSent      EmailStatus = "sent"
	EmailStatusDelivered EmailStatus = "delivered"
	EmailStatusFailed    EmailStatus = "failed"
	EmailStatusBounced   EmailStatus = "bounced"
)

type EmailPriority string

const (
	EmailPriorityLow    EmailPriority = "low"
	EmailPriorityNormal EmailPriority = "normal"
	EmailPriorityHigh   EmailPriority = "high"
)

type EmailAttachment struct {
	Filename    string `json:"filename"`
	Content     []byte `json:"content"`
	ContentType string `json:"content_type"`
	Inline      bool   `json:"inline"`
	ContentID   string `json:"content_id,omitempty"`
}

type EmailData struct {
	To          []string          `json:"to"`
	CC          []string          `json:"cc,omitempty"`
	BCC         []string          `json:"bcc,omitempty"`
	From        string            `json:"from,omitempty"`
	Subject     string            `json:"subject"`
	Body        string            `json:"body,omitempty"`
	HTMLBody    string            `json:"html_body,omitempty"`
	Template    string            `json:"template,omitempty"`
	Data        map[string]any    `json:"data,omitempty"`
	ReplyTo     string            `json:"reply_to,omitempty"`
	Headers     map[string]string `json:"headers,omitempty"`
	Priority    EmailPriority     `json:"priority,omitempty"`
	Attachments []EmailAttachment `json:"attachments,omitempty"`
}

type EmailLogFilter struct {
	Page     int
	PageSize int
	Status   EmailStatus
	From     string
	To       string
	Template string
	DateFrom *time.Time
	DateTo   *time.Time
}

func (f EmailLogFilter) Normalize() EmailLogFilter {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 {
		f.PageSize = 20
	}
	if f.PageSize > 100 {
		f.PageSize = 100
	}
	f.From = strings.TrimSpace(f.From)
	f.To = strings.TrimSpace(f.To)
	f.Template = strings.TrimSpace(f.Template)
	return f
}

type EmailTemplateFilter struct {
	Page     int
	PageSize int
	Type     *string
	Category *string
	IsActive *bool
}

func (f EmailTemplateFilter) Normalize() EmailTemplateFilter {
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

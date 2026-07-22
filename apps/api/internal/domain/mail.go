package domain

import (
	"strings"
	"time"

	"github.com/google/uuid"
)

type EmailStatus string

const (
	EmailStatusPending   EmailStatus = "pending"
	EmailStatusSending   EmailStatus = "sending"
	EmailStatusSent      EmailStatus = "sent"
	EmailStatusDelivered EmailStatus = "delivered"
	EmailStatusOpened    EmailStatus = "opened"
	EmailStatusClicked   EmailStatus = "clicked"
	EmailStatusFailed    EmailStatus = "failed"
	EmailStatusBounced   EmailStatus = "bounced"
	EmailStatusRejected  EmailStatus = "rejected"
)

type EmailPriority string

const (
	EmailPriorityLow      EmailPriority = "low"
	EmailPriorityNormal   EmailPriority = "normal"
	EmailPriorityHigh     EmailPriority = "high"
	EmailPriorityCritical EmailPriority = "critical"
)

type EmailProvider string

const (
	EmailProviderSMTP     EmailProvider = "smtp"
	EmailProviderSES      EmailProvider = "ses"
	EmailProviderSendGrid EmailProvider = "sendgrid"
	EmailProviderResend   EmailProvider = "resend"
	EmailProviderMailgun  EmailProvider = "mailgun"
)

type EmailAttachment struct {
	Filename    string `json:"filename"`
	Content     []byte `json:"content,omitempty"`
	Path        string `json:"path,omitempty"`
	URL         string `json:"url,omitempty"`
	ContentType string `json:"content_type"`
	Inline      bool   `json:"inline"`
	ContentID   string `json:"content_id,omitempty"`
	Size        int64  `json:"size,omitempty"`
}

type EmailData struct {
	ID       string   `json:"id,omitempty"`
	To       []string `json:"to"`
	CC       []string `json:"cc,omitempty"`
	BCC      []string `json:"bcc,omitempty"`
	From     string   `json:"from,omitempty"`
	ReplyTo  string   `json:"reply_to,omitempty"`
	Subject  string   `json:"subject"`
	TextBody string   `json:"text_body,omitempty"`
	HTMLBody string   `json:"html_body,omitempty"`
	Template string   `json:"template,omitempty"`

	Data           map[string]any    `json:"data,omitempty"`
	Headers        map[string]string `json:"headers,omitempty"`
	Attachments    []EmailAttachment `json:"attachments,omitempty"`
	Priority       EmailPriority     `json:"priority,omitempty"`
	Tags           []string          `json:"tags,omitempty"`
	ScheduleAt     *time.Time        `json:"schedule_at,omitempty"`
	IdempotencyKey string            `json:"idempotency_key,omitempty"`
	TrackOpen      bool              `json:"track_open,omitempty"`
	TrackClick     bool              `json:"track_click,omitempty"`
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

type EmailLog struct {
	BaseModel
	TenantID          *uuid.UUID     `gorm:"type:uuid;index" json:"tenant_id,omitempty"`
	UserID            *uuid.UUID     `gorm:"type:uuid;index" json:"user_id,omitempty"`
	Provider          EmailProvider  `gorm:"size:30;index" json:"provider"`
	ProviderMessageID string         `gorm:"size:255;index" json:"provider_message_id"`
	TemplateID        *uint          `gorm:"index" json:"template_id,omitempty"`
	Template          *EmailTemplate `gorm:"foreignKey:TemplateID" json:"template,omitempty"`
	From              string         `gorm:"size:255" json:"from"`
	ReplyTo           string         `gorm:"size:255" json:"reply_to,omitempty"`
	To                string         `gorm:"type:text" json:"to"`
	CC                string         `gorm:"type:text" json:"cc,omitempty"`
	BCC               string         `gorm:"type:text" json:"bcc,omitempty"`
	Subject           string         `gorm:"size:500" json:"subject"`
	TextBody          string         `gorm:"type:text" json:"text_body,omitempty"`
	HTMLBody          string         `gorm:"type:text" json:"html_body,omitempty"`
	Status            EmailStatus    `gorm:"size:30;index" json:"status"`
	Priority          EmailPriority  `gorm:"size:20" json:"priority"`
	RetryCount        int            `gorm:"default:0" json:"retry_count"`
	MaxRetry          int            `gorm:"default:3" json:"max_retry"`
	LastError         string         `gorm:"type:text" json:"last_error,omitempty"`
	TrackOpen         bool           `gorm:"default:false" json:"track_open"`
	TrackClick        bool           `gorm:"default:false" json:"track_click"`
	OpenCount         int            `gorm:"default:0" json:"open_count"`
	ClickCount        int            `gorm:"default:0" json:"click_count"`
	OpenedAt          *time.Time     `json:"opened_at,omitempty"`
	ClickedAt         *time.Time     `json:"clicked_at,omitempty"`
	DeliveredAt       *time.Time     `json:"delivered_at,omitempty"`
	SentAt            *time.Time     `json:"sent_at,omitempty"`
	Queue             string         `gorm:"size:100" json:"queue,omitempty"`
	Worker            string         `gorm:"size:100" json:"worker,omitempty"`
	ScheduledAt       *time.Time     `json:"scheduled_at,omitempty"`
	StartedAt         *time.Time     `json:"started_at,omitempty"`
	FinishedAt        *time.Time     `json:"finished_at,omitempty"`
	DurationMS        int64          `json:"duration_ms"`
	IdempotencyKey    string         `gorm:"size:255;uniqueIndex" json:"idempotency_key,omitempty"`
	Tags              string         `gorm:"type:text" json:"tags,omitempty"`
	Headers           string         `gorm:"type:jsonb" json:"headers,omitempty"`
	Metadata          string         `gorm:"type:jsonb" json:"metadata,omitempty"`
	AttachmentCount   int            `json:"attachment_count"`
	AttachmentSize    int64          `json:"attachment_size"`
	ClientIP          string         `gorm:"size:100" json:"client_ip,omitempty"`
	UserAgent         string         `gorm:"size:500" json:"user_agent,omitempty"`
}

type EmailTemplate struct {
	BaseModel
	Name        string `gorm:"uniqueIndex;size:200;not null" json:"name"`
	Locale      string `gorm:"size:20;default:'en'" json:"locale"`
	Version     int    `gorm:"default:1;not null" json:"version"`
	Subject     string `gorm:"size:500;not null" json:"subject"`
	Body        string `gorm:"type:text;not null" json:"body"`
	Type        string `gorm:"size:50;not null" json:"type"` // html, text
	Category    string `gorm:"size:100" json:"category"`
	Variables   string `gorm:"type:jsonb" json:"variables"` // Available template variables
	Layout      string `gorm:"size:100;not null" json:"layout"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`
	IsDefault   bool   `gorm:"default:false" json:"is_default"`
	Description string `gorm:"type:text" json:"description"`
}

func (EmailTemplate) TableName() string {
	return "email_templates"
}

func (EmailLog) TableName() string {
	return "email_logs"
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

package usecase

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type MailUsecase interface {
	Send(ctx context.Context, email domain.EmailData) error
	Retry(ctx context.Context, id uint) error
	GetLog(ctx context.Context, id uint) (*domain.EmailLog, error)
	ListLogs(ctx context.Context, filter domain.EmailLogFilter) ([]domain.EmailLog, int64, error)
	TrackOpen(ctx context.Context, messageID string) error
	TrackClick(ctx context.Context, messageID string) error
	CreateTemplate(ctx context.Context, t *domain.EmailTemplate) error
	UpdateTemplate(ctx context.Context, t *domain.EmailTemplate) error
	DeleteTemplate(ctx context.Context, id uint) error
	GetTemplate(ctx context.Context, id uint) (*domain.EmailTemplate, error)
	ListTemplates(ctx context.Context, filter domain.EmailTemplateFilter) ([]domain.EmailTemplate, int64, error)

	SendEmail(ctx context.Context, to []string, subject, body string) error
	SendHTMLEmail(ctx context.Context, to []string, subject, htmlBody string) error
	SendEmailWithTemplate(ctx context.Context, to []string, templateName string, data map[string]any) error
	SendBulkEmail(ctx context.Context, emails []domain.EmailData) error
	SendEmailWithAttachment(ctx context.Context, to []string, subject, body string, attachments []domain.EmailAttachment) error
	ScheduleEmail(ctx context.Context, sendAt time.Time, data domain.EmailData) error
	ValidateEmail(email string) bool
	GetEmailLog(ctx context.Context, id string) (*domain.EmailLog, error)
	ListEmailLogs(ctx context.Context, filter domain.EmailLogFilter) ([]*domain.EmailLog, error)
	GetEmailStatus(ctx context.Context, id string) (domain.EmailStatus, error)

	SendWelcomeEmail(ctx context.Context, to string, data map[string]any) error
	SendEventNotificationEmail(ctx context.Context, to []string, data map[string]any) error
	SendPasswordResetEmail(ctx context.Context, to string, data map[string]any) error
	SendPaymentSuccessEmail(ctx context.Context, to string, data map[string]any) error
	SendInvoiceEmail(ctx context.Context, to string, data map[string]any, attachments []domain.EmailAttachment) error
}

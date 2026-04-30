package usecase

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type EmailUsecase interface {
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
}

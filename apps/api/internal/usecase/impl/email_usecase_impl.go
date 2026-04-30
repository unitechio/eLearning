package impl

import (
	"context"
	"encoding/json"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type EmailUsecase struct {
	emailRepo repository.EmailRepository
}

func NewEmailUsecase(emailRepo repository.EmailRepository) *EmailUsecase {
	return &EmailUsecase{emailRepo: emailRepo}
}

func (u *EmailUsecase) SendEmail(ctx context.Context, to []string, subject, body string) error {
	return u.sendAndLog(ctx, domain.EmailData{To: to, Subject: subject, Body: body})
}

func (u *EmailUsecase) SendHTMLEmail(ctx context.Context, to []string, subject, htmlBody string) error {
	return u.sendAndLog(ctx, domain.EmailData{To: to, Subject: subject, HTMLBody: htmlBody})
}

func (u *EmailUsecase) SendEmailWithTemplate(ctx context.Context, to []string, templateName string, data map[string]any) error {
	subject, _ := data["subject"].(string)
	body, _ := data["body"].(string)
	return u.sendAndLog(ctx, domain.EmailData{To: to, Subject: subject, Body: body, Template: templateName, Data: data})
}

func (u *EmailUsecase) SendBulkEmail(ctx context.Context, emails []domain.EmailData) error {
	for _, email := range emails {
		if err := u.sendAndLog(ctx, email); err != nil {
			return err
		}
	}
	return nil
}

func (u *EmailUsecase) SendEmailWithAttachment(ctx context.Context, to []string, subject, body string, attachments []domain.EmailAttachment) error {
	return u.sendAndLog(ctx, domain.EmailData{To: to, Subject: subject, Body: body, Attachments: attachments})
}

func (u *EmailUsecase) ScheduleEmail(ctx context.Context, sendAt time.Time, data domain.EmailData) error {
	if sendAt.Before(time.Now()) {
		return errors.New("scheduled time must be in the future")
	}
	return u.emailRepo.SaveEmailLog(ctx, u.createEmailLog(data, domain.EmailStatusPending, map[string]any{
		"scheduled_at": sendAt.UTC().Format(time.RFC3339),
	}))
}

func (u *EmailUsecase) ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[A-Za-z]{2,}$`)
	return emailRegex.MatchString(strings.TrimSpace(email))
}

func (u *EmailUsecase) GetEmailLog(ctx context.Context, id string) (*domain.EmailLog, error) {
	return u.emailRepo.GetEmailLog(ctx, id)
}

func (u *EmailUsecase) ListEmailLogs(ctx context.Context, filter domain.EmailLogFilter) ([]*domain.EmailLog, error) {
	return u.emailRepo.ListEmailLogs(ctx, filter)
}

func (u *EmailUsecase) GetEmailStatus(ctx context.Context, id string) (domain.EmailStatus, error) {
	log, err := u.emailRepo.GetEmailLog(ctx, id)
	if err != nil {
		return "", err
	}
	return domain.EmailStatus(log.Status), nil
}

func (u *EmailUsecase) sendAndLog(ctx context.Context, data domain.EmailData) error {
	if len(data.To) == 0 {
		return errors.New("recipient list cannot be empty")
	}
	for _, email := range data.To {
		if !u.ValidateEmail(email) {
			return errors.New("invalid email address: " + email)
		}
	}
	log := u.createEmailLog(data, domain.EmailStatusSent, data.Data)
	return u.emailRepo.SaveEmailLog(ctx, log)
}

func (u *EmailUsecase) createEmailLog(data domain.EmailData, status domain.EmailStatus, metadata map[string]any) *domain.EmailLog {
	to := strings.Join(data.To, ",")
	from := data.From
	if from == "" {
		from = "noreply@eenglish.local"
	}
	body := data.Body
	if body == "" {
		body = data.HTMLBody
	}
	emailLog := &domain.EmailLog{
		To:       to,
		From:     from,
		Subject:  data.Subject,
		Body:     body,
		Status:   string(status),
		Metadata: serializeEmailMetadata(metadata),
	}
	if status == domain.EmailStatusSent || status == domain.EmailStatusDelivered {
		now := time.Now()
		emailLog.SentAt = &now
	}
	return emailLog
}

func serializeEmailMetadata(payload map[string]any) string {
	if len(payload) == 0 {
		return ""
	}
	data, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return string(data)
}

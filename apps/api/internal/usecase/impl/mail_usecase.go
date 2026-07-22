package impl

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/mail"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type MailUsecase struct {
	emailRepo    repository.EmailRepository
	templateRepo repository.EmailTemplateRepository
	provider     mail.Provider
	renderer     mail.Renderer
	defaultFrom  string
}

type Mailer interface {
	SendPasswordResetOTP(ctx context.Context, email, fullName, otp string) error
	SendEmailVerificationOTP(ctx context.Context, email, fullName, otp string) error
	SendWelcomeAccountEmail(ctx context.Context, email, fullName string) error
}

var mailer Mailer = noopMailer{}

type noopMailer struct{}

func (noopMailer) SendPasswordResetOTP(ctx context.Context, email, fullName, otp string) error {
	return nil
}

func (noopMailer) SendEmailVerificationOTP(ctx context.Context, email, fullName, otp string) error {
	return nil
}

func (noopMailer) SendWelcomeAccountEmail(ctx context.Context, email, fullName string) error {
	return nil
}

func SetMailer(next Mailer) {
	if next != nil {
		mailer = next
	}
}

func NewMailUsecase(
	emailRepo repository.EmailRepository,
	templateRepo repository.EmailTemplateRepository,
	provider mail.Provider,
	renderer mail.Renderer,
	defaultFrom string,
) *MailUsecase {
	return &MailUsecase{
		emailRepo:    emailRepo,
		templateRepo: templateRepo,
		provider:     provider,
		renderer:     renderer,
		defaultFrom:  defaultFrom,
	}
}

func NewEmailUsecase(emailRepo repository.EmailRepository) *MailUsecase {
	return NewMailUsecase(emailRepo, nil, mail.NewNoopProvider(), mail.NewRenderer(nil, mail.BaseContext{
		AppName: "eEnglish",
		AppURL:  "http://localhost:5173",
	}), "noreply@eenglish.local")
}

func (u *MailUsecase) validate(email *domain.EmailData) error {
	if len(email.To) == 0 {
		return errors.New("recipient is required")
	}

	if email.Subject == "" && email.Template == "" {
		return errors.New("subject is required")
	}
	for _, recipient := range email.To {
		if !u.ValidateEmail(recipient) {
			return fmt.Errorf("invalid recipient email: %s", recipient)
		}
	}
	if email.Priority == "" {
		email.Priority = domain.EmailPriorityNormal
	}
	return nil
}

func (u *MailUsecase) Send(ctx context.Context, email domain.EmailData) error {
	if err := u.validate(&email); err != nil {
		return err
	}
	if email.From == "" {
		email.From = u.defaultFrom
	}
	if email.Template != "" {
		subject, body, err := u.renderer.RenderByName(ctx, email.Template, "vi", email.Data)
		if err != nil {
			return err
		}
		email.Subject = subject
		email.HTMLBody = body
	}
	if email.HTMLBody == "" && email.TextBody == "" {
		return errors.New("email body is required")
	}
	log := u.buildLog(email, domain.EmailStatusPending)
	if email.ScheduleAt != nil && email.ScheduleAt.After(time.Now()) {
		log.ScheduledAt = email.ScheduleAt
		return u.emailRepo.Create(ctx, log)
	}
	if existing, err := u.findExistingByIdempotencyKey(ctx, email.IdempotencyKey); err == nil && existing != nil {
		return nil
	}
	if err := u.emailRepo.Create(ctx, log); err != nil {
		return err
	}
	if err := u.emailRepo.UpdateStatus(ctx, log.ID, domain.EmailStatusSending, ""); err != nil {
		return err
	}
	started := time.Now()
	providerMessageID, err := u.provider.Send(ctx, email)
	log.ProviderMessageID = providerMessageID
	log.DurationMS = time.Since(started).Milliseconds()
	if err != nil {
		log.LastError = err.Error()
		log.Status = domain.EmailStatusFailed
		log.FinishedAt = ptrTime(time.Now())
		_ = u.emailRepo.Update(ctx, log)
		return err
	}
	log.Status = domain.EmailStatusSent
	log.SentAt = ptrTime(time.Now())
	log.FinishedAt = ptrTime(time.Now())
	return u.emailRepo.Update(ctx, log)
}

func (u *MailUsecase) Retry(ctx context.Context, id uint) error {
	log, err := u.emailRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	email := domain.EmailData{
		To:          splitAddresses(log.To),
		CC:          splitAddresses(log.CC),
		BCC:         splitAddresses(log.BCC),
		From:        log.From,
		ReplyTo:     log.ReplyTo,
		Subject:     log.Subject,
		TextBody:    log.TextBody,
		HTMLBody:    log.HTMLBody,
		Priority:    log.Priority,
		TrackOpen:   log.TrackOpen,
		TrackClick:  log.TrackClick,
		Attachments: nil,
	}
	if err := u.Send(ctx, email); err != nil {
		_ = u.emailRepo.IncreaseRetry(ctx, id, err.Error())
		return err
	}
	return nil
}

func (u *MailUsecase) GetLog(ctx context.Context, id uint) (*domain.EmailLog, error) {
	return u.emailRepo.FindByID(ctx, id)
}

func (u *MailUsecase) ListLogs(ctx context.Context, filter domain.EmailLogFilter) ([]domain.EmailLog, int64, error) {
	return u.emailRepo.List(ctx, filter)
}

func (u *MailUsecase) TrackOpen(ctx context.Context, messageID string) error {
	return u.emailRepo.MarkOpened(ctx, messageID)
}

func (u *MailUsecase) TrackClick(ctx context.Context, messageID string) error {
	return u.emailRepo.MarkClicked(ctx, messageID)
}

func (u *MailUsecase) CreateTemplate(ctx context.Context, t *domain.EmailTemplate) error {
	return u.templateRepo.Create(ctx, t)
}

func (u *MailUsecase) UpdateTemplate(ctx context.Context, t *domain.EmailTemplate) error {
	return u.templateRepo.Update(ctx, t)
}

func (u *MailUsecase) DeleteTemplate(ctx context.Context, id uint) error {
	return u.templateRepo.Delete(ctx, id)
}

func (u *MailUsecase) GetTemplate(ctx context.Context, id uint) (*domain.EmailTemplate, error) {
	return u.templateRepo.FindByID(ctx, id)
}

func (u *MailUsecase) ListTemplates(ctx context.Context, filter domain.EmailTemplateFilter) ([]domain.EmailTemplate, int64, error) {
	return u.templateRepo.List(ctx, filter)
}

func (u *MailUsecase) SendEmail(ctx context.Context, to []string, subject, body string) error {
	return u.Send(ctx, domain.EmailData{To: to, Subject: subject, TextBody: body})
}

func (u *MailUsecase) SendHTMLEmail(ctx context.Context, to []string, subject, htmlBody string) error {
	return u.Send(ctx, domain.EmailData{To: to, Subject: subject, HTMLBody: htmlBody})
}

func (u *MailUsecase) SendEmailWithTemplate(ctx context.Context, to []string, templateName string, data map[string]any) error {
	return u.Send(ctx, domain.EmailData{To: to, Template: templateName, Data: data})
}

func (u *MailUsecase) SendBulkEmail(ctx context.Context, emails []domain.EmailData) error {
	for i := range emails {
		if err := u.Send(ctx, emails[i]); err != nil {
			return err
		}
	}
	return nil
}

func (u *MailUsecase) SendEmailWithAttachment(ctx context.Context, to []string, subject, body string, attachments []domain.EmailAttachment) error {
	return u.Send(ctx, domain.EmailData{To: to, Subject: subject, TextBody: body, Attachments: attachments})
}

func (u *MailUsecase) ScheduleEmail(ctx context.Context, sendAt time.Time, data domain.EmailData) error {
	if !sendAt.After(time.Now()) {
		return errors.New("scheduled time must be in the future")
	}
	data.ScheduleAt = &sendAt
	if err := u.validate(&data); err != nil {
		return err
	}
	log := u.buildLog(data, domain.EmailStatusPending)
	log.ScheduledAt = &sendAt
	return u.emailRepo.Create(ctx, log)
}

func (u *MailUsecase) ValidateEmail(email string) bool {
	email = strings.TrimSpace(email)
	if email == "" {
		return false
	}
	return regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[A-Za-z]{2,}$`).MatchString(email)
}

func (u *MailUsecase) GetEmailLog(ctx context.Context, id string) (*domain.EmailLog, error) {
	logID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return nil, err
	}
	return u.emailRepo.FindByID(ctx, uint(logID))
}

func (u *MailUsecase) ListEmailLogs(ctx context.Context, filter domain.EmailLogFilter) ([]*domain.EmailLog, error) {
	items, _, err := u.emailRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := make([]*domain.EmailLog, len(items))
	for i := range items {
		current := items[i]
		result[i] = &current
	}
	return result, nil
}

func (u *MailUsecase) GetEmailStatus(ctx context.Context, id string) (domain.EmailStatus, error) {
	log, err := u.GetEmailLog(ctx, id)
	if err != nil {
		return "", err
	}
	return log.Status, nil
}

func (u *MailUsecase) SendWelcomeEmail(ctx context.Context, to string, data map[string]any) error {
	return u.Send(ctx, domain.EmailData{To: []string{to}, Template: mail.TemplateWelcome, Data: data, Priority: domain.EmailPriorityNormal, Tags: []string{"welcome", "account"}})
}

func (u *MailUsecase) SendEventNotificationEmail(ctx context.Context, to []string, data map[string]any) error {
	return u.Send(ctx, domain.EmailData{To: to, Template: mail.TemplateEvent, Data: data, Priority: domain.EmailPriorityNormal, Tags: []string{"event", "notification"}})
}

func (u *MailUsecase) SendPasswordResetEmail(ctx context.Context, to string, data map[string]any) error {
	return u.Send(ctx, domain.EmailData{To: []string{to}, Template: mail.TemplatePasswordReset, Data: data, Priority: domain.EmailPriorityHigh, Tags: []string{"auth", "password_reset"}})
}

func (u *MailUsecase) SendPasswordResetOTP(ctx context.Context, email, fullName, otp string) error {
	data := map[string]any{
		"EmailTitle":       "Dat lai mat khau",
		"Preheader":        "Ma xac minh dat lai mat khau cua ban.",
		"HeaderEyebrow":    "BAO MAT TAI KHOAN",
		"FullName":         fullName,
		"Email":            email,
		"OTPCode":          otp,
		"ResetURL":         "",
		"ExpiresInMinutes": 5,
	}
	return u.SendPasswordResetEmail(ctx, email, data)
}

func (u *MailUsecase) SendEmailVerificationOTP(ctx context.Context, email, fullName, otp string) error {
	data := map[string]any{
		"EmailTitle":       "Xac minh email",
		"Preheader":        "Nhap ma xac minh de kich hoat tai khoan.",
		"HeaderEyebrow":    "XAC MINH TAI KHOAN",
		"FullName":         fullName,
		"VerifyURL":        "",
		"OTPCode":          otp,
		"ExpiresInMinutes": 15,
	}
	return u.Send(ctx, domain.EmailData{
		To:       []string{email},
		Template: mail.TemplateVerifyEmail,
		Data:     data,
		Priority: domain.EmailPriorityHigh,
		Tags:     []string{"auth", "email_verification"},
	})
}

func (u *MailUsecase) SendWelcomeAccountEmail(ctx context.Context, email, fullName string) error {
	firstName := fullName
	if parts := strings.Fields(fullName); len(parts) > 0 {
		firstName = parts[0]
	}
	return u.SendWelcomeEmail(ctx, email, map[string]any{
		"EmailTitle":    "Chao mung den voi IELTS Academy",
		"Preheader":     "Tai khoan cua ban da san sang.",
		"HeaderEyebrow": "TAI KHOAN MOI",
		"FirstName":     firstName,
		"FullName":      fullName,
		"TargetBand":    "7.0+",
		"DashboardURL":  "",
	})
}

func (u *MailUsecase) SendPaymentSuccessEmail(ctx context.Context, to string, data map[string]any) error {
	return u.Send(ctx, domain.EmailData{To: []string{to}, Template: mail.TemplatePayment, Data: data, Priority: domain.EmailPriorityHigh, Tags: []string{"billing", "payment"}})
}

func (u *MailUsecase) SendInvoiceEmail(ctx context.Context, to string, data map[string]any, attachments []domain.EmailAttachment) error {
	return u.Send(ctx, domain.EmailData{To: []string{to}, Template: mail.TemplateInvoice, Data: data, Attachments: attachments, Priority: domain.EmailPriorityHigh, Tags: []string{"billing", "invoice"}})
}

func (u *MailUsecase) buildLog(email domain.EmailData, status domain.EmailStatus) *domain.EmailLog {
	headers, _ := json.Marshal(email.Headers)
	metadata, _ := json.Marshal(email.Data)
	tags, _ := json.Marshal(email.Tags)
	attachmentCount := len(email.Attachments)
	var attachmentSize int64
	for _, attachment := range email.Attachments {
		if attachment.Size > 0 {
			attachmentSize += attachment.Size
			continue
		}
		attachmentSize += int64(len(attachment.Content))
	}
	return &domain.EmailLog{
		Provider:        u.provider.Name(),
		From:            email.From,
		ReplyTo:         email.ReplyTo,
		To:              strings.Join(email.To, ","),
		CC:              strings.Join(email.CC, ","),
		BCC:             strings.Join(email.BCC, ","),
		Subject:         email.Subject,
		TextBody:        email.TextBody,
		HTMLBody:        email.HTMLBody,
		Status:          status,
		Priority:        email.Priority,
		TrackOpen:       email.TrackOpen,
		TrackClick:      email.TrackClick,
		IdempotencyKey:  email.IdempotencyKey,
		Tags:            string(tags),
		Headers:         string(headers),
		Metadata:        string(metadata),
		AttachmentCount: attachmentCount,
		AttachmentSize:  attachmentSize,
	}
}

func (u *MailUsecase) findExistingByIdempotencyKey(ctx context.Context, key string) (*domain.EmailLog, error) {
	if key == "" {
		return nil, gorm.ErrRecordNotFound
	}
	return u.emailRepo.FindByIdempotencyKey(ctx, key)
}

func splitAddresses(value string) []string {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	raw := strings.Split(value, ",")
	items := make([]string, 0, len(raw))
	for _, item := range raw {
		item = strings.TrimSpace(item)
		if item != "" {
			items = append(items, item)
		}
	}
	return items
}

func ptrTime(value time.Time) *time.Time {
	return &value
}

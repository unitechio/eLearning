package impl

import (
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type EmailRepository struct {
	db *gorm.DB
}

func NewEmailRepository(db *gorm.DB) *EmailRepository {
	return &EmailRepository{db: db}
}

func (r *EmailRepository) Create(ctx context.Context, log *domain.EmailLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *EmailRepository) SaveEmailLog(ctx context.Context, log *domain.EmailLog) error {
	return r.Create(ctx, log)
}

func (r *EmailRepository) Update(ctx context.Context, log *domain.EmailLog) error {
	return r.db.WithContext(ctx).Save(log).Error
}

func (r *EmailRepository) GetEmailLog(ctx context.Context, id string) (*domain.EmailLog, error) {
	logID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return nil, err
	}
	var emailLog domain.EmailLog
	if err := r.db.WithContext(ctx).First(&emailLog, "id = ?", uint(logID)).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}
	return &emailLog, nil
}

func (r *EmailRepository) ListEmailLogs(ctx context.Context, filter domain.EmailLogFilter) ([]*domain.EmailLog, error) {
	items, _, err := r.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	logs := make([]*domain.EmailLog, len(items))
	for i := range items {
		current := items[i]
		logs[i] = &current
	}
	return logs, nil
}

func (r *EmailRepository) List(ctx context.Context, filter domain.EmailLogFilter) ([]domain.EmailLog, int64, error) {
	filter = filter.Normalize()
	var (
		emailLogs []domain.EmailLog
		total     int64
	)

	query := r.db.WithContext(ctx).Model(&domain.EmailLog{})
	if filter.Status != "" {
		query = query.Where("status = ?", string(filter.Status))
	}
	if filter.From != "" {
		query = query.Where(`"from" = ?`, filter.From)
	}
	if filter.To != "" {
		query = query.Where(`"to" ILIKE ?`, "%"+filter.To+"%")
	}
	if filter.DateFrom != nil {
		query = query.Where("created_at >= ?", filter.DateFrom)
	}
	if filter.DateTo != nil {
		query = query.Where("created_at <= ?", filter.DateTo)
	}
	if filter.Template != "" {
		var templateIDs []uint
		if err := r.db.WithContext(ctx).Model(&domain.EmailTemplate{}).Where("name = ?", filter.Template).Pluck("id", &templateIDs).Error; err != nil {
			return nil, 0, err
		}
		if len(templateIDs) == 0 {
			return []domain.EmailLog{}, 0, nil
		}
		query = query.Where("template_id IN ?", templateIDs)
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Offset(offset).Limit(filter.PageSize).Order("created_at DESC").Find(&emailLogs).Error; err != nil {
		return nil, 0, err
	}
	return emailLogs, total, nil
}

func (r *EmailRepository) UpdateEmailStatus(ctx context.Context, id string, status domain.EmailStatus, errorMsg string) error {
	logID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}

	updates := map[string]any{
		"status":     string(status),
		"last_error": errorMsg,
		"updated_at": time.Now(),
	}
	if status == domain.EmailStatusSent || status == domain.EmailStatusDelivered {
		now := time.Now()
		updates["sent_at"] = &now
	}

	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).Where("id = ?", uint(logID)).Updates(updates).Error
}

func (r *EmailRepository) UpdateStatus(ctx context.Context, id uint, status domain.EmailStatus, errMsg string) error {
	updates := map[string]any{
		"status":      status,
		"last_error":  errMsg,
		"finished_at": time.Now(),
	}
	now := time.Now()
	switch status {
	case domain.EmailStatusSending:
		updates["started_at"] = &now
		delete(updates, "finished_at")
	case domain.EmailStatusSent:
		updates["sent_at"] = &now
	case domain.EmailStatusDelivered:
		updates["delivered_at"] = &now
	}
	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).Where("id = ?", id).Updates(updates).Error
}

func SerializeEmailMetadata(payload map[string]any) string {
	if len(payload) == 0 {
		return ""
	}
	data, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return string(data)
}

func (r *EmailRepository) FindByIdempotencyKey(ctx context.Context, key string) (*domain.EmailLog, error) {
	var email domain.EmailLog
	err := r.db.WithContext(ctx).Where("idempotency_key = ?", key).First(&email).Error
	if err != nil {
		return nil, err
	}

	return &email, nil
}

func (r *EmailRepository) FindByProviderMessageID(
	ctx context.Context,
	messageID string,
) (*domain.EmailLog, error) {

	var email domain.EmailLog

	err := r.db.
		WithContext(ctx).
		Where("provider_message_id = ?", messageID).
		First(&email).
		Error

	if err != nil {
		return nil, err
	}

	return &email, nil
}

func (r *EmailRepository) FindByID(
	ctx context.Context,
	id uint,
) (*domain.EmailLog, error) {

	var email domain.EmailLog

	err := r.db.
		WithContext(ctx).
		Preload("Template").
		First(&email, id).
		Error

	if err != nil {
		return nil, err
	}

	return &email, nil
}
func (r *EmailRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.EmailLog{}, id).Error
}

func (r *EmailRepository) MarkDelivered(ctx context.Context, providerMessageID string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).
		Where("provider_message_id = ?", providerMessageID).
		Updates(map[string]any{"status": domain.EmailStatusDelivered, "delivered_at": &now}).Error
}

func (r *EmailRepository) MarkOpened(ctx context.Context, providerMessageID string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).
		Where("provider_message_id = ?", providerMessageID).
		Updates(map[string]any{"status": domain.EmailStatusOpened, "opened_at": &now, "open_count": gorm.Expr("open_count + 1")}).Error
}

func (r *EmailRepository) MarkClicked(ctx context.Context, providerMessageID string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).
		Where("provider_message_id = ?", providerMessageID).
		Updates(map[string]any{"status": domain.EmailStatusClicked, "clicked_at": &now, "click_count": gorm.Expr("click_count + 1")}).Error
}

func (r *EmailRepository) IncreaseRetry(ctx context.Context, id uint, lastError string) error {
	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).
		Where("id = ?", id).
		Updates(map[string]any{"retry_count": gorm.Expr("retry_count + 1"), "last_error": lastError, "status": domain.EmailStatusFailed}).Error
}

func (r *EmailRepository) ListPending(ctx context.Context, limit int) ([]domain.EmailLog, error) {
	var items []domain.EmailLog

	err := r.db.
		WithContext(ctx).
		Where("status = ?", domain.EmailStatusPending).
		Order("created_at").
		Limit(limit).
		Find(&items).
		Error

	return items, err
}

func (r *EmailRepository) ListRetryable(ctx context.Context, limit int) ([]domain.EmailLog, error) {
	var items []domain.EmailLog

	err := r.db.
		WithContext(ctx).
		Where("status = ?", domain.EmailStatusFailed).
		Where("retry_count < max_retry").
		Order("updated_at").
		Limit(limit).
		Find(&items).
		Error

	return items, err
}

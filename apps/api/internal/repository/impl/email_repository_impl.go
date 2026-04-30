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

func (r *EmailRepository) SaveEmailLog(ctx context.Context, log *domain.EmailLog) error {
	return r.db.WithContext(ctx).Create(log).Error
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
	filter = filter.Normalize()
	var emailLogs []domain.EmailLog

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
			return nil, err
		}
		if len(templateIDs) == 0 {
			return []*domain.EmailLog{}, nil
		}
		query = query.Where("template_id IN ?", templateIDs)
	}

	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Offset(offset).Limit(filter.PageSize).Order("created_at DESC").Find(&emailLogs).Error; err != nil {
		return nil, err
	}

	logs := make([]*domain.EmailLog, len(emailLogs))
	for i := range emailLogs {
		current := emailLogs[i]
		logs[i] = &current
	}
	return logs, nil
}

func (r *EmailRepository) UpdateEmailStatus(ctx context.Context, id string, status domain.EmailStatus, errorMsg string) error {
	logID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}

	updates := map[string]any{
		"status":     string(status),
		"error":      errorMsg,
		"updated_at": time.Now(),
	}
	if status == domain.EmailStatusSent || status == domain.EmailStatusDelivered {
		now := time.Now()
		updates["sent_at"] = &now
	}

	return r.db.WithContext(ctx).Model(&domain.EmailLog{}).Where("id = ?", uint(logID)).Updates(updates).Error
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

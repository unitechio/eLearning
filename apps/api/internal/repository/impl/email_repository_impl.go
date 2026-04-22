package impl

import (
	"context"
	"fmt"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type EmailRepository struct {
	db *gorm.DB
}

func NewEmailRepository(db *gorm.DB) *EmailRepository {
	return &EmailRepository{db: db}
}

func (r *EmailRepository) SaveEmailLog(ctx context.Context, log *model.EmailLog) error {
	emailLog := &model.EmailLog{
		ID:       log.ID,
		To:       log.To,
		CC:       log.CC,
		BCC:      log.BCC,
		From:     log.From,
		Subject:  log.Subject,
		Template: log.Template,
		// Status:    string(log.Status),
		Error: log.Error,
		// Metadata:  model.JSONB(log.Metadata),
		SentAt:    log.SentAt,
		CreatedAt: log.CreatedAt,
		UpdatedAt: log.UpdatedAt,
	}

	result := r.db.WithContext(ctx).Create(emailLog)
	if result.Error != nil {
		return fmt.Errorf("failed to save email log: %w", result.Error)
	}

	return nil
}

// GetEmailLog retrieves an email log by ID
func (r *EmailRepository) GetEmailLog(ctx context.Context, id string) (*model.EmailLog, error) {
	var emailLog model.EmailLog

	result := r.db.WithContext(ctx).First(&emailLog, "id = ?", id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("email log not found: %s", id)
		}
		return nil, fmt.Errorf("failed to get email log: %w", result.Error)
	}

	return r.tomodelEmailLog(&emailLog), nil
}

// ListEmailLogs retrieves email logs with filters
func (r *EmailRepository) ListEmailLogs(ctx context.Context, filter model.EmailLogFilter) ([]*model.EmailLog, error) {
	var emailLogs []model.EmailLog

	query := r.db.WithContext(ctx).Model(&model.EmailLog{})

	// Apply filters
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if filter.From != "" {
		query = query.Where("from_address = ?", filter.From)
	}

	if filter.To != "" {
		// Search in JSONB array
		query = query.Where("to_addresses @> ?", fmt.Sprintf(`["%s"]`, filter.To))
	}

	if filter.Template != "" {
		query = query.Where("template = ?", filter.Template)
	}

	if filter.DateFrom != nil {
		query = query.Where("created_at >= ?", filter.DateFrom)
	}

	if filter.DateTo != nil {
		query = query.Where("created_at <= ?", filter.DateTo)
	}

	// Order by created_at descending
	query = query.Order("created_at DESC")

	// Apply pagination
	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}

	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	result := query.Find(&emailLogs)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to list email logs: %w", result.Error)
	}

	// Convert to model model
	logs := make([]*model.EmailLog, len(emailLogs))
	for i, log := range emailLogs {
		logs[i] = r.tomodelEmailLog(&log)
	}

	return logs, nil
}

// UpdateEmailStatus updates the status of an email log
func (r *EmailRepository) UpdateEmailStatus(ctx context.Context, id string, status model.EmailStatus, errorMsg string) error {
	updates := map[string]interface{}{
		"status":     status,
		"error":      errorMsg,
		"updated_at": time.Now(),
	}

	// If status is sent or delivered, update sent_at
	if status == model.EmailStatusSent || status == model.EmailStatusDelivered {
		updates["sent_at"] = time.Now()
	}

	result := r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("id = ?", id).
		Updates(updates)

	if result.Error != nil {
		return fmt.Errorf("failed to update email status: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("email log not found: %s", id)
	}

	return nil
}

// GetEmailLogsByStatus retrieves email logs by status
func (r *EmailRepository) GetEmailLogsByStatus(ctx context.Context, status model.EmailStatus, limit int) ([]*model.EmailLog, error) {
	filter := model.EmailLogFilter{
		Status: status,
		Limit:  limit,
	}
	return r.ListEmailLogs(ctx, filter)
}

// GetEmailLogsByRecipient retrieves email logs by recipient
func (r *EmailRepository) GetEmailLogsByRecipient(ctx context.Context, recipient string, limit int) ([]*model.EmailLog, error) {
	filter := model.EmailLogFilter{
		To:    recipient,
		Limit: limit,
	}
	return r.ListEmailLogs(ctx, filter)
}

// GetEmailLogsByTemplate retrieves email logs by template
func (r *EmailRepository) GetEmailLogsByTemplate(ctx context.Context, templateName string, limit int) ([]*model.EmailLog, error) {
	filter := model.EmailLogFilter{
		Template: templateName,
		Limit:    limit,
	}
	return r.ListEmailLogs(ctx, filter)
}

// GetEmailLogsByDateRange retrieves email logs within date range
func (r *EmailRepository) GetEmailLogsByDateRange(ctx context.Context, from, to time.Time, limit int) ([]*model.EmailLog, error) {
	filter := model.EmailLogFilter{
		DateFrom: &from,
		DateTo:   &to,
		Limit:    limit,
	}
	return r.ListEmailLogs(ctx, filter)
}

// CountEmailLogs counts email logs with filters
func (r *EmailRepository) CountEmailLogs(ctx context.Context, filter model.EmailLogFilter) (int64, error) {
	var count int64

	query := r.db.WithContext(ctx).Model(&model.EmailLog{})

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if filter.From != "" {
		query = query.Where("from_address = ?", filter.From)
	}

	if filter.Template != "" {
		query = query.Where("template = ?", filter.Template)
	}

	if filter.DateFrom != nil {
		query = query.Where("created_at >= ?", filter.DateFrom)
	}

	if filter.DateTo != nil {
		query = query.Where("created_at <= ?", filter.DateTo)
	}

	result := query.Count(&count)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to count email logs: %w", result.Error)
	}

	return count, nil
}

// DeleteOldEmailLogs deletes email logs older than duration
func (r *EmailRepository) DeleteOldEmailLogs(ctx context.Context, olderThan time.Duration) (int64, error) {
	cutoffTime := time.Now().Add(-olderThan)

	result := r.db.WithContext(ctx).
		Where("created_at < ?", cutoffTime).
		Delete(&model.EmailLog{})

	if result.Error != nil {
		return 0, fmt.Errorf("failed to delete old email logs: %w", result.Error)
	}

	return result.RowsAffected, nil
}

// GetEmailStats retrieves email statistics
func (r *EmailRepository) GetEmailStats(ctx context.Context, from, to time.Time) (map[string]interface{}, error) {
	var stats struct {
		Total     int64
		Sent      int64
		Failed    int64
		Pending   int64
		Delivered int64
		Bounced   int64
	}

	// Get total count
	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ?", from, to).
		Count(&stats.Total)

	// Get counts by status
	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ? AND status = ?", from, to, model.EmailStatusSent).
		Count(&stats.Sent)

	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ? AND status = ?", from, to, model.EmailStatusFailed).
		Count(&stats.Failed)

	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ? AND status = ?", from, to, model.EmailStatusPending).
		Count(&stats.Pending)

	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ? AND status = ?", from, to, model.EmailStatusDelivered).
		Count(&stats.Delivered)

	r.db.WithContext(ctx).Model(&model.EmailLog{}).
		Where("created_at BETWEEN ? AND ? AND status = ?", from, to, model.EmailStatusBounced).
		Count(&stats.Bounced)

	result := map[string]interface{}{
		"total":     stats.Total,
		"sent":      stats.Sent,
		"failed":    stats.Failed,
		"pending":   stats.Pending,
		"delivered": stats.Delivered,
		"bounced":   stats.Bounced,
	}

	if stats.Total > 0 {
		successCount := stats.Sent + stats.Delivered
		failureCount := stats.Failed + stats.Bounced
		result["success_rate"] = float64(successCount) / float64(stats.Total) * 100
		result["failure_rate"] = float64(failureCount) / float64(stats.Total) * 100
	}

	return result, nil
}

// Helper method to convert model to model
func (r *EmailRepository) tomodelEmailLog(log *model.EmailLog) *model.EmailLog {
	var sentAt time.Time
	// if log.SentAt != nil {
	// 	sentAt = *log.SentAt
	// }

	return &model.EmailLog{
		ID:        log.ID,
		To:        []string(log.To),
		CC:        []string(log.CC),
		BCC:       []string(log.BCC),
		From:      log.From,
		Subject:   log.Subject,
		Template:  log.Template,
		Status:    model.EmailStatus(log.Status),
		Error:     log.Error,
		Metadata:  map[string]interface{}(log.Metadata),
		SentAt:    sentAt,
		CreatedAt: log.CreatedAt,
		UpdatedAt: log.UpdatedAt,
	}
}

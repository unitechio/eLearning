package impl

import (
	"context"
	"fmt"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type AuditLogRepository struct {
	db *gorm.DB
}

func NewAuditRepository(db *gorm.DB) *AuditLogRepository {
	return &AuditLogRepository{db: db}
}

func (r *AuditLogRepository) Create(ctx context.Context, log *model.AuditLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *AuditLogRepository) GetByID(ctx context.Context, id string) (*model.AuditLog, error) {
	var log model.AuditLog
	err := r.db.WithContext(ctx).First(&log, "id = ?", id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("audit log not found")
		}
		return nil, err
	}

	return &log, nil
}

func (r *AuditLogRepository) List(ctx context.Context, filter model.AuditFilter) ([]*model.AuditLog, int64, error) {
	var logs []*model.AuditLog
	var total int64

	query := r.db.WithContext(ctx).Model(&model.AuditLog{})

	query = r.applyFilters(query, filter)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortBy := "created_at"
	if filter.SortBy != "" {
		sortBy = filter.SortBy
	}
	sortOrder := "DESC"
	if filter.SortOrder == "asc" {
		sortOrder = "ASC"
	}
	query = query.Order(fmt.Sprintf("%s %s", sortBy, sortOrder))

	offset := (filter.Page - 1) * filter.PageSize
	query = query.Offset(offset).Limit(filter.PageSize)

	if err := query.Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (r *AuditLogRepository) GetByUserID(ctx context.Context, userID string, filter model.AuditFilter) ([]*model.AuditLog, int64, error) {
	filter.UserID = &userID
	return r.List(ctx, filter)
}

func (r *AuditLogRepository) GetByResource(ctx context.Context, resource, resourceID string, filter model.AuditFilter) ([]*model.AuditLog, int64, error) {
	filter.Resource = resource
	filter.ResourceID = resourceID
	return r.List(ctx, filter)
}

func (r *AuditLogRepository) GetByAction(ctx context.Context, action model.AuditAction, filter model.AuditFilter) ([]*model.AuditLog, int64, error) {
	filter.Action = &action
	return r.List(ctx, filter)
}

func (r *AuditLogRepository) GetByDateRange(ctx context.Context, startDate, endDate time.Time, filter model.AuditFilter) ([]*model.AuditLog, int64, error) {
	filter.StartDate = &startDate
	filter.EndDate = &endDate
	return r.List(ctx, filter)
}

func (r *AuditLogRepository) DeleteOlderThan(ctx context.Context, duration time.Duration) error {
	cutoff := time.Now().Add(-duration)
	return r.db.WithContext(ctx).
		Where("created_at < ?", cutoff).
		Delete(&model.AuditLog{}).Error
}

func (r *AuditLogRepository) GetStatistics(ctx context.Context, startDate, endDate time.Time) (*model.AuditStatistics, error) {
	stats := &model.AuditStatistics{
		ActionBreakdown:   make(map[model.AuditAction]int64),
		ResourceBreakdown: make(map[string]int64),
	}

	r.db.WithContext(ctx).
		Model(&model.AuditLog{}).
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Count(&stats.TotalLogs)

	r.db.WithContext(ctx).
		Model(&model.AuditLog{}).
		Where("created_at BETWEEN ? AND ? AND success = true", startDate, endDate).
		Count(&stats.SuccessfulActions)

	stats.FailedActions = stats.TotalLogs - stats.SuccessfulActions

	r.db.WithContext(ctx).
		Model(&model.AuditLog{}).
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Distinct("user_id").
		Count(&stats.UniqueUsers)

	var actionStats []struct {
		Action model.AuditAction
		Count  int64
	}
	r.db.WithContext(ctx).
		Model(&model.AuditLog{}).
		Select("action, COUNT(*) as count").
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Group("action").
		Scan(&actionStats)

	for _, stat := range actionStats {
		stats.ActionBreakdown[stat.Action] = stat.Count
	}

	var resourceStats []struct {
		Resource string
		Count    int64
	}
	r.db.WithContext(ctx).
		Model(&model.AuditLog{}).
		Select("resource, COUNT(*) as count").
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Group("resource").
		Scan(&resourceStats)

	for _, stat := range resourceStats {
		stats.ResourceBreakdown[stat.Resource] = stat.Count
	}

	return stats, nil
}

func (r *AuditLogRepository) applyFilters(query *gorm.DB, filter model.AuditFilter) *gorm.DB {
	if filter.UserID != nil {
		query = query.Where("user_id = ?", *filter.UserID)
	}

	if filter.Username != "" {
		query = query.Where("username ILIKE ?", "%"+filter.Username+"%")
	}

	if filter.Action != nil {
		query = query.Where("action = ?", *filter.Action)
	}

	if filter.Resource != "" {
		query = query.Where("resource = ?", filter.Resource)
	}

	if filter.ResourceID != "" {
		query = query.Where("resource_id = ?", filter.ResourceID)
	}

	if filter.IPAddress != "" {
		query = query.Where("ip_address = ?", filter.IPAddress)
	}

	if filter.Success != nil {
		query = query.Where("success = ?", *filter.Success)
	}

	if filter.StartDate != nil {
		query = query.Where("created_at >= ?", *filter.StartDate)
	}

	if filter.EndDate != nil {
		query = query.Where("created_at <= ?", *filter.EndDate)
	}

	return query
}

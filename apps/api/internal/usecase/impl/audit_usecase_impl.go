package impl

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type AuditUsecase struct {
	auditRepo repository.AuditLogRepository
}

func NewAuditUsecase(auditRepo repository.AuditLogRepository) *AuditUsecase {
	return &AuditUsecase{
		auditRepo: auditRepo,
	}
}

func (u *AuditUsecase) Log(ctx context.Context, log *domain.AuditLog) error {
	return u.auditRepo.Create(ctx, log)
}

func (u *AuditUsecase) LogUserAction(ctx context.Context, userID, username string, action domain.AuditAction, resource, resourceID, description string) error {
	var parsedUserID *uint
	if id, err := strconv.ParseUint(userID, 10, 64); err == nil {
		value := uint(id)
		parsedUserID = &value
	}
	var parsedResourceID *uint
	if id, err := strconv.ParseUint(resourceID, 10, 64); err == nil {
		value := uint(id)
		parsedResourceID = &value
	}
	log := &domain.AuditLog{
		UserID:      parsedUserID,
		Action:      action,
		Resource:    resource,
		ResourceID:  parsedResourceID,
		Description: description,
		CreatedAt:   time.Now(),
		Metadata:    stringPtr(`{"username":"` + username + `"}`),
	}
	return u.auditRepo.Create(ctx, log)
}

func (u *AuditUsecase) LogSystemAction(ctx context.Context, action domain.AuditAction, resource, resourceID, description string) error {
	var parsedResourceID *uint
	if id, err := strconv.ParseUint(resourceID, 10, 64); err == nil {
		value := uint(id)
		parsedResourceID = &value
	}
	log := &domain.AuditLog{
		Action:      action,
		Resource:    resource,
		ResourceID:  parsedResourceID,
		Description: description,
		CreatedAt:   time.Now(),
		Metadata:    stringPtr(`{"source":"system"}`),
	}
	return u.auditRepo.Create(ctx, log)
}

func (u *AuditUsecase) GetAuditLog(ctx context.Context, id string) (*domain.AuditLog, error) {
	return u.auditRepo.GetByID(ctx, id)
}

func (u *AuditUsecase) ListAuditLogs(ctx context.Context, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error) {
	return u.auditRepo.List(ctx, filter)
}

func (u *AuditUsecase) GetUserAuditLogs(ctx context.Context, userID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error) {
	if id, err := strconv.ParseUint(userID, 10, 64); err == nil {
		value := uint(id)
		filter.UserID = &value
	}
	return u.auditRepo.List(ctx, filter)
}

func (u *AuditUsecase) GetResourceAuditLogs(ctx context.Context, resource, resourceID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error) {
	filter.Resource = resource
	if id, err := strconv.ParseUint(resourceID, 10, 64); err == nil {
		value := uint(id)
		filter.ResourceID = &value
	}
	return u.auditRepo.List(ctx, filter)
}

func (u *AuditUsecase) GetAuditStatistics(ctx context.Context, startDate, endDate time.Time) (*domain.AuditStatistics, error) {
	return u.auditRepo.GetStatistics(ctx, startDate, endDate)
}

func (u *AuditUsecase) CleanupOldLogs(ctx context.Context, retentionDays int) error {
	return u.auditRepo.DeleteOlderThan(ctx, time.Duration(retentionDays)*24*time.Hour)
}

func (u *AuditUsecase) ExportAuditLogs(ctx context.Context, filter domain.AuditFilter, format string) (string, error) {
	return "", fmt.Errorf("not implemented")
}

func stringPtr(value string) *string {
	return &value
}

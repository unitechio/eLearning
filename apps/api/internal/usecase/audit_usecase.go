package usecase

import (
	"context"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type AuditUsecase interface {
	Log(ctx context.Context, log *domain.AuditLog) error
	LogUserAction(ctx context.Context, userID, username string, action domain.AuditAction, resource, resourceID, description string) error
	LogSystemAction(ctx context.Context, action domain.AuditAction, resource, resourceID, description string) error
	GetAuditLog(ctx context.Context, id string) (*domain.AuditLog, error)
	ListAuditLogs(ctx context.Context, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetUserAuditLogs(ctx context.Context, userID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetResourceAuditLogs(ctx context.Context, resource, resourceID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetAuditStatistics(ctx context.Context, startDate, endDate time.Time) (*domain.AuditStatistics, error)
	CleanupOldLogs(ctx context.Context, retentionDays int) error
	ExportAuditLogs(ctx context.Context, filter domain.AuditFilter, format string) (string, error)
}

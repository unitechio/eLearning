package repository

import (
	"context"
	"time"

	"einfra/api/internal/domain"
)

type AuditLogRepository interface {
	Create(ctx context.Context, log *domain.AuditLog) error
	GetByID(ctx context.Context, id string) (*domain.AuditLog, error)
	List(ctx context.Context, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetByUserID(ctx context.Context, userID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetByResource(ctx context.Context, resource, resourceID string, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetByAction(ctx context.Context, action domain.AuditAction, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	GetByDateRange(ctx context.Context, startDate, endDate time.Time, filter domain.AuditFilter) ([]*domain.AuditLog, int64, error)
	DeleteOlderThan(ctx context.Context, duration time.Duration) error
	GetStatistics(ctx context.Context, startDate, endDate time.Time) (*domain.AuditStatistics, error)
}

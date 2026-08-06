package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type IntegrationListFilter struct {
	Category string
	Search   string
	Status   string
	Page     int
	PageSize int
}

type IntegrationRepository interface {
	ListCatalog(ctx context.Context, filter IntegrationListFilter) ([]domain.IntegrationCatalog, int64, error)
	GetCatalogBySlug(ctx context.Context, slug string) (*domain.IntegrationCatalog, error)
	GetCatalogByID(ctx context.Context, id uuid.UUID) (*domain.IntegrationCatalog, error)
	
	ListUserIntegrations(ctx context.Context, tenantID uuid.UUID, filter IntegrationListFilter) ([]domain.UserIntegration, int64, error)
	GetUserIntegrationBySlug(ctx context.Context, tenantID uuid.UUID, slug string) (*domain.UserIntegration, error)
	GetUserIntegrationByID(ctx context.Context, id uuid.UUID) (*domain.UserIntegration, error)
	
	UpsertUserIntegration(ctx context.Context, ui *domain.UserIntegration) error
	DeleteUserIntegration(ctx context.Context, id uuid.UUID) error
	
	CreateLog(ctx context.Context, log *domain.IntegrationLog) error
	ListLogs(ctx context.Context, userIntegrationID uuid.UUID) ([]domain.IntegrationLog, error)
}

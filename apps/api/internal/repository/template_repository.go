package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type TemplateRepository interface {
	Create(ctx context.Context, template *domain.EmailTemplate) error
	GetByID(ctx context.Context, id string) (*domain.EmailTemplate, error)
	GetByName(ctx context.Context, name string) (*domain.EmailTemplate, error)
	List(ctx context.Context, filter domain.EmailTemplateFilter) ([]*domain.EmailTemplate, int64, error)
	Update(ctx context.Context, template *domain.EmailTemplate) error
	Delete(ctx context.Context, id string) error
}

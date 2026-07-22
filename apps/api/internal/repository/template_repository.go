package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type EmailTemplateRepository interface {
	Create(ctx context.Context, template *domain.EmailTemplate) error
	FindByID(ctx context.Context, id uint) (*domain.EmailTemplate, error)
	FindByName(ctx context.Context, name, locale string) (*domain.EmailTemplate, error)
	GetByName(ctx context.Context, name string) (*domain.EmailTemplate, error)
	List(ctx context.Context, filter domain.EmailTemplateFilter) ([]domain.EmailTemplate, int64, error)
	Update(ctx context.Context, template *domain.EmailTemplate) error
	Delete(ctx context.Context, id uint) error
	Exists(ctx context.Context, name string) (bool, error)
}

package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type MenuUsecase interface {
	Create(ctx context.Context, menu *domain.Menu) error
	Update(ctx context.Context, menu *domain.Menu) error
	Delete(ctx context.Context, id uuid.UUID) error

	GetByID(ctx context.Context, id uuid.UUID) (*domain.Menu, error)
	GetAll(ctx context.Context, filter dto.MenuListFilter) ([]domain.Menu, int64, error)
	GetByUser(ctx context.Context, userID uuid.UUID) ([]domain.Menu, error)
	GetTree(ctx context.Context) ([]domain.Menu, error)
}

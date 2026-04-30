package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type MenuRepository interface {
	Create(ctx context.Context, menu *domain.Menu) error
	Update(ctx context.Context, menu *domain.Menu) error
	Delete(ctx context.Context, id uuid.UUID) error

	FindByID(ctx context.Context, id uuid.UUID) (*domain.Menu, error)
	FindAll(ctx context.Context, filter dto.MenuListFilter) ([]domain.Menu, int64, error)
	GetMenusByUser(ctx context.Context, userID uuid.UUID) ([]domain.Menu, error)
}

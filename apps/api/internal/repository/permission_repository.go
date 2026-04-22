package repository

import (
	"context"

	"einfra/api/internal/domain"
)

type PermissionRepository interface {
	Create(ctx context.Context, permission *domain.Permission) error
	GetByID(ctx context.Context, id string) (*domain.Permission, error)
	GetByName(ctx context.Context, name string) (*domain.Permission, error)
	List(ctx context.Context, filter domain.PermissionFilter) ([]*domain.Permission, int64, error)
	Update(ctx context.Context, permission *domain.Permission) error
	Delete(ctx context.Context, id string) error
	GetByResource(ctx context.Context, resource string) ([]*domain.Permission, error)
}

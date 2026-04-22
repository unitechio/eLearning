package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type RoleRepository interface {
	Create(ctx context.Context, role *model.Role) error
	GetByID(ctx context.Context, id string) (*model.Role, error)
	GetByName(ctx context.Context, name string) (*model.Role, error)
	List(ctx context.Context, filter model.RoleFilter) ([]*model.Role, int64, error)
	Update(ctx context.Context, role *model.Role) error
	Delete(ctx context.Context, id string) error
	AssignPermissions(ctx context.Context, roleID string, permissionIDs []string) error
	RemovePermissions(ctx context.Context, roleID string, permissionIDs []string) error
}

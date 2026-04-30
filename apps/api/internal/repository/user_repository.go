package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*domain.User, error)
	ListUsers(ctx context.Context, filter dto.UserListFilter) ([]domain.User, int64, error)
	Create(ctx context.Context, user *domain.User) error
	Update(ctx context.Context, user *domain.User) error
	AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error
	AssignRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error
	RemoveRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error
	AssignPermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error
	RemovePermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error
	ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error
	ResetPassword(ctx context.Context, userID, newPassword string) error
}

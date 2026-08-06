package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

// UserListFilter specifies the criteria for listing users.
// Lives in the repository package to keep the persistence layer
// independent of the HTTP/DTO layer.
type UserListFilter struct {
	Search   string
	Status   string
	Page     int
	PageSize int
}

// UserRepository defines the persistence contract for user data.
// All methods return domain entities, never DTOs.
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*domain.User, error)
	ListUsers(ctx context.Context, filter UserListFilter) ([]domain.User, int64, error)
	Create(ctx context.Context, user *domain.User) error
	Update(ctx context.Context, user *domain.User) error
	AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error
	AssignRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error
	RemoveRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error
	AssignPermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error
	RemovePermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error
	// ChangePassword verifies oldPassword before applying newPassword.
	// The old password verification is the repository's responsibility
	// only for the raw credential check; business validation belongs in the usecase.
	ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error
	ResetPassword(ctx context.Context, userID uuid.UUID, newHashedPassword string) error
	UpdateEmailVerification(ctx context.Context, userID uuid.UUID, verified bool) error
	UpdateTwoFactor(ctx context.Context, userID uuid.UUID, enabled bool, secret string) error
}

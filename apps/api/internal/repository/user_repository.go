package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/xuri/excelize/v2"
)

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*model.User, error)
	ListUsers(ctx context.Context, filter UserListFilter) ([]model.User, int64, error)
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error
	ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error
	ResetPassword(ctx context.Context, userID, newPassword string) error
	UpdateUserSettings(ctx context.Context, userID string, settings domain.UserSettings) error
	ImportUsersFromExcel(ctx context.Context, filePath string) error
	ExportUsersToExcel(ctx context.Context) (*excelize.File, string, error)
}

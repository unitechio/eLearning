package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/xuri/excelize/v2"
)

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*domain.User, error)
	ListUsers(ctx context.Context, filter dto.UserListFilter) ([]domain.User, int64, error)
	Create(ctx context.Context, user *domain.User) error
	Update(ctx context.Context, user *domain.User) error
	AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error
	ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error
	ResetPassword(ctx context.Context, userID, newPassword string) error
	UpdateUserSettings(ctx context.Context, userID string, settings domain.UserSettings) error
	ImportUsersFromExcel(ctx context.Context, filePath string) error
	ExportUsersToExcel(ctx context.Context) (*excelize.File, string, error)
}

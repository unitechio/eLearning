package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthorizationService interface {
	GetAccessProfile(ctx context.Context, userID uuid.UUID) (*dto.AccessProfile, error)
	GetTenantID(ctx context.Context, userID uuid.UUID) (uuid.UUID, error)
	RequireRoles(ctx context.Context, userID uuid.UUID, roles ...string) error
	RequireFeature(ctx context.Context, userID uuid.UUID, feature string) error
	AssignRole(ctx context.Context, actorID, targetUserID uuid.UUID, roleID uint) error
	RemoveRole(ctx context.Context, actorID, targetUserID uuid.UUID, roleID uint) error
	GrantPermissions(ctx context.Context, actorID, targetUserID uuid.UUID, permissionIDs []uint) error
	RevokePermissions(ctx context.Context, actorID, targetUserID uuid.UUID, permissionIDs []uint) error
	CanReadCourse(ctx context.Context, userID uuid.UUID, course *domain.Course) error
	CanManageCourse(ctx context.Context, userID uuid.UUID, course *domain.Course) error
	CanReadActivity(ctx context.Context, userID uuid.UUID, activity *domain.Activity) error
	CanManageActivity(ctx context.Context, userID uuid.UUID, activity *domain.Activity) error
}

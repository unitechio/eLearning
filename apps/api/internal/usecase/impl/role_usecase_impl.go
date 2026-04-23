package impl

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type RoleUsecase struct {
	roleRepo repository.RoleRepository
}

func NewRoleUsecase(roleRepo repository.RoleRepository) *RoleUsecase {
	return &RoleUsecase{
		roleRepo: roleRepo,
	}
}

func (u *RoleUsecase) Create(ctx context.Context, role *domain.Role) error {
	return u.roleRepo.Create(ctx, role)
}

func (u *RoleUsecase) GetByID(ctx context.Context, id string) (*domain.Role, error) {
	return u.roleRepo.GetByID(ctx, id)
}

func (u *RoleUsecase) GetByName(ctx context.Context, name string) (*domain.Role, error) {
	return u.roleRepo.GetByName(ctx, name)
}

func (u *RoleUsecase) List(ctx context.Context, filter domain.RoleFilter) ([]*domain.Role, int64, error) {
	return u.roleRepo.List(ctx, filter)
}

func (u *RoleUsecase) Update(ctx context.Context, role *domain.Role) error {
	return u.roleRepo.Update(ctx, role)
}

func (u *RoleUsecase) Delete(ctx context.Context, id string) error {
	return u.roleRepo.Delete(ctx, id)
}

func (u *RoleUsecase) AssignPermissions(ctx context.Context, roleID string, permissionIDs []string) error {
	return u.roleRepo.AssignPermissions(ctx, roleID, permissionIDs)
}

func (u *RoleUsecase) RemovePermissions(ctx context.Context, roleID string, permissionIDs []string) error {
	return u.roleRepo.RemovePermissions(ctx, roleID, permissionIDs)
}

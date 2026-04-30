package impl

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).Preload("Roles.Permissions").Preload("Permissions").Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) ListUsers(ctx context.Context, filter dto.UserListFilter) ([]domain.User, int64, error) {
	var items []domain.User
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.User{})
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(email) like ? or lower(first_name) like ? or lower(last_name) like ?", like, like, like)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Preload("Roles").Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepository) Update(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *UserRepository) AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("name = ?", roleName).First(&role).Error; err != nil {
		return err
	}
	return r.db.Model(&user).Association("Roles").Append(&role)
}

func (r *UserRepository) AssignRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("id = ?", roleID).First(&role).Error; err != nil {
		return err
	}
	return r.db.WithContext(ctx).Model(&user).Association("Roles").Append(&role)
}

func (r *UserRepository) RemoveRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("id = ?", roleID).First(&role).Error; err != nil {
		return err
	}
	return r.db.WithContext(ctx).Model(&user).Association("Roles").Delete(&role)
}

func (r *UserRepository) AssignPermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error {
	if len(permissionIDs) == 0 {
		return nil
	}
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var permissions []domain.Permission
	if err := r.db.WithContext(ctx).Where("id IN ?", permissionIDs).Find(&permissions).Error; err != nil {
		return err
	}
	if len(permissions) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&user).Association("Permissions").Append(permissions)
}

func (r *UserRepository) RemovePermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error {
	if len(permissionIDs) == 0 {
		return nil
	}
	var user domain.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var permissions []domain.Permission
	if err := r.db.WithContext(ctx).Where("id IN ?", permissionIDs).Find(&permissions).Error; err != nil {
		return err
	}
	if len(permissions) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&user).Association("Permissions").Delete(permissions)
}

func (r *UserRepository) ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error {
	_ = oldPassword
	return r.ResetPassword(ctx, userID, newPassword)
}

func (r *UserRepository) ResetPassword(ctx context.Context, userID, newPassword string) error {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return err
	}
	return r.db.WithContext(ctx).Model(&domain.User{}).Where("id = ?", parsedID).Update("password", newPassword).Error
}

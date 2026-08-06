package impl

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

// UserRepository implements repository.UserRepository using GORM.
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository constructs a UserRepository backed by the given DB connection.
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, wrapNotFoundErr(err, errs.ErrUserNotFound)
	}
	return &user, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, wrapNotFoundErr(err, errs.ErrUserNotFound)
	}
	return &user, nil
}

// FindByIDWithAccess eagerly loads roles and permissions for authorization checks.
func (r *UserRepository) FindByIDWithAccess(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).
		Preload("Roles.Permissions").
		Preload("Permissions").
		Where("id = ?", id).
		First(&user).Error
	if err != nil {
		return nil, wrapNotFoundErr(err, errs.ErrUserNotFound)
	}
	return &user, nil
}

func (r *UserRepository) ListUsers(ctx context.Context, filter repository.UserListFilter) ([]domain.User, int64, error) {
	var users []domain.User
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.User{})
	query = applyUserSearchFilter(query, filter)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := query.
		Preload("Roles").
		Order("created_at desc").
		Scopes(database.Paginate(filter.Page, filter.PageSize)).
		Find(&users).Error; err != nil {
		return nil, 0, err
	}
	return users, total, nil
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepository) Update(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *UserRepository) AssignRoleByName(ctx context.Context, userID uuid.UUID, roleName string) error {
	user, err := r.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("name = ?", roleName).First(&role).Error; err != nil {
		return wrapNotFoundErr(err, errs.ErrRoleNotFound)
	}
	return r.db.WithContext(ctx).Model(user).Association("Roles").Append(&role)
}

func (r *UserRepository) AssignRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error {
	user, err := r.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("id = ?", roleID).First(&role).Error; err != nil {
		return wrapNotFoundErr(err, errs.ErrRoleNotFound)
	}
	return r.db.WithContext(ctx).Model(user).Association("Roles").Append(&role)
}

func (r *UserRepository) RemoveRoleByID(ctx context.Context, userID uuid.UUID, roleID uint) error {
	user, err := r.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	var role domain.Role
	if err := r.db.WithContext(ctx).Where("id = ?", roleID).First(&role).Error; err != nil {
		return wrapNotFoundErr(err, errs.ErrRoleNotFound)
	}
	return r.db.WithContext(ctx).Model(user).Association("Roles").Delete(&role)
}

func (r *UserRepository) AssignPermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error {
	if len(permissionIDs) == 0 {
		return nil
	}
	user, err := r.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	var permissions []domain.Permission
	if err := r.db.WithContext(ctx).Where("id IN ?", permissionIDs).Find(&permissions).Error; err != nil {
		return err
	}
	if len(permissions) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(user).Association("Permissions").Append(permissions)
}

func (r *UserRepository) RemovePermissionIDs(ctx context.Context, userID uuid.UUID, permissionIDs []uint) error {
	if len(permissionIDs) == 0 {
		return nil
	}
	user, err := r.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	var permissions []domain.Permission
	if err := r.db.WithContext(ctx).Where("id IN ?", permissionIDs).Find(&permissions).Error; err != nil {
		return err
	}
	if len(permissions) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(user).Association("Permissions").Delete(permissions)
}

// ChangePassword is a no-op at the repository level; old password validation
// must be performed in the usecase before calling ResetPassword.
// The parameter is kept in the interface signature so callers are aware that
// validation is expected upstream.
func (r *UserRepository) ChangePassword(ctx context.Context, userID, _ /* oldPassword */, newHashedPassword string) error {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return errs.ErrInvalidUUID
	}
	return r.ResetPassword(ctx, parsedID, newHashedPassword)
}

// ResetPassword overwrites the hashed password for the given user.
// The caller is responsible for hashing the new password before calling this.
func (r *UserRepository) ResetPassword(ctx context.Context, userID uuid.UUID, newHashedPassword string) error {
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Update("password", newHashedPassword).Error
}

func (r *UserRepository) UpdateEmailVerification(ctx context.Context, userID uuid.UUID, verified bool) error {
	updates := map[string]any{"email_verified": verified}
	if verified {
		now := time.Now()
		updates["email_verified_at"] = &now
	} else {
		updates["email_verified_at"] = nil
	}
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Updates(updates).Error
}

func (r *UserRepository) UpdateTwoFactor(ctx context.Context, userID uuid.UUID, enabled bool, secret string) error {
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Updates(map[string]any{
			"two_factor_enabled": enabled,
			"two_factor_secret":  secret,
		}).Error
}

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

// applyUserSearchFilter builds the WHERE clause for user listing.
func applyUserSearchFilter(query *gorm.DB, filter repository.UserListFilter) *gorm.DB {
	if filter.Search != "" {
		pattern := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where(
			"lower(email) like ? or lower(first_name) like ? or lower(last_name) like ?",
			pattern, pattern, pattern,
		)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	return query
}

// wrapNotFoundErr maps gorm.ErrRecordNotFound to a typed sentinel error.
// All other errors are passed through unchanged.
func wrapNotFoundErr(err error, sentinel error) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return sentinel
	}
	return err
}

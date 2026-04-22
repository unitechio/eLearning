package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByID(id uuid.UUID) (*model.User, error) {
	var user model.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByIDWithAccess(id uuid.UUID) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Roles.Permissions").Preload("Permissions").Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) ListUsers(filter repository.UserListFilter) ([]model.User, int64, error) {
	var items []model.User
	var total int64
	q := r.db.Model(&model.User{})
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

func (r *UserRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) Update(user *model.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) AssignRoleByName(userID uuid.UUID, roleName string) error {
	var user model.User
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return err
	}
	var role model.Role
	if err := r.db.Where("name = ?", roleName).First(&role).Error; err != nil {
		return err
	}
	return r.db.Model(&user).Association("Roles").Append(&role)
}

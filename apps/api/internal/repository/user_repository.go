package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type UserRepository interface {
	FindByEmail(email string) (*model.User, error)
	FindByID(id uuid.UUID) (*model.User, error)
	FindByIDWithAccess(id uuid.UUID) (*model.User, error)
	ListUsers(filter UserListFilter) ([]model.User, int64, error)
	Create(user *model.User) error
	Update(user *model.User) error
	AssignRoleByName(userID uuid.UUID, roleName string) error
}

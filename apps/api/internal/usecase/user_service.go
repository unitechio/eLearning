package usecase

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type UpdateProfileRequest struct {
	FirstName string `json:"first_name" binding:"max=100"`
	LastName  string `json:"last_name" binding:"max=100"`
}

type UserService interface {
	GetByID(id uuid.UUID) (*domain.User, error)
	UpdateProfile(id uuid.UUID, req UpdateProfileRequest) (*domain.User, error)
}

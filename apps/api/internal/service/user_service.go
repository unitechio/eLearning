package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type UpdateProfileRequest struct {
	FirstName string `json:"first_name" binding:"max=100"`
	LastName  string `json:"last_name" binding:"max=100"`
}

type UserService interface {
	GetByID(id uuid.UUID) (*model.User, error)
	UpdateProfile(id uuid.UUID, req UpdateProfileRequest) (*model.User, error)
}

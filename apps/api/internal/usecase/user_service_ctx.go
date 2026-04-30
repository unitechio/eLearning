package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type UserService interface {
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	UpdateProfile(ctx context.Context, id uuid.UUID, req UpdateProfileRequest) (*domain.User, error)
}

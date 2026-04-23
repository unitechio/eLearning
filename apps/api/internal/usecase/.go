package usecase

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthorizationService interface {
	GetAccessProfile(userID uuid.UUID) (*dto.AccessProfile, error)
	RequireRoles(userID uuid.UUID, roles ...string) error
	RequireFeature(userID uuid.UUID, feature string) error
}

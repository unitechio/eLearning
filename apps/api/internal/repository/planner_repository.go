package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type PlannerRepository interface {
	FindByUserID(ctx context.Context, userID uuid.UUID) (*domain.StudyPlanner, error)
	Save(ctx context.Context, planner *domain.StudyPlanner) error
}

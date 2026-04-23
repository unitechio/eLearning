package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type PlannerRepository interface {
	FindByUserID(userID uuid.UUID) (*domain.StudyPlanner, error)
	Save(planner *domain.StudyPlanner) error
}

package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type PlannerRepository interface {
	FindByUserID(userID uuid.UUID) (*model.StudyPlanner, error)
	Save(planner *model.StudyPlanner) error
}

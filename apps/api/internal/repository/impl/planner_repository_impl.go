package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type PlannerRepository struct{ db *gorm.DB }

func NewPlannerRepository(db *gorm.DB) *PlannerRepository { return &PlannerRepository{db: db} }
func (r *PlannerRepository) FindByUserID(userID uuid.UUID) (*domain.StudyPlanner, error) {
	var item domain.StudyPlanner
	if err := r.db.Where("user_id = ?", userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *PlannerRepository) Save(planner *domain.StudyPlanner) error { return r.db.Save(planner).Error }

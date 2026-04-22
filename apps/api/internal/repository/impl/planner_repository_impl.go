package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type PlannerRepository struct{ db *gorm.DB }

func NewPlannerRepository(db *gorm.DB) *PlannerRepository { return &PlannerRepository{db: db} }
func (r *PlannerRepository) FindByUserID(userID uuid.UUID) (*model.StudyPlanner, error) {
	var item model.StudyPlanner
	if err := r.db.Where("user_id = ?", userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *PlannerRepository) Save(planner *model.StudyPlanner) error { return r.db.Save(planner).Error }

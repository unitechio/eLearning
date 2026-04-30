package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type PlannerRepository struct{ db *gorm.DB }

func NewPlannerRepository(db *gorm.DB) *PlannerRepository { return &PlannerRepository{db: db} }
func (r *PlannerRepository) FindByUserID(ctx context.Context, userID uuid.UUID) (*domain.StudyPlanner, error) {
	var item domain.StudyPlanner
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *PlannerRepository) Save(ctx context.Context, planner *domain.StudyPlanner) error {
	return r.db.WithContext(ctx).Save(planner).Error
}

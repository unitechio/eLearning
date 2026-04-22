package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type WritingRepository struct {
	db *gorm.DB
}

func NewWritingRepository(db *gorm.DB) *WritingRepository {
	return &WritingRepository{db: db}
}

func (r *WritingRepository) CreateSubmission(submission *model.WritingSubmission) error {
	return r.db.Create(submission).Error
}

func (r *WritingRepository) FindSubmissionByIDForUser(id, userID uuid.UUID) (*model.WritingSubmission, error) {
	var submission model.WritingSubmission
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&submission).Error; err != nil {
		return nil, err
	}
	return &submission, nil
}

func (r *WritingRepository) ListSubmissionsByUser(userID uuid.UUID, limit, offset int) ([]model.WritingSubmission, int64, error) {
	var items []model.WritingSubmission
	var total int64

	query := r.db.Model(&model.WritingSubmission{}).Where("user_id = ?", userID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

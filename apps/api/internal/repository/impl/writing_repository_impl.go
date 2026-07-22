package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type WritingRepository struct {
	db *gorm.DB
}

func NewWritingRepository(db *gorm.DB) *WritingRepository {
	return &WritingRepository{db: db}
}

func (r *WritingRepository) CreateSubmission(submission *domain.WritingSubmission) error {
	return r.db.Create(submission).Error
}

func (r *WritingRepository) FindSubmissionByIDForUser(id, userID uuid.UUID) (*domain.WritingSubmission, error) {
	var submission domain.WritingSubmission
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&submission).Error; err != nil {
		return nil, err
	}
	return &submission, nil
}

func (r *WritingRepository) ListSubmissionsByUser(userID uuid.UUID, limit, offset int) ([]domain.WritingSubmission, int64, error) {
	var items []domain.WritingSubmission
	var total int64

	query := r.db.Model(&domain.WritingSubmission{}).Where("user_id = ?", userID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

// FindSubmissionByID finds any submission by its UUID (admin use).
func (r *WritingRepository) FindSubmissionByID(id uuid.UUID) (*domain.WritingSubmission, error) {
	var submission domain.WritingSubmission
	if err := r.db.Where("id = ?", id).First(&submission).Error; err != nil {
		return nil, err
	}
	return &submission, nil
}

// ListAllSubmissions returns all submissions paginated (admin use).
func (r *WritingRepository) ListAllSubmissions(limit, offset int) ([]domain.WritingSubmission, int64, error) {
	var items []domain.WritingSubmission
	var total int64

	query := r.db.Model(&domain.WritingSubmission{})
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

// UpdateSubmission persists changes to an existing submission (for teacher review).
func (r *WritingRepository) UpdateSubmission(submission *domain.WritingSubmission) error {
	return r.db.Save(submission).Error
}

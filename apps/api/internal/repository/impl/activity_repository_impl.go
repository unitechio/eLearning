package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type ActivityRepository struct{ db *gorm.DB }

func NewActivityRepository(db *gorm.DB) *ActivityRepository {
	return &ActivityRepository{db: db}
}

func (r *ActivityRepository) CreateActivity(activity *domain.Activity) error {
	return r.db.Create(activity).Error
}
func (r *ActivityRepository) FindActivityByID(id uuid.UUID) (*domain.Activity, error) {
	var item domain.Activity
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *ActivityRepository) UpdateActivity(activity *domain.Activity) error {
	return r.db.Save(activity).Error
}

func (r *ActivityRepository) DeleteActivity(id uuid.UUID) error {
	return r.db.Delete(&domain.Activity{}, "id = ?", id).Error
}

func (r *ActivityRepository) CreateSubmission(submission *domain.ActivitySubmission) error {
	return r.db.Create(submission).Error
}

func (r *ActivityRepository) ListSubmissionsByActivity(activityID uuid.UUID, filter repository.ActivitySubmissionListFilter) ([]domain.ActivitySubmission, int64, error) {
	var items []domain.ActivitySubmission
	var total int64
	q := r.db.Model(&domain.ActivitySubmission{}).Where("activity_id = ?", activityID)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(answer) like ? or lower(feedback) like ?", like, like)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("submitted_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

func (r *ActivityRepository) ListSubmissionsByUser(userID uuid.UUID, filter repository.ActivitySubmissionUserFilter) ([]domain.ActivitySubmission, error) {
	var items []domain.ActivitySubmission
	q := r.db.Where("user_id = ?", userID)
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	err := q.Order("submitted_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, err
}

func (r *ActivityRepository) FindSubmissionByID(id uuid.UUID) (*domain.ActivitySubmission, error) {
	var item domain.ActivitySubmission
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

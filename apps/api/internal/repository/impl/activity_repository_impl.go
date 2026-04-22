package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type ActivityRepository struct{ db *gorm.DB }

func NewActivityRepository(db *gorm.DB) *ActivityRepository { return &ActivityRepository{db: db} }
func (r *ActivityRepository) CreateActivity(activity *model.Activity) error {
	return r.db.Create(activity).Error
}
func (r *ActivityRepository) FindActivityByID(id uuid.UUID) (*model.Activity, error) {
	var item model.Activity
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *ActivityRepository) UpdateActivity(activity *model.Activity) error {
	return r.db.Save(activity).Error
}
func (r *ActivityRepository) DeleteActivity(id uuid.UUID) error {
	return r.db.Delete(&model.Activity{}, "id = ?", id).Error
}
func (r *ActivityRepository) CreateSubmission(submission *model.ActivitySubmission) error {
	return r.db.Create(submission).Error
}
func (r *ActivityRepository) ListSubmissionsByActivity(activityID uuid.UUID, filter repository.ActivitySubmissionListFilter) ([]model.ActivitySubmission, int64, error) {
	var items []model.ActivitySubmission
	var total int64
	q := r.db.Model(&model.ActivitySubmission{}).Where("activity_id = ?", activityID)
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
func (r *ActivityRepository) ListSubmissionsByUser(userID uuid.UUID, filter repository.ActivitySubmissionUserFilter) ([]model.ActivitySubmission, error) {
	var items []model.ActivitySubmission
	q := r.db.Where("user_id = ?", userID)
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	err := q.Order("submitted_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, err
}
func (r *ActivityRepository) FindSubmissionByID(id uuid.UUID) (*model.ActivitySubmission, error) {
	var item model.ActivitySubmission
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

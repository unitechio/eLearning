package impl

import (
	"context"
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

func (r *ActivityRepository) CreateActivity(ctx context.Context, activity *domain.Activity) error {
	return r.db.WithContext(ctx).Create(activity).Error
}
func (r *ActivityRepository) FindActivityByID(ctx context.Context, id uuid.UUID) (*domain.Activity, error) {
	var item domain.Activity
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *ActivityRepository) UpdateActivity(ctx context.Context, activity *domain.Activity) error {
	return r.db.WithContext(ctx).Save(activity).Error
}

func (r *ActivityRepository) DeleteActivity(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Activity{}, "id = ?", id).Error
}

func (r *ActivityRepository) CreateSubmission(ctx context.Context, submission *domain.ActivitySubmission) error {
	return r.db.WithContext(ctx).Create(submission).Error
}

func (r *ActivityRepository) ListSubmissionsByActivity(ctx context.Context, activityID uuid.UUID, filter repository.ActivitySubmissionListFilter) ([]domain.ActivitySubmission, int64, error) {
	var items []domain.ActivitySubmission
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.ActivitySubmission{}).Where("activity_id = ?", activityID)
	if filter.TenantID != uuid.Nil {
		q = q.Where("tenant_id = ?", filter.TenantID)
	}
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

func (r *ActivityRepository) ListSubmissionsByUser(ctx context.Context, userID uuid.UUID, filter repository.ActivitySubmissionUserFilter) ([]domain.ActivitySubmission, error) {
	var items []domain.ActivitySubmission
	q := r.db.WithContext(ctx).Where("user_id = ?", userID)
	if filter.TenantID != uuid.Nil {
		q = q.Where("tenant_id = ?", filter.TenantID)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	err := q.Order("submitted_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, err
}

func (r *ActivityRepository) FindSubmissionByID(ctx context.Context, id uuid.UUID) (*domain.ActivitySubmission, error) {
	var item domain.ActivitySubmission
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

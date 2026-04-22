package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type BillingRepository struct{ db *gorm.DB }

func NewBillingRepository(db *gorm.DB) *BillingRepository { return &BillingRepository{db: db} }
func (r *BillingRepository) ListPlans(filter repository.BillingPlanListFilter) ([]model.BillingPlan, int64, error) {
	var items []model.BillingPlan
	var total int64
	q := r.db.Model(&model.BillingPlan{}).Where("is_active = ?", true)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(name) like ? or lower(description) like ?", like, like)
	}
	if filter.Currency != "" {
		q = q.Where("currency = ?", strings.ToUpper(filter.Currency))
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("price asc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}
func (r *BillingRepository) FindPlanByID(id uuid.UUID) (*model.BillingPlan, error) {
	var item model.BillingPlan
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *BillingRepository) CreateSubscription(subscription *model.BillingSubscription) error {
	return r.db.Create(subscription).Error
}
func (r *BillingRepository) CreateHistory(history *model.BillingHistory) error {
	return r.db.Create(history).Error
}
func (r *BillingRepository) ListHistoryByUserID(userID uuid.UUID, filter repository.BillingHistoryListFilter) ([]model.BillingHistory, int64, error) {
	var items []model.BillingHistory
	var total int64
	q := r.db.Model(&model.BillingHistory{}).Where("user_id = ?", userID)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(plan_name) like ?", like)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("paid_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

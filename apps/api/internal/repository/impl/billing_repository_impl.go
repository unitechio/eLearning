package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type BillingRepository struct{ db *gorm.DB }

func NewBillingRepository(db *gorm.DB) *BillingRepository { return &BillingRepository{db: db} }
func (r *BillingRepository) ListPlans(filter repository.BillingPlanListFilter) ([]domain.BillingPlan, int64, error) {
	var items []domain.BillingPlan
	var total int64
	q := r.db.Model(&domain.BillingPlan{}).Where("is_active = ?", true)
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
func (r *BillingRepository) FindPlanByID(id uuid.UUID) (*domain.BillingPlan, error) {
	var item domain.BillingPlan
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *BillingRepository) CreateSubscription(subscription *domain.BillingSubscription) error {
	return r.db.Create(subscription).Error
}
func (r *BillingRepository) CreateHistory(history *domain.BillingHistory) error {
	return r.db.Create(history).Error
}
func (r *BillingRepository) ListHistoryByUserID(userID uuid.UUID, filter repository.BillingHistoryListFilter) ([]domain.BillingHistory, int64, error) {
	var items []domain.BillingHistory
	var total int64
	q := r.db.Model(&domain.BillingHistory{}).Where("user_id = ?", userID)
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

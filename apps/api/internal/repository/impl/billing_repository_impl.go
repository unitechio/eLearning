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

type BillingRepository struct{ db *gorm.DB }

func NewBillingRepository(db *gorm.DB) *BillingRepository { return &BillingRepository{db: db} }

func (r *BillingRepository) ListPlans(ctx context.Context, filter repository.BillingPlanListFilter) ([]domain.BillingPlan, int64, error) {
	var items []domain.BillingPlan
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.BillingPlan{}).Where("is_active = ?", true)
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

func (r *BillingRepository) CreatePlan(ctx context.Context, plan *domain.BillingPlan) error {
	return r.db.WithContext(ctx).Create(plan).Error
}

func (r *BillingRepository) FindPlanByID(ctx context.Context, id uuid.UUID) (*domain.BillingPlan, error) {
	var item domain.BillingPlan
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) UpdatePlan(ctx context.Context, plan *domain.BillingPlan) error {
	return r.db.WithContext(ctx).Save(plan).Error
}

func (r *BillingRepository) DeletePlan(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.BillingPlan{}, "id = ?", id).Error
}

func (r *BillingRepository) CreateSubscription(ctx context.Context, subscription *domain.BillingSubscription) error {
	return r.db.WithContext(ctx).Create(subscription).Error
}

func (r *BillingRepository) FindSubscriptionByID(ctx context.Context, id uuid.UUID) (*domain.BillingSubscription, error) {
	var item domain.BillingSubscription
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) FindActiveSubscriptionByUserID(ctx context.Context, userID uuid.UUID) (*domain.BillingSubscription, error) {
	var item domain.BillingSubscription
	if err := r.db.WithContext(ctx).Where("user_id = ? AND status = ?", userID, "active").Order("started_at desc").First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) UpdateSubscription(ctx context.Context, subscription *domain.BillingSubscription) error {
	return r.db.WithContext(ctx).Save(subscription).Error
}

func (r *BillingRepository) ListSubscriptions(ctx context.Context, filter repository.BillingSubscriptionListFilter) ([]domain.BillingSubscription, int64, error) {
	var items []domain.BillingSubscription
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.BillingSubscription{})
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Joins("JOIN users ON users.id = billing_subscriptions.user_id").
			Joins("JOIN billing_plans ON billing_plans.id = billing_subscriptions.plan_id").
			Where("lower(users.email) like ? OR lower(billing_plans.name) like ?", like, like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("started_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

func (r *BillingRepository) CreateHistory(ctx context.Context, history *domain.BillingHistory) error {
	return r.db.WithContext(ctx).Create(history).Error
}

func (r *BillingRepository) ListHistoryByUserID(ctx context.Context, userID uuid.UUID, filter repository.BillingHistoryListFilter) ([]domain.BillingHistory, int64, error) {
	var items []domain.BillingHistory
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.BillingHistory{}).Where("user_id = ?", userID)
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

func (r *BillingRepository) CreateInvoice(ctx context.Context, invoice *domain.BillingInvoice) error {
	return r.db.WithContext(ctx).Create(invoice).Error
}

func (r *BillingRepository) FindInvoiceByID(ctx context.Context, id uuid.UUID) (*domain.BillingInvoice, error) {
	var item domain.BillingInvoice
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) UpdateInvoice(ctx context.Context, invoice *domain.BillingInvoice) error {
	return r.db.WithContext(ctx).Save(invoice).Error
}

func (r *BillingRepository) ListInvoices(ctx context.Context, filter repository.BillingAdminListFilter) ([]domain.BillingInvoice, int64, error) {
	var items []domain.BillingInvoice
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.BillingInvoice{})
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if filter.UserID != uuid.Nil {
		q = q.Where("user_id = ?", filter.UserID)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(invoice_no) like ? OR lower(description) like ?", like, like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

func (r *BillingRepository) CreatePaymentTransaction(ctx context.Context, tx *domain.PaymentTransaction) error {
	return r.db.WithContext(ctx).Create(tx).Error
}

func (r *BillingRepository) FindPaymentTransactionByID(ctx context.Context, id uuid.UUID) (*domain.PaymentTransaction, error) {
	var item domain.PaymentTransaction
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) UpdatePaymentTransaction(ctx context.Context, tx *domain.PaymentTransaction) error {
	return r.db.WithContext(ctx).Save(tx).Error
}

func (r *BillingRepository) ListPaymentTransactions(ctx context.Context, filter repository.BillingAdminListFilter) ([]domain.PaymentTransaction, int64, error) {
	var items []domain.PaymentTransaction
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.PaymentTransaction{})
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if filter.UserID != uuid.Nil {
		q = q.Where("user_id = ?", filter.UserID)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(provider) like ? OR lower(provider_reference) like ?", like, like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

func (r *BillingRepository) FindCourseByID(ctx context.Context, id uuid.UUID) (*domain.Course, error) {
	var item domain.Course
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) FindVoucherByCode(ctx context.Context, code string) (*domain.Voucher, error) {
	var item domain.Voucher
	if err := r.db.WithContext(ctx).Where("code = ? AND is_active = ?", code, true).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *BillingRepository) CreateVoucher(ctx context.Context, v *domain.Voucher) error {
	return r.db.WithContext(ctx).Create(v).Error
}

func (r *BillingRepository) ListVouchers(ctx context.Context) ([]domain.Voucher, error) {
	var items []domain.Voucher
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&items).Error
	return items, err
}

func (r *BillingRepository) DeleteVoucher(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Voucher{}, "id = ?", id).Error
}

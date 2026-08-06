package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type BillingRepository interface {
	ListPlans(ctx context.Context, filter BillingPlanListFilter) ([]domain.BillingPlan, int64, error)
	FindPlanByID(ctx context.Context, id uuid.UUID) (*domain.BillingPlan, error)
	CreatePlan(ctx context.Context, plan *domain.BillingPlan) error
	UpdatePlan(ctx context.Context, plan *domain.BillingPlan) error
	DeletePlan(ctx context.Context, id uuid.UUID) error
	CreateSubscription(ctx context.Context, subscription *domain.BillingSubscription) error
	FindSubscriptionByID(ctx context.Context, id uuid.UUID) (*domain.BillingSubscription, error)
	FindActiveSubscriptionByUserID(ctx context.Context, userID uuid.UUID) (*domain.BillingSubscription, error)
	UpdateSubscription(ctx context.Context, subscription *domain.BillingSubscription) error
	ListSubscriptions(ctx context.Context, filter BillingSubscriptionListFilter) ([]domain.BillingSubscription, int64, error)
	CreateHistory(ctx context.Context, history *domain.BillingHistory) error
	ListHistoryByUserID(ctx context.Context, userID uuid.UUID, filter BillingHistoryListFilter) ([]domain.BillingHistory, int64, error)
	CreateInvoice(ctx context.Context, invoice *domain.BillingInvoice) error
	FindInvoiceByID(ctx context.Context, id uuid.UUID) (*domain.BillingInvoice, error)
	UpdateInvoice(ctx context.Context, invoice *domain.BillingInvoice) error
	ListInvoices(ctx context.Context, filter BillingAdminListFilter) ([]domain.BillingInvoice, int64, error)
	CreatePaymentTransaction(ctx context.Context, tx *domain.PaymentTransaction) error
	FindPaymentTransactionByID(ctx context.Context, id uuid.UUID) (*domain.PaymentTransaction, error)
	UpdatePaymentTransaction(ctx context.Context, tx *domain.PaymentTransaction) error
	ListPaymentTransactions(ctx context.Context, filter BillingAdminListFilter) ([]domain.PaymentTransaction, int64, error)
	FindCourseByID(ctx context.Context, id uuid.UUID) (*domain.Course, error)
	FindVoucherByCode(ctx context.Context, code string) (*domain.Voucher, error)
	CreateVoucher(ctx context.Context, v *domain.Voucher) error
	ListVouchers(ctx context.Context) ([]domain.Voucher, error)
	DeleteVoucher(ctx context.Context, id uuid.UUID) error
}

type BillingAdminListFilter struct {
	Pagination
	Search string
	Status string
	UserID uuid.UUID
}

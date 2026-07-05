package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type BillingRepository interface {
	ListPlans(filter BillingPlanListFilter) ([]domain.BillingPlan, int64, error)
	FindPlanByID(id uuid.UUID) (*domain.BillingPlan, error)
	CreatePlan(plan *domain.BillingPlan) error
	UpdatePlan(plan *domain.BillingPlan) error
	DeletePlan(id uuid.UUID) error
	CreateSubscription(subscription *domain.BillingSubscription) error
	FindSubscriptionByID(id uuid.UUID) (*domain.BillingSubscription, error)
	FindActiveSubscriptionByUserID(userID uuid.UUID) (*domain.BillingSubscription, error)
	UpdateSubscription(subscription *domain.BillingSubscription) error
	ListSubscriptions(filter BillingSubscriptionListFilter) ([]domain.BillingSubscription, int64, error)
	CreateHistory(history *domain.BillingHistory) error
	ListHistoryByUserID(userID uuid.UUID, filter BillingHistoryListFilter) ([]domain.BillingHistory, int64, error)
	CreateInvoice(invoice *domain.BillingInvoice) error
	FindInvoiceByID(id uuid.UUID) (*domain.BillingInvoice, error)
	UpdateInvoice(invoice *domain.BillingInvoice) error
	ListInvoices(filter BillingAdminListFilter) ([]domain.BillingInvoice, int64, error)
	CreatePaymentTransaction(tx *domain.PaymentTransaction) error
	FindPaymentTransactionByID(id uuid.UUID) (*domain.PaymentTransaction, error)
	UpdatePaymentTransaction(tx *domain.PaymentTransaction) error
	ListPaymentTransactions(filter BillingAdminListFilter) ([]domain.PaymentTransaction, int64, error)
}

type BillingAdminListFilter struct {
	Pagination
	Search string
	Status string
	UserID uuid.UUID
}

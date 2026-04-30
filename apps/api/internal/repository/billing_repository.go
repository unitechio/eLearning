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
}

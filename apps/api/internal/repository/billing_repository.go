package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type BillingRepository interface {
	ListPlans(filter BillingPlanListFilter) ([]domain.BillingPlan, int64, error)
	FindPlanByID(id uuid.UUID) (*domain.BillingPlan, error)
	CreateSubscription(subscription *domain.BillingSubscription) error
	CreateHistory(history *domain.BillingHistory) error
	ListHistoryByUserID(userID uuid.UUID, filter BillingHistoryListFilter) ([]domain.BillingHistory, int64, error)
}

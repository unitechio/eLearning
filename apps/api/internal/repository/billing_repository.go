package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type BillingRepository interface {
	ListPlans(filter BillingPlanListFilter) ([]model.BillingPlan, int64, error)
	FindPlanByID(id uuid.UUID) (*model.BillingPlan, error)
	CreateSubscription(subscription *model.BillingSubscription) error
	CreateHistory(history *model.BillingHistory) error
	ListHistoryByUserID(userID uuid.UUID, filter BillingHistoryListFilter) ([]model.BillingHistory, int64, error)
}

package impl

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type BillingUsecase struct{ repo repository.BillingRepository }

func NewBillingUsecase(repo repository.BillingRepository) *BillingUsecase {
	return &BillingUsecase{repo: repo}
}

func (u *BillingUsecase) ListPlans() ([]usecase.BillingPlan, error) {
	items, _, err := u.repo.ListPlans(repository.BillingPlanListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.BillingPlan, 0, len(items))
	for _, item := range items {
		res = append(res, usecase.BillingPlan{ID: item.ID.String(), Name: item.Name, Price: item.Price, Currency: item.Currency, Description: item.Description})
	}
	return res, nil
}
func (u *BillingUsecase) Subscribe(userID uuid.UUID, req usecase.SubscribeRequest) (map[string]any, error) {
	planID, err := uuid.Parse(req.PlanID)
	if err != nil {
		return nil, apperr.BadRequest("invalid plan id")
	}
	plan, err := u.repo.FindPlanByID(planID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("billing plan", req.PlanID)
		}
		return nil, apperr.Internal(err)
	}
	expiresAt := time.Now().UTC().AddDate(0, 1, 0)
	subscription := &domain.BillingSubscription{UserID: userID, TenantID: uuid.Nil, PlanID: plan.ID, Status: "active", ExpiresAt: &expiresAt}
	if err := u.repo.CreateSubscription(subscription); err != nil {
		return nil, apperr.Internal(err)
	}
	history := &domain.BillingHistory{UserID: userID, SubscriptionID: subscription.ID, PlanName: plan.Name, Amount: plan.Price, Currency: plan.Currency, Status: "paid"}
	if err := u.repo.CreateHistory(history); err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{"subscription_id": subscription.ID.String(), "plan_id": plan.ID.String(), "status": subscription.Status, "expires_at": expiresAt}, nil
}
func (u *BillingUsecase) ListBillingHistory(userID uuid.UUID) ([]usecase.BillingHistoryItem, error) {
	items, _, err := u.repo.ListHistoryByUserID(userID, repository.BillingHistoryListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.BillingHistoryItem, 0, len(items))
	for _, item := range items {
		res = append(res, usecase.BillingHistoryItem{ID: item.ID.String(), PlanName: item.PlanName, Amount: item.Amount, Status: item.Status, CreatedAt: item.PaidAt.Format("2006-01-02T15:04:05Z07:00")})
	}
	return res, nil
}

package impl

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type BillingUsecase struct{ repo repository.BillingRepository }

func NewBillingService(repo repository.BillingRepository) *BillingUsecase {
	return &BillingUsecase{repo: repo}
}

func (s *BillingUsecase) ListPlans(query dto.BillingPlanListQuery) (*dto.PageResult[dto.BillingPlan], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListPlans(repository.BillingPlanListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Currency:   strings.ToUpper(query.Currency),
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.BillingPlan, 0, len(items))
	for _, item := range items {
		res = append(res, dto.BillingPlan{
			ID:          item.ID.String(),
			Name:        item.Name,
			Price:       item.Price,
			Currency:    item.Currency,
			Description: item.Description,
		})
	}
	return &dto.PageResult[dto.BillingPlan]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *BillingUsecase) Subscribe(userID uuid.UUID, req dto.SubscribeRequest) (map[string]any, error) {
	planID, err := uuid.Parse(req.PlanID)
	if err != nil {
		return nil, apperr.BadRequest("invalid plan id")
	}
	plan, err := s.repo.FindPlanByID(planID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("billing plan", req.PlanID)
		}
		return nil, apperr.Internal(err)
	}
	expiresAt := time.Now().UTC().AddDate(0, 1, 0)
	subscription := &domain.BillingSubscription{UserID: userID, TenantID: uuid.Nil, PlanID: plan.ID, Status: "active", ExpiresAt: &expiresAt}
	if err := s.repo.CreateSubscription(subscription); err != nil {
		return nil, apperr.Internal(err)
	}
	history := &domain.BillingHistory{UserID: userID, SubscriptionID: subscription.ID, PlanName: plan.Name, Amount: plan.Price, Currency: plan.Currency, Status: "paid"}
	if err := s.repo.CreateHistory(history); err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{"subscription_id": subscription.ID.String(), "plan_id": plan.ID.String(), "status": subscription.Status, "expires_at": expiresAt}, nil
}

func (s *BillingUsecase) ListBillingHistory(userID uuid.UUID, query dto.BillingHistoryQuery) (*dto.PageResult[dto.BillingHistoryItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListHistoryByUserID(userID, repository.BillingHistoryListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Status:     query.Status,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.BillingHistoryItem, 0, len(items))
	for _, item := range items {
		res = append(res, dto.BillingHistoryItem{
			ID:        item.ID.String(),
			PlanName:  item.PlanName,
			Amount:    item.Amount,
			Status:    item.Status,
			CreatedAt: item.PaidAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return &dto.PageResult[dto.BillingHistoryItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

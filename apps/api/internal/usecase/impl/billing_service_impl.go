package impl

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type BillingUsecase struct {
	repo     repository.BillingRepository
	userRepo repository.UserRepository
}

func NewBillingService(repo repository.BillingRepository, userRepo repository.UserRepository) *BillingUsecase {
	return &BillingUsecase{repo: repo, userRepo: userRepo}
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
	if existing, err := s.repo.FindActiveSubscriptionByUserID(userID); err == nil && existing != nil {
		existing.Status = "cancelled"
		now := time.Now().UTC()
		existing.CancelledAt = &now
		if err := s.repo.UpdateSubscription(existing); err != nil {
			return nil, apperr.Internal(err)
		}
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

func (s *BillingUsecase) ListAdminPlans(query dto.AdminBillingPlanListQuery) (*dto.PageResult[dto.AdminBillingPlan], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListPlans(repository.BillingPlanListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Currency:   strings.ToUpper(query.Currency),
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.AdminBillingPlan, 0, len(items))
	for _, item := range items {
		if query.Active != nil && item.IsActive != *query.Active {
			continue
		}
		res = append(res, dto.AdminBillingPlan{
			ID: item.ID.String(), Name: item.Name, Code: item.Code, Price: item.Price, Currency: item.Currency,
			Description: item.Description, BillingCycle: item.BillingCycle, IsActive: item.IsActive,
		})
	}
	return &dto.PageResult[dto.AdminBillingPlan]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *BillingUsecase) CreatePlan(req dto.CreateBillingPlanRequest) (*dto.AdminBillingPlan, error) {
	plan := &domain.BillingPlan{
		TenantID: uuid.Nil, Name: req.Name, Code: strings.ToLower(req.Code), Price: req.Price,
		Currency: strings.ToUpper(defaultString(req.Currency, "USD")), Description: req.Description,
		BillingCycle: defaultString(req.BillingCycle, "monthly"), IsActive: req.IsActive == nil || *req.IsActive,
	}
	if err := s.repo.CreatePlan(plan); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapAdminPlan(plan), nil
}

func (s *BillingUsecase) UpdatePlan(id string, req dto.UpdateBillingPlanRequest) (*dto.AdminBillingPlan, error) {
	planID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid plan id")
	}
	plan, err := s.repo.FindPlanByID(planID)
	if err != nil {
		return nil, apperr.NotFound("billing plan", id)
	}
	plan.Name = req.Name
	plan.Code = strings.ToLower(req.Code)
	plan.Price = req.Price
	plan.Currency = strings.ToUpper(defaultString(req.Currency, plan.Currency))
	plan.Description = req.Description
	plan.BillingCycle = defaultString(req.BillingCycle, plan.BillingCycle)
	if req.IsActive != nil {
		plan.IsActive = *req.IsActive
	}
	if err := s.repo.UpdatePlan(plan); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapAdminPlan(plan), nil
}

func (s *BillingUsecase) DeletePlan(id string) error {
	planID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid plan id")
	}
	if err := s.repo.DeletePlan(planID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *BillingUsecase) ListSubscriptions(query dto.AdminBillingSubscriptionListQuery) (*dto.PageResult[dto.AdminBillingSubscription], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListSubscriptions(repository.BillingSubscriptionListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search, Status: query.Status,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.AdminBillingSubscription, 0, len(items))
	for _, item := range items {
		mapped, err := s.mapSubscription(&item)
		if err != nil {
			return nil, err
		}
		res = append(res, *mapped)
	}
	return &dto.PageResult[dto.AdminBillingSubscription]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *BillingUsecase) GetSubscription(id string) (*dto.AdminBillingSubscription, error) {
	subID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid subscription id")
	}
	item, err := s.repo.FindSubscriptionByID(subID)
	if err != nil {
		return nil, apperr.NotFound("subscription", id)
	}
	return s.mapSubscription(item)
}

func (s *BillingUsecase) UpdateSubscriptionStatus(id string, req dto.UpdateSubscriptionStatusRequest) (*dto.AdminBillingSubscription, error) {
	subID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid subscription id")
	}
	item, err := s.repo.FindSubscriptionByID(subID)
	if err != nil {
		return nil, apperr.NotFound("subscription", id)
	}
	item.Status = strings.ToLower(req.Status)
	now := time.Now().UTC()
	if item.Status == "cancelled" {
		item.CancelledAt = &now
	}
	if err := s.repo.UpdateSubscription(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return s.mapSubscription(item)
}

func (s *BillingUsecase) CancelSubscription(id string) (*dto.AdminBillingSubscription, error) {
	return s.UpdateSubscriptionStatus(id, dto.UpdateSubscriptionStatusRequest{Status: "cancelled"})
}

func (s *BillingUsecase) GrantPremium(req dto.GrantPremiumRequest) (*dto.AdminBillingSubscription, error) {
	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	return s.createManagedSubscription(userID, req.PlanID, "active")
}

func (s *BillingUsecase) CreateCheckout(userID uuid.UUID, req dto.CheckoutPaymentRequest) (*dto.CheckoutPaymentResponse, error) {
	planID, err := uuid.Parse(req.PlanID)
	if err != nil {
		return nil, apperr.BadRequest("invalid plan id")
	}
	plan, err := s.repo.FindPlanByID(planID)
	if err != nil {
		return nil, apperr.NotFound("billing plan", req.PlanID)
	}
	provider := strings.ToLower(defaultString(req.Provider, "sandbox"))
	if provider != "sandbox" {
		return nil, apperr.BadRequest("unsupported payment provider")
	}
	dueAt := time.Now().UTC().Add(30 * time.Minute)
	invoice := &domain.BillingInvoice{
		UserID: userID, PlanID: plan.ID, InvoiceNo: newInvoiceNo(), Amount: plan.Price, Currency: plan.Currency,
		Status: "pending", DueAt: &dueAt, Description: "Subscription: " + plan.Name,
	}
	if err := s.repo.CreateInvoice(invoice); err != nil {
		return nil, apperr.Internal(err)
	}
	tx := &domain.PaymentTransaction{
		UserID: userID, InvoiceID: invoice.ID, PlanID: plan.ID, Provider: provider,
		ProviderReference: "sandbox_" + invoice.InvoiceNo, Amount: plan.Price, Currency: plan.Currency,
		Status: "pending", CheckoutURL: "/sandbox/payments/" + invoice.ID.String(),
	}
	if err := s.repo.CreatePaymentTransaction(tx); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapCheckout(invoice, tx), nil
}

func (s *BillingUsecase) ConfirmSandboxPayment(userID uuid.UUID, id string, req dto.ConfirmPaymentRequest) (*dto.CheckoutPaymentResponse, error) {
	txID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid payment transaction id")
	}
	tx, err := s.repo.FindPaymentTransactionByID(txID)
	if err != nil {
		return nil, apperr.NotFound("payment transaction", id)
	}
	if tx.UserID != userID {
		return nil, apperr.Forbidden("payment transaction access denied")
	}
	if tx.Provider != "sandbox" {
		return nil, apperr.BadRequest("only sandbox payments can be confirmed by this endpoint")
	}
	invoice, err := s.repo.FindInvoiceByID(tx.InvoiceID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	status := strings.ToLower(defaultString(req.Status, "paid"))
	now := time.Now().UTC()
	switch status {
	case "paid":
		tx.Status = "paid"
		tx.PaidAt = &now
		invoice.Status = "paid"
		invoice.PaidAt = &now
		if req.ProviderReference != "" {
			tx.ProviderReference = req.ProviderReference
		}
		if err := s.repo.UpdatePaymentTransaction(tx); err != nil {
			return nil, apperr.Internal(err)
		}
		if err := s.repo.UpdateInvoice(invoice); err != nil {
			return nil, apperr.Internal(err)
		}
		if _, err := s.createManagedSubscription(userID, tx.PlanID.String(), "active"); err != nil {
			return nil, err
		}
	case "failed", "cancelled":
		tx.Status = status
		tx.FailureReason = req.FailureReason
		invoice.Status = status
		if err := s.repo.UpdatePaymentTransaction(tx); err != nil {
			return nil, apperr.Internal(err)
		}
		if err := s.repo.UpdateInvoice(invoice); err != nil {
			return nil, apperr.Internal(err)
		}
	default:
		return nil, apperr.BadRequest("unsupported payment status")
	}
	return mapCheckout(invoice, tx), nil
}

func (s *BillingUsecase) ListInvoices(query dto.AdminBillingListQuery) (*dto.PageResult[dto.AdminBillingInvoice], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	userID, err := optionalUUID(query.UserID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	items, total, err := s.repo.ListInvoices(repository.BillingAdminListFilter{Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize}, Search: query.Search, Status: query.Status, UserID: userID})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.AdminBillingInvoice, 0, len(items))
	for _, item := range items {
		res = append(res, mapInvoice(&item))
	}
	return &dto.PageResult[dto.AdminBillingInvoice]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *BillingUsecase) ListPaymentTransactions(query dto.AdminBillingListQuery) (*dto.PageResult[dto.AdminPaymentTransaction], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	userID, err := optionalUUID(query.UserID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	items, total, err := s.repo.ListPaymentTransactions(repository.BillingAdminListFilter{Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize}, Search: query.Search, Status: query.Status, UserID: userID})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.AdminPaymentTransaction, 0, len(items))
	for _, item := range items {
		res = append(res, mapPaymentTransaction(&item))
	}
	return &dto.PageResult[dto.AdminPaymentTransaction]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *BillingUsecase) createManagedSubscription(userID uuid.UUID, planIDRaw string, status string) (*dto.AdminBillingSubscription, error) {
	planID, err := uuid.Parse(planIDRaw)
	if err != nil {
		return nil, apperr.BadRequest("invalid plan id")
	}
	plan, err := s.repo.FindPlanByID(planID)
	if err != nil {
		return nil, apperr.NotFound("billing plan", planIDRaw)
	}
	expiresAt := time.Now().UTC().AddDate(0, 1, 0)
	subscription := &domain.BillingSubscription{UserID: userID, TenantID: uuid.Nil, PlanID: plan.ID, Status: status, ExpiresAt: &expiresAt}
	if err := s.repo.CreateSubscription(subscription); err != nil {
		return nil, apperr.Internal(err)
	}
	history := &domain.BillingHistory{UserID: userID, SubscriptionID: subscription.ID, PlanName: plan.Name, Amount: plan.Price, Currency: plan.Currency, Status: "paid"}
	if err := s.repo.CreateHistory(history); err != nil {
		return nil, apperr.Internal(err)
	}
	return s.mapSubscription(subscription)
}

func mapCheckout(invoice *domain.BillingInvoice, tx *domain.PaymentTransaction) *dto.CheckoutPaymentResponse {
	return &dto.CheckoutPaymentResponse{
		InvoiceID: invoice.ID.String(), InvoiceNo: invoice.InvoiceNo, TransactionID: tx.ID.String(),
		Provider: tx.Provider, CheckoutURL: tx.CheckoutURL, Amount: tx.Amount, Currency: tx.Currency, Status: tx.Status,
	}
}

func mapInvoice(item *domain.BillingInvoice) dto.AdminBillingInvoice {
	return dto.AdminBillingInvoice{
		ID: item.ID.String(), UserID: item.UserID.String(), PlanID: item.PlanID.String(), InvoiceNo: item.InvoiceNo,
		Amount: item.Amount, Currency: item.Currency, Status: item.Status, DueAt: formatTimePtr(item.DueAt),
		PaidAt: formatTimePtr(item.PaidAt), Description: item.Description, CreatedAt: item.CreatedAt.Format(time.RFC3339),
	}
}

func mapPaymentTransaction(item *domain.PaymentTransaction) dto.AdminPaymentTransaction {
	return dto.AdminPaymentTransaction{
		ID: item.ID.String(), UserID: item.UserID.String(), InvoiceID: item.InvoiceID.String(), PlanID: item.PlanID.String(),
		Provider: item.Provider, ProviderReference: item.ProviderReference, Amount: item.Amount, Currency: item.Currency,
		Status: item.Status, CheckoutURL: item.CheckoutURL, PaidAt: formatTimePtr(item.PaidAt),
		FailureReason: item.FailureReason, CreatedAt: item.CreatedAt.Format(time.RFC3339),
	}
}

func newInvoiceNo() string {
	return fmt.Sprintf("INV-%s-%s", time.Now().UTC().Format("20060102"), strings.ToUpper(uuid.NewString()[:8]))
}

func optionalUUID(raw string) (uuid.UUID, error) {
	if strings.TrimSpace(raw) == "" {
		return uuid.Nil, nil
	}
	return uuid.Parse(raw)
}

func formatTimePtr(value *time.Time) *string {
	if value == nil {
		return nil
	}
	formatted := value.Format(time.RFC3339)
	return &formatted
}

func (s *BillingUsecase) mapSubscription(item *domain.BillingSubscription) (*dto.AdminBillingSubscription, error) {
	plan, err := s.repo.FindPlanByID(item.PlanID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	var userEmail string
	if user, err := s.userRepo.FindByID(context.Background(), item.UserID); err == nil && user != nil {
		userEmail = user.Email
	}
	startedAt := item.StartedAt.Format(time.RFC3339)
	var expiresAt *string
	if item.ExpiresAt != nil {
		value := item.ExpiresAt.Format(time.RFC3339)
		expiresAt = &value
	}
	var cancelledAt *string
	if item.CancelledAt != nil {
		value := item.CancelledAt.Format(time.RFC3339)
		cancelledAt = &value
	}
	return &dto.AdminBillingSubscription{
		ID: item.ID.String(), UserID: item.UserID.String(), UserEmail: userEmail, PlanID: item.PlanID.String(), PlanName: plan.Name,
		Status: item.Status, StartedAt: startedAt, ExpiresAt: expiresAt, CancelledAt: cancelledAt,
		IsPremium: strings.Contains(strings.ToLower(plan.Code), "pro") || strings.Contains(strings.ToLower(plan.Code), "premium"),
	}, nil
}

func mapAdminPlan(plan *domain.BillingPlan) *dto.AdminBillingPlan {
	return &dto.AdminBillingPlan{
		ID: plan.ID.String(), Name: plan.Name, Code: plan.Code, Price: plan.Price, Currency: plan.Currency,
		Description: plan.Description, BillingCycle: plan.BillingCycle, IsActive: plan.IsActive,
	}
}

func defaultString(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

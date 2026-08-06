package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AdminService interface {
	ListUsers(ctx context.Context, query dto.AdminUserListQuery) (*dto.PageResult[dto.AdminUser], error)
	UpdateUserStatus(ctx context.Context, id string, req dto.UpdateUserStatusRequest) (*dto.AdminUser, error)
	ListCourses(ctx context.Context, query dto.CourseListQuery) (*dto.PageResult[dto.Course], error)
	CreateCourse(ctx context.Context, req dto.UpsertCourseRequest) (*dto.Course, error)
	UpdateCourse(ctx context.Context, id string, req dto.UpsertCourseRequest) (*dto.Course, error)
	DeleteCourse(ctx context.Context, id string) error
	GetAnalytics(ctx context.Context) (*dto.AnalyticsSnapshot, error)
	GetAIUsage(ctx context.Context) (*dto.AIUsageSnapshot, error)
}

type BillingService interface {
	ListPlans(ctx context.Context, query dto.BillingPlanListQuery) (*dto.PageResult[dto.BillingPlan], error)
	Subscribe(ctx context.Context, userID uuid.UUID, req dto.SubscribeRequest) (map[string]any, error)
	ListBillingHistory(ctx context.Context, userID uuid.UUID, query dto.BillingHistoryQuery) (*dto.PageResult[dto.BillingHistoryItem], error)
	ListAdminPlans(ctx context.Context, query dto.AdminBillingPlanListQuery) (*dto.PageResult[dto.AdminBillingPlan], error)
	CreatePlan(ctx context.Context, req dto.CreateBillingPlanRequest) (*dto.AdminBillingPlan, error)
	UpdatePlan(ctx context.Context, id string, req dto.UpdateBillingPlanRequest) (*dto.AdminBillingPlan, error)
	DeletePlan(ctx context.Context, id string) error
	ListSubscriptions(ctx context.Context, query dto.AdminBillingSubscriptionListQuery) (*dto.PageResult[dto.AdminBillingSubscription], error)
	GetSubscription(ctx context.Context, id string) (*dto.AdminBillingSubscription, error)
	UpdateSubscriptionStatus(ctx context.Context, id string, req dto.UpdateSubscriptionStatusRequest) (*dto.AdminBillingSubscription, error)
	CancelSubscription(ctx context.Context, id string) (*dto.AdminBillingSubscription, error)
	GrantPremium(ctx context.Context, req dto.GrantPremiumRequest) (*dto.AdminBillingSubscription, error)
	CreateCheckout(ctx context.Context, userID uuid.UUID, req dto.CheckoutPaymentRequest) (*dto.CheckoutPaymentResponse, error)
	ConfirmSandboxPayment(ctx context.Context, userID uuid.UUID, id string, req dto.ConfirmPaymentRequest) (*dto.CheckoutPaymentResponse, error)
	ListInvoices(ctx context.Context, query dto.AdminBillingListQuery) (*dto.PageResult[dto.AdminBillingInvoice], error)
	ListPaymentTransactions(ctx context.Context, query dto.AdminBillingListQuery) (*dto.PageResult[dto.AdminPaymentTransaction], error)
	CheckoutCart(ctx context.Context, userID uuid.UUID, req dto.CartCheckoutRequest) (*dto.CheckoutPaymentResponse, error)
	ApplyVoucher(ctx context.Context, req dto.ApplyVoucherRequest) (*dto.ApplyVoucherResponse, error)
	AdminCreateVoucher(ctx context.Context, req dto.UpsertVoucherRequest) (*dto.VoucherDTO, error)
	AdminListVouchers(ctx context.Context) ([]dto.VoucherDTO, error)
	AdminDeleteVoucher(ctx context.Context, id string) error
}

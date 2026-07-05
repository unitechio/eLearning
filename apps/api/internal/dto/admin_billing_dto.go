package dto

type AdminUser struct {
	ID     string   `json:"id"`
	Email  string   `json:"email"`
	Status string   `json:"status"`
	Roles  []string `json:"roles,omitempty"`
}

type AdminUserListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type AnalyticsSnapshot struct {
	TotalUsers      int `json:"total_users"`
	ActiveUsers     int `json:"active_users"`
	TotalCourses    int `json:"total_courses"`
	TotalActivities int `json:"total_activities"`
}

type AIUsageSnapshot struct {
	TotalRequests int `json:"total_requests"`
	TokenUsage    int `json:"token_usage"`
}

type BillingPlan struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Currency    string  `json:"currency"`
	Description string  `json:"description"`
}

type BillingPlanListQuery struct {
	PaginationQuery
	Search   string `form:"q"`
	Currency string `form:"currency"`
}

type SubscribeRequest struct {
	PlanID string `json:"plan_id" binding:"required"`
}

type BillingHistoryItem struct {
	ID        string  `json:"id"`
	PlanName  string  `json:"plan_name"`
	Amount    float64 `json:"amount"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"created_at"`
}

type BillingHistoryQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
}

type CreateBillingPlanRequest struct {
	Name         string  `json:"name" binding:"required"`
	Code         string  `json:"code" binding:"required"`
	Price        float64 `json:"price" binding:"required"`
	Currency     string  `json:"currency"`
	Description  string  `json:"description"`
	BillingCycle string  `json:"billing_cycle"`
	IsActive     *bool   `json:"is_active,omitempty"`
}

type UpdateBillingPlanRequest struct {
	Name         string  `json:"name" binding:"required"`
	Code         string  `json:"code" binding:"required"`
	Price        float64 `json:"price" binding:"required"`
	Currency     string  `json:"currency"`
	Description  string  `json:"description"`
	BillingCycle string  `json:"billing_cycle"`
	IsActive     *bool   `json:"is_active,omitempty"`
}

type AdminBillingPlan struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Code         string  `json:"code"`
	Price        float64 `json:"price"`
	Currency     string  `json:"currency"`
	Description  string  `json:"description"`
	BillingCycle string  `json:"billing_cycle"`
	IsActive     bool    `json:"is_active"`
}

type AdminBillingPlanListQuery struct {
	PaginationQuery
	Search   string `form:"q"`
	Currency string `form:"currency"`
	Active   *bool  `form:"active"`
}

type AdminBillingSubscription struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	UserEmail   string  `json:"user_email"`
	PlanID      string  `json:"plan_id"`
	PlanName    string  `json:"plan_name"`
	Status      string  `json:"status"`
	StartedAt   string  `json:"started_at"`
	ExpiresAt   *string `json:"expires_at,omitempty"`
	CancelledAt *string `json:"cancelled_at,omitempty"`
	IsPremium   bool    `json:"is_premium"`
}

type AdminBillingSubscriptionListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
}

type UpdateSubscriptionStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type GrantPremiumRequest struct {
	UserID string `json:"user_id" binding:"required"`
	PlanID string `json:"plan_id" binding:"required"`
}

type CheckoutPaymentRequest struct {
	PlanID   string `json:"plan_id" binding:"required"`
	Provider string `json:"provider"`
}

type CheckoutPaymentResponse struct {
	InvoiceID     string  `json:"invoice_id"`
	InvoiceNo     string  `json:"invoice_no"`
	TransactionID string  `json:"transaction_id"`
	Provider      string  `json:"provider"`
	CheckoutURL   string  `json:"checkout_url"`
	Amount        float64 `json:"amount"`
	Currency      string  `json:"currency"`
	Status        string  `json:"status"`
}

type ConfirmPaymentRequest struct {
	Status            string `json:"status"`
	ProviderReference string `json:"provider_reference"`
	FailureReason     string `json:"failure_reason"`
}

type AdminBillingListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
	UserID string `form:"user_id"`
}

type AdminBillingInvoice struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	PlanID      string  `json:"plan_id"`
	InvoiceNo   string  `json:"invoice_no"`
	Amount      float64 `json:"amount"`
	Currency    string  `json:"currency"`
	Status      string  `json:"status"`
	DueAt       *string `json:"due_at,omitempty"`
	PaidAt      *string `json:"paid_at,omitempty"`
	Description string  `json:"description"`
	CreatedAt   string  `json:"created_at"`
}

type AdminPaymentTransaction struct {
	ID                string  `json:"id"`
	UserID            string  `json:"user_id"`
	InvoiceID         string  `json:"invoice_id"`
	PlanID            string  `json:"plan_id"`
	Provider          string  `json:"provider"`
	ProviderReference string  `json:"provider_reference"`
	Amount            float64 `json:"amount"`
	Currency          string  `json:"currency"`
	Status            string  `json:"status"`
	CheckoutURL       string  `json:"checkout_url"`
	PaidAt            *string `json:"paid_at,omitempty"`
	FailureReason     string  `json:"failure_reason"`
	CreatedAt         string  `json:"created_at"`
}

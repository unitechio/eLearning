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

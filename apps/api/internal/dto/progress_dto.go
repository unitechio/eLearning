package dto

type ProgressSnapshot struct {
	OverallCompletion float64 `json:"overall_completion"`
	CurrentStreak     int     `json:"current_streak"`
	WeeklyMinutes     int     `json:"weekly_minutes"`
}

type Planner struct {
	FocusArea    string   `json:"focus_area"`
	WeeklyTarget int      `json:"weekly_target"`
	Tasks        []string `json:"tasks"`
}

type PlannerUpdateRequest struct {
	FocusArea    string   `json:"focus_area"`
	WeeklyTarget int      `json:"weekly_target"`
	Tasks        []string `json:"tasks"`
}

type NotificationItem struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	IsRead    bool   `json:"is_read"`
	Category  string `json:"category"`
	CreatedAt string `json:"created_at"`
}

type NotificationListQuery struct {
	PaginationQuery
	Search   string `form:"q"`
	Category string `form:"category"`
	Read     *bool  `form:"is_read"`
}

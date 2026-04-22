package dto

type UserProgress struct {
	CourseID          string  `json:"course_id"`
	CourseTitle       string  `json:"course_title"`
	CompletionRate    float64 `json:"completion_rate"`
	CompletedLessons  int     `json:"completed_lessons"`
	TotalLessons      int     `json:"total_lessons"`
	LastActivityAtUTC string  `json:"last_activity_at"`
}

type UserStats struct {
	TotalStudyMinutes int     `json:"total_study_minutes"`
	CurrentStreak     int     `json:"current_streak"`
	CompletedCourses  int     `json:"completed_courses"`
	AverageScore      float64 `json:"average_score"`
}

type UserActivityItem struct {
	ID          string `json:"id"`
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	OccurredAt  string `json:"occurred_at"`
}

type UserActivityListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Type   string `form:"type"`
}

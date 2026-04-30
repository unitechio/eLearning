package dto

type Activity struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Type         string `json:"type"`
	Domain       string `json:"domain"`
	Instructions string `json:"instructions"`
	Status       string `json:"status"`
	Visibility   string `json:"visibility"`
}

type UpsertActivityRequest struct {
	Title        string `json:"title" binding:"required"`
	Type         string `json:"type" binding:"required"`
	Domain       string `json:"domain" binding:"required"`
	Instructions string `json:"instructions"`
	Status       string `json:"status"`
	Visibility   string `json:"visibility"`
}

type SubmitActivityRequest struct {
	Answer string `json:"answer" binding:"required"`
}

type ActivitySubmissionListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
}

type Submission struct {
	ID         string  `json:"id"`
	ActivityID string  `json:"activity_id"`
	UserID     string  `json:"user_id"`
	Answer     string  `json:"answer"`
	Score      float64 `json:"score"`
	Feedback   string  `json:"feedback"`
	Status     string  `json:"status"`
}

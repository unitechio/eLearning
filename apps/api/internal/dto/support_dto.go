package dto

type SupportTicketListQuery struct {
	PaginationQuery
	Search   string `form:"q"`
	Status   string `form:"status"`
	Category string `form:"category"`
	Priority string `form:"priority"`
	Assignee string `form:"assignee_id"`
}

type CreateSupportTicketRequest struct {
	Subject     string `json:"subject" binding:"required"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Priority    string `json:"priority"`
}

type AddSupportTicketCommentRequest struct {
	Body string `json:"body" binding:"required"`
}

type AssignSupportTicketRequest struct {
	AssigneeID string `json:"assignee_id" binding:"required"`
}

type UpdateSupportTicketStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type SupportTicketItem struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	AssigneeID  *string `json:"assignee_id,omitempty"`
	Subject     string  `json:"subject"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Priority    string  `json:"priority"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

type SupportTicketCommentItem struct {
	ID        string `json:"id"`
	TicketID  string `json:"ticket_id"`
	UserID    string `json:"user_id"`
	Body      string `json:"body"`
	IsStaff   bool   `json:"is_staff"`
	CreatedAt string `json:"created_at"`
}

type SupportTicketDetail struct {
	Ticket   SupportTicketItem          `json:"ticket"`
	Comments []SupportTicketCommentItem `json:"comments"`
}

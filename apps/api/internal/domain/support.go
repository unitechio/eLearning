package domain

import "github.com/google/uuid"

type SupportTicket struct {
	UUIDModel
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	AssigneeID  *uuid.UUID `json:"assignee_id,omitempty" gorm:"type:uuid;index"`
	Subject     string     `json:"subject" gorm:"type:varchar(255);not null"`
	Description string     `json:"description" gorm:"type:text"`
	Category    string     `json:"category" gorm:"type:varchar(80);index"`
	Priority    string     `json:"priority" gorm:"type:varchar(30);default:'normal';index"`
	Status      string     `json:"status" gorm:"type:varchar(30);default:'open';index"`
}

type SupportTicketComment struct {
	UUIDModel
	TicketID uuid.UUID `json:"ticket_id" gorm:"type:uuid;not null;index"`
	UserID   uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	Body     string    `json:"body" gorm:"type:text;not null"`
	IsStaff  bool      `json:"is_staff" gorm:"default:false"`
}

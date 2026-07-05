package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type SupportTicketFilter struct {
	Pagination
	Search     string
	Status     string
	Category   string
	Priority   string
	UserID     uuid.UUID
	AssigneeID uuid.UUID
}

type SupportRepository interface {
	CreateTicket(ticket *domain.SupportTicket) error
	UpdateTicket(ticket *domain.SupportTicket) error
	FindTicketByID(id uuid.UUID) (*domain.SupportTicket, error)
	ListTickets(filter SupportTicketFilter) ([]domain.SupportTicket, int64, error)
	CreateComment(comment *domain.SupportTicketComment) error
	ListComments(ticketID uuid.UUID) ([]domain.SupportTicketComment, error)
}

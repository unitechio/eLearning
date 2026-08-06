package repository

import (
	"context"

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
	CreateTicket(ctx context.Context, ticket *domain.SupportTicket) error
	UpdateTicket(ctx context.Context, ticket *domain.SupportTicket) error
	FindTicketByID(ctx context.Context, id uuid.UUID) (*domain.SupportTicket, error)
	ListTickets(ctx context.Context, filter SupportTicketFilter) ([]domain.SupportTicket, int64, error)
	CreateComment(ctx context.Context, comment *domain.SupportTicketComment) error
	ListComments(ctx context.Context, ticketID uuid.UUID) ([]domain.SupportTicketComment, error)
}

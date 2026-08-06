package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type SupportService interface {
	CreateTicket(ctx context.Context, userID uuid.UUID, req dto.CreateSupportTicketRequest) (*dto.SupportTicketItem, error)
	ListMyTickets(ctx context.Context, userID uuid.UUID, query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error)
	GetTicket(ctx context.Context, userID uuid.UUID, id string, staff bool) (*dto.SupportTicketDetail, error)
	AddComment(ctx context.Context, userID uuid.UUID, id string, staff bool, req dto.AddSupportTicketCommentRequest) (*dto.SupportTicketCommentItem, error)
	ListAdminTickets(ctx context.Context, query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error)
	AssignTicket(ctx context.Context, id string, req dto.AssignSupportTicketRequest) (*dto.SupportTicketItem, error)
	UpdateTicketStatus(ctx context.Context, id string, req dto.UpdateSupportTicketStatusRequest) (*dto.SupportTicketItem, error)
}

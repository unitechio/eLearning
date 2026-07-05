package usecase

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type SupportService interface {
	CreateTicket(userID uuid.UUID, req dto.CreateSupportTicketRequest) (*dto.SupportTicketItem, error)
	ListMyTickets(userID uuid.UUID, query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error)
	GetTicket(userID uuid.UUID, id string, staff bool) (*dto.SupportTicketDetail, error)
	AddComment(userID uuid.UUID, id string, staff bool, req dto.AddSupportTicketCommentRequest) (*dto.SupportTicketCommentItem, error)
	ListAdminTickets(query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error)
	AssignTicket(id string, req dto.AssignSupportTicketRequest) (*dto.SupportTicketItem, error)
	UpdateTicketStatus(id string, req dto.UpdateSupportTicketStatusRequest) (*dto.SupportTicketItem, error)
}

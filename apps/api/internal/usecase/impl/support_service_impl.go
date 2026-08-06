package impl

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type SupportUsecase struct {
	repo repository.SupportRepository
}

func NewSupportService(repo repository.SupportRepository) *SupportUsecase {
	return &SupportUsecase{repo: repo}
}

func (s *SupportUsecase) CreateTicket(ctx context.Context, userID uuid.UUID, req dto.CreateSupportTicketRequest) (*dto.SupportTicketItem, error) {
	item := &domain.SupportTicket{
		UserID: userID, Subject: req.Subject, Description: req.Description,
		Category: defaultString(req.Category, "general"), Priority: defaultString(req.Priority, "normal"), Status: "open",
	}
	if err := s.repo.CreateTicket(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSupportTicket(item), nil
}

func (s *SupportUsecase) ListMyTickets(ctx context.Context, userID uuid.UUID, query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListTickets(ctx, repository.SupportTicketFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		UserID:     userID, Search: query.Search, Status: query.Status, Category: query.Category, Priority: query.Priority,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSupportTicketPage(items, query.PaginationQuery, total), nil
}

func (s *SupportUsecase) GetTicket(ctx context.Context, userID uuid.UUID, id string, staff bool) (*dto.SupportTicketDetail, error) {
	ticket, err := s.getTicket(ctx, id)
	if err != nil {
		return nil, err
	}
	if !staff && ticket.UserID != userID {
		return nil, apperr.Forbidden("ticket access denied")
	}
	comments, err := s.repo.ListComments(ctx, ticket.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	mappedComments := make([]dto.SupportTicketCommentItem, 0, len(comments))
	for _, comment := range comments {
		mappedComments = append(mappedComments, *mapSupportComment(&comment))
	}
	return &dto.SupportTicketDetail{Ticket: *mapSupportTicket(ticket), Comments: mappedComments}, nil
}

func (s *SupportUsecase) AddComment(ctx context.Context, userID uuid.UUID, id string, staff bool, req dto.AddSupportTicketCommentRequest) (*dto.SupportTicketCommentItem, error) {
	ticket, err := s.getTicket(ctx, id)
	if err != nil {
		return nil, err
	}
	if !staff && ticket.UserID != userID {
		return nil, apperr.Forbidden("ticket access denied")
	}
	comment := &domain.SupportTicketComment{TicketID: ticket.ID, UserID: userID, Body: req.Body, IsStaff: staff}
	if err := s.repo.CreateComment(ctx, comment); err != nil {
		return nil, apperr.Internal(err)
	}
	ticket.Status = defaultString(ticket.Status, "open")
	if staff && ticket.Status == "open" {
		ticket.Status = "in_progress"
	}
	_ = s.repo.UpdateTicket(ctx, ticket)
	return mapSupportComment(comment), nil
}

func (s *SupportUsecase) ListAdminTickets(ctx context.Context, query dto.SupportTicketListQuery) (*dto.PageResult[dto.SupportTicketItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	assigneeID, err := optionalUUID(query.Assignee)
	if err != nil {
		return nil, apperr.BadRequest("invalid assignee id")
	}
	items, total, err := s.repo.ListTickets(ctx, repository.SupportTicketFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search, Status: query.Status, Category: query.Category, Priority: query.Priority, AssigneeID: assigneeID,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSupportTicketPage(items, query.PaginationQuery, total), nil
}

func (s *SupportUsecase) AssignTicket(ctx context.Context, id string, req dto.AssignSupportTicketRequest) (*dto.SupportTicketItem, error) {
	ticket, err := s.getTicket(ctx, id)
	if err != nil {
		return nil, err
	}
	assigneeID, err := uuid.Parse(req.AssigneeID)
	if err != nil {
		return nil, apperr.BadRequest("invalid assignee id")
	}
	ticket.AssigneeID = &assigneeID
	ticket.Status = defaultString(ticket.Status, "in_progress")
	if err := s.repo.UpdateTicket(ctx, ticket); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSupportTicket(ticket), nil
}

func (s *SupportUsecase) UpdateTicketStatus(ctx context.Context, id string, req dto.UpdateSupportTicketStatusRequest) (*dto.SupportTicketItem, error) {
	ticket, err := s.getTicket(ctx, id)
	if err != nil {
		return nil, err
	}
	ticket.Status = req.Status
	if err := s.repo.UpdateTicket(ctx, ticket); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSupportTicket(ticket), nil
}

func (s *SupportUsecase) getTicket(ctx context.Context, id string) (*domain.SupportTicket, error) {
	ticketID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid ticket id")
	}
	ticket, err := s.repo.FindTicketByID(ctx, ticketID)
	if err != nil {
		return nil, apperr.NotFound("support ticket", id)
	}
	return ticket, nil
}

func mapSupportTicketPage(items []domain.SupportTicket, query dto.PaginationQuery, total int64) *dto.PageResult[dto.SupportTicketItem] {
	res := make([]dto.SupportTicketItem, 0, len(items))
	for _, item := range items {
		res = append(res, *mapSupportTicket(&item))
	}
	return &dto.PageResult[dto.SupportTicketItem]{Items: res, Meta: buildMeta(query, total)}
}

func mapSupportTicket(item *domain.SupportTicket) *dto.SupportTicketItem {
	var assigneeID *string
	if item.AssigneeID != nil {
		value := item.AssigneeID.String()
		assigneeID = &value
	}
	return &dto.SupportTicketItem{
		ID: item.ID.String(), UserID: item.UserID.String(), AssigneeID: assigneeID,
		Subject: item.Subject, Description: item.Description, Category: item.Category,
		Priority: item.Priority, Status: item.Status, CreatedAt: item.CreatedAt.Format(time.RFC3339),
		UpdatedAt: item.UpdatedAt.Format(time.RFC3339),
	}
}

func mapSupportComment(item *domain.SupportTicketComment) *dto.SupportTicketCommentItem {
	return &dto.SupportTicketCommentItem{
		ID: item.ID.String(), TicketID: item.TicketID.String(), UserID: item.UserID.String(),
		Body: item.Body, IsStaff: item.IsStaff, CreatedAt: item.CreatedAt.Format(time.RFC3339),
	}
}

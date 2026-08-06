package impl

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type SupportRepository struct{ db *gorm.DB }

func NewSupportRepository(db *gorm.DB) *SupportRepository { return &SupportRepository{db: db} }

func (r *SupportRepository) CreateTicket(ctx context.Context, ticket *domain.SupportTicket) error {
	return r.db.WithContext(ctx).Create(ticket).Error
}

func (r *SupportRepository) UpdateTicket(ctx context.Context, ticket *domain.SupportTicket) error {
	return r.db.WithContext(ctx).Save(ticket).Error
}

func (r *SupportRepository) FindTicketByID(ctx context.Context, id uuid.UUID) (*domain.SupportTicket, error) {
	var item domain.SupportTicket
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *SupportRepository) ListTickets(ctx context.Context, filter repository.SupportTicketFilter) ([]domain.SupportTicket, int64, error) {
	var items []domain.SupportTicket
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.SupportTicket{})
	if filter.UserID != uuid.Nil {
		q = q.Where("user_id = ?", filter.UserID)
	}
	if filter.AssigneeID != uuid.Nil {
		q = q.Where("assignee_id = ?", filter.AssigneeID)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if filter.Category != "" {
		q = q.Where("category = ?", filter.Category)
	}
	if filter.Priority != "" {
		q = q.Where("priority = ?", filter.Priority)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(subject) like ? OR lower(description) like ?", like, like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("updated_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}

func (r *SupportRepository) CreateComment(ctx context.Context, comment *domain.SupportTicketComment) error {
	return r.db.WithContext(ctx).Create(comment).Error
}

func (r *SupportRepository) ListComments(ctx context.Context, ticketID uuid.UUID) ([]domain.SupportTicketComment, error) {
	var items []domain.SupportTicketComment
	err := r.db.WithContext(ctx).Where("ticket_id = ?", ticketID).Order("created_at asc").Find(&items).Error
	return items, err
}

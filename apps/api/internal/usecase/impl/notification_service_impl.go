package impl

import (
	"context"
	"strconv"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type NotificationUsecase struct {
	repo repository.NotificationRepository
}

func NewNotificationService(repo repository.NotificationRepository) *NotificationUsecase {
	return &NotificationUsecase{repo: repo}
}

func (s *NotificationUsecase) ListNotifications(ctx context.Context, userID uuid.UUID, query dto.NotificationListQuery) (*dto.PageResult[dto.NotificationItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListByUserID(ctx, userID, dto.NotificationListFilter{
		Pagination: dto.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Category:   query.Category,
		IsRead:     query.Read,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.NotificationItem, 0, len(items))
	for _, item := range items {
		res = append(res, dto.NotificationItem{
			ID:        strconv.FormatUint(uint64(item.ID), 10),
			Title:     item.Title,
			Message:   item.Message,
			IsRead:    item.IsRead,
			Category:  item.Category,
			CreatedAt: item.CreatedAt.Format(timeRFC3339),
		})
	}
	return &dto.PageResult[dto.NotificationItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *NotificationUsecase) MarkAsRead(ctx context.Context, userID uuid.UUID, id string) error {
	notificationID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return apperr.BadRequest("invalid notification id")
	}
	item, err := s.repo.FindByIDForUser(ctx, uint(notificationID), userID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("notification", id)
		}
		return apperr.Internal(err)
	}
	item.MarkAsRead()
	if err := s.repo.Save(ctx, item); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

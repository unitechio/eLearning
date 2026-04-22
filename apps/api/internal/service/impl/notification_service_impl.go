package impl

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type NotificationService struct {
	repo repository.NotificationRepository
}

func NewNotificationService(repo repository.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) ListNotifications(userID uuid.UUID, query dto.NotificationListQuery) (*dto.PageResult[dto.NotificationItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListByUserID(userID, repository.NotificationListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
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
			CreatedAt: item.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return &dto.PageResult[dto.NotificationItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *NotificationService) MarkAsRead(userID uuid.UUID, id string) error {
	notificationID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return apperr.BadRequest("invalid notification id")
	}
	item, err := s.repo.FindByIDForUser(uint(notificationID), userID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("notification", id)
		}
		return apperr.Internal(err)
	}
	item.MarkAsRead()
	if err := s.repo.Save(item); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

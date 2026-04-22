package impl

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type NotificationUsecase struct {
	repo repository.NotificationRepository
}

func NewNotificationUsecase(repo repository.NotificationRepository) *NotificationUsecase {
	return &NotificationUsecase{repo: repo}
}
func (u *NotificationUsecase) ListNotifications(userID uuid.UUID) ([]usecase.NotificationItem, error) {
	items, _, err := u.repo.ListByUserID(userID, repository.NotificationListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 50}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.NotificationItem, 0, len(items))
	for _, item := range items {
		res = append(res, usecase.NotificationItem{ID: strconv.FormatUint(uint64(item.ID), 10), Title: item.Title, Message: item.Message, IsRead: item.IsRead, CreatedAt: item.CreatedAt.Format("2006-01-02T15:04:05Z07:00")})
	}
	return res, nil
}
func (u *NotificationUsecase) MarkAsRead(userID uuid.UUID, id string) error {
	notificationID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return apperr.BadRequest("invalid notification id")
	}
	item, err := u.repo.FindByIDForUser(uint(notificationID), userID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("notification", id)
		}
		return apperr.Internal(err)
	}
	item.MarkAsRead()
	if err := u.repo.Save(item); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

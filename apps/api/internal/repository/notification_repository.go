package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type NotificationRepository interface {
	ListByUserID(userID uuid.UUID, filter NotificationListFilter) ([]model.Notification, int64, error)
	FindByIDForUser(id uint, userID uuid.UUID) (*model.Notification, error)
	Save(notification *model.Notification) error
}

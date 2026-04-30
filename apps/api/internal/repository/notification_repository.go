package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type NotificationRepository interface {
	ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.NotificationListFilter) ([]domain.Notification, int64, error)
	FindByIDForUser(ctx context.Context, id uint, userID uuid.UUID) (*domain.Notification, error)
	Save(ctx context.Context, notification *domain.Notification) error
}

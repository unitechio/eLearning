package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type NotificationRepository interface {
	ListByUserID(userID uuid.UUID, filter dto.NotificationListFilter) ([]domain.Notification, int64, error)
	FindByIDForUser(id uint, userID uuid.UUID) (*domain.Notification, error)
	Save(notification *domain.Notification) error
	SendNotification(ctx context.Context, notification *domain.Notification) error
	SendNotificationFromTemplate(ctx context.Context, userID, templateName string, variables map[string]string) error
	SendBulkNotification(ctx context.Context, userIDs []string, notification *domain.Notification) error
	GetNotification(ctx context.Context, id string) (*domain.Notification, error)
	GetUserNotifications(ctx context.Context, userID string, filter domain.NotificationFilter) ([]*domain.Notification, int64, error)
	GetUnreadCount(ctx context.Context, userID string) (int64, error)
	MarkAsRead(ctx context.Context, id string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	DeleteNotification(ctx context.Context, id string) error
	CleanupOldNotifications(ctx context.Context, retentionDays int) error
	GetUserPreferences(ctx context.Context, userID string) (*domain.NotificationPreference, error)
	UpdateUserPreferences(ctx context.Context, userID string, preferences *domain.NotificationPreference) error
}

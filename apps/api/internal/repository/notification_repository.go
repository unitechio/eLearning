package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type NotificationRepository interface {
	ListByUserID(userID uuid.UUID, filter NotificationListFilter) ([]model.Notification, int64, error)
	FindByIDForUser(id uint, userID uuid.UUID) (*model.Notification, error)
	Save(notification *model.Notification) error
	SendNotification(ctx context.Context, notification *model.Notification) error
	SendNotificationFromTemplate(ctx context.Context, userID, templateName string, variables map[string]string) error
	SendBulkNotification(ctx context.Context, userIDs []string, notification *model.Notification) error
	GetNotification(ctx context.Context, id string) (*model.Notification, error)
	GetUserNotifications(ctx context.Context, userID string, filter model.NotificationFilter) ([]*model.Notification, int64, error)
	GetUnreadCount(ctx context.Context, userID string) (int64, error)
	MarkAsRead(ctx context.Context, id string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	DeleteNotification(ctx context.Context, id string) error
	CleanupOldNotifications(ctx context.Context, retentionDays int) error
	GetUserPreferences(ctx context.Context, userID string) (*model.NotificationPreference, error)
	UpdateUserPreferences(ctx context.Context, userID string, preferences *model.NotificationPreference) error
}

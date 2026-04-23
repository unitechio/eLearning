package impl

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"gorm.io/gorm"
)

type NotificationRepository struct{ db *gorm.DB }

func NewNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}
func (r *NotificationRepository) ListByUserID(userID uuid.UUID, filter dto.NotificationListFilter) ([]domain.Notification, int64, error) {
	var items []domain.Notification
	var total int64
	q := r.db.Model(&domain.Notification{}).Where("user_id = ? or user_id is null", userID)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(title) like ? or lower(message) like ?", like, like)
	}
	if filter.Category != "" {
		q = q.Where("category = ?", filter.Category)
	}
	if filter.IsRead != nil {
		q = q.Where("is_read = ?", *filter.IsRead)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}
func (r *NotificationRepository) FindByIDForUser(id uint, userID uuid.UUID) (*domain.Notification, error) {
	var item domain.Notification
	if err := r.db.Where("id = ? and (user_id = ? or user_id is null)", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *NotificationRepository) Save(notification *domain.Notification) error {
	return r.db.Save(notification).Error
}

func (r *NotificationRepository) Create(ctx context.Context, notification *domain.Notification) error {
	return r.db.WithContext(ctx).Create(notification).Error
}

func (r *NotificationRepository) GetByID(ctx context.Context, id string) (*domain.Notification, error) {
	var notification domain.Notification
	err := r.db.WithContext(ctx).First(&notification, "id = ?", id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("notification not found")
		}
		return nil, err
	}

	return &notification, nil
}

func (r *NotificationRepository) GetByUserID(ctx context.Context, userID uuid.UUID, filter domain.NotificationFilter) ([]*domain.Notification, int64, error) {
	filter.UserID = &userID
	return r.List(ctx, filter)
}

func (r *NotificationRepository) List(ctx context.Context, filter domain.NotificationFilter) ([]*domain.Notification, int64, error) {
	var notifications []*domain.Notification
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Notification{})

	if filter.UserID != nil {
		query = query.Where("user_id = ?", *filter.UserID)
	}

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}

	if filter.Channel != nil {
		query = query.Where("channel = ?", *filter.Channel)
	}

	if filter.Priority != nil {
		query = query.Where("priority = ?", *filter.Priority)
	}

	if filter.IsRead != nil {
		query = query.Where("is_read = ?", *filter.IsRead)
	}

	if filter.IsSent != nil {
		query = query.Where("is_sent = ?", *filter.IsSent)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (filter.Page - 1) * filter.PageSize
	query = query.Offset(offset).Limit(filter.PageSize)

	query = query.Order("created_at DESC")

	if err := query.Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}

func (r *NotificationRepository) Update(ctx context.Context, notification *domain.Notification) error {
	return r.db.WithContext(ctx).Save(notification).Error
}

func (r *NotificationRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Notification{}, "id = ?", id).Error
}

func (r *NotificationRepository) MarkAsRead(ctx context.Context, id string) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.Notification{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_read": true,
			"read_at": now,
		}).Error
}

func (r *NotificationRepository) MarkAllAsRead(ctx context.Context, userID string) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.Notification{}).
		Where("user_id = ? AND is_read = false", userID).
		Updates(map[string]interface{}{
			"is_read": true,
			"read_at": now,
		}).Error
}

func (r *NotificationRepository) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.Notification{}).
		Where("user_id = ? AND is_read = false", userID).
		Count(&count).Error

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *NotificationRepository) DeleteOlderThan(ctx context.Context, duration time.Duration) error {
	cutoff := time.Now().Add(-duration)
	return r.db.WithContext(ctx).
		Where("created_at < ?", cutoff).
		Delete(&domain.Notification{}).Error
}

func (r *NotificationRepository) DeleteExpired(ctx context.Context) error {
	return r.db.WithContext(ctx).
		Where("expires_at IS NOT NULL AND expires_at < ?", time.Now()).
		Delete(&domain.Notification{}).Error
}

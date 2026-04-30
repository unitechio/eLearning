package impl

import (
	"context"
	"strings"

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

func (r *NotificationRepository) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.NotificationListFilter) ([]domain.Notification, int64, error) {
	var items []domain.Notification
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.Notification{}).Where("user_id = ? or user_id is null", userID)
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
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *NotificationRepository) FindByIDForUser(ctx context.Context, id uint, userID uuid.UUID) (*domain.Notification, error) {
	var item domain.Notification
	if err := r.db.WithContext(ctx).Where("id = ? and (user_id = ? or user_id is null)", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *NotificationRepository) Save(ctx context.Context, notification *domain.Notification) error {
	return r.db.WithContext(ctx).Save(notification).Error
}

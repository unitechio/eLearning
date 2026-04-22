package impl

import (
	"context"
	"fmt"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type SessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) Create(ctx context.Context, session *model.Session) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *SessionRepository) GetByToken(ctx context.Context, token string) (*model.Session, error) {
	var session model.Session
	err := r.db.WithContext(ctx).
		First(&session, "token = ?", token).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("session not found")
		}
		return nil, err
	}

	return &session, nil
}

func (r *SessionRepository) GetByUserID(ctx context.Context, userID string) ([]*model.Session, error) {
	var sessions []*model.Session
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND is_active = true", userID).
		Order("last_activity DESC").
		Find(&sessions).Error

	if err != nil {
		return nil, err
	}

	return sessions, nil
}

func (r *SessionRepository) Update(ctx context.Context, session *model.Session) error {
	return r.db.WithContext(ctx).Save(session).Error
}

func (r *SessionRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.Session{}, "id = ?", id).Error
}

func (r *SessionRepository) DeleteByToken(ctx context.Context, token string) error {
	return r.db.WithContext(ctx).Delete(&model.Session{}, "token = ?", token).Error
}

func (r *SessionRepository) DeleteAllForUser(ctx context.Context, userID string) error {
	return r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Delete(&model.Session{}).Error
}

func (r *SessionRepository) DeleteExpired(ctx context.Context) error {
	return r.db.WithContext(ctx).
		Where("expires_at < ? OR (is_active = false)", time.Now()).
		Delete(&model.Session{}).Error
}

func (r *SessionRepository) UpdateActivity(ctx context.Context, token string) error {
	return r.db.WithContext(ctx).
		Model(&model.Session{}).
		Where("token = ?", token).
		Update("last_activity", time.Now()).Error
}

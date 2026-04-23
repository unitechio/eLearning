package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type SessionRepository interface {
	Create(ctx context.Context, session *domain.Session) error
	GetByToken(ctx context.Context, token string) (*domain.Session, error)
	GetByUserID(ctx context.Context, userID string) ([]*domain.Session, error)
	Update(ctx context.Context, session *domain.Session) error
	Delete(ctx context.Context, id string) error
	DeleteByToken(ctx context.Context, token string) error
	DeleteAllForUser(ctx context.Context, userID string) error
	DeleteExpired(ctx context.Context) error
	UpdateActivity(ctx context.Context, token string) error
}

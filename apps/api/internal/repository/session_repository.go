package repository

import (
	"context"
)

type SessionRepository interface {
	Create(ctx context.Context, session *model.Session) error
	GetByToken(ctx context.Context, token string) (*model.Session, error)
	GetByUserID(ctx context.Context, userID string) ([]*model.Session, error)
	Update(ctx context.Context, session *model.Session) error
	Delete(ctx context.Context, id string) error
	DeleteByToken(ctx context.Context, token string) error
	DeleteAllForUser(ctx context.Context, userID string) error
	DeleteExpired(ctx context.Context) error
	UpdateActivity(ctx context.Context, token string) error
}

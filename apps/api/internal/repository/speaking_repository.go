package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type SpeakingRepository interface {
	CreateSession(ctx context.Context, session *domain.SpeakingSession) error
	FindSessionByIDForUser(ctx context.Context, id, userID uuid.UUID) (*domain.SpeakingSession, error)
	FindLatestActiveSessionByUser(ctx context.Context, userID uuid.UUID) (*domain.SpeakingSession, error)
	UpdateSession(ctx context.Context, session *domain.SpeakingSession) error
}

package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type SpeakingRepository interface {
	CreateSession(session *domain.SpeakingSession) error
	FindSessionByIDForUser(id, userID uuid.UUID) (*domain.SpeakingSession, error)
	FindLatestActiveSessionByUser(userID uuid.UUID) (*domain.SpeakingSession, error)
	UpdateSession(session *domain.SpeakingSession) error
}

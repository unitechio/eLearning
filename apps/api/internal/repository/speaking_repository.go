package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type SpeakingRepository interface {
	CreateSession(session *model.SpeakingSession) error
	FindSessionByIDForUser(id, userID uuid.UUID) (*model.SpeakingSession, error)
	FindLatestActiveSessionByUser(userID uuid.UUID) (*model.SpeakingSession, error)
	UpdateSession(session *model.SpeakingSession) error
}

package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type WritingRepository interface {
	CreateSubmission(submission *domain.WritingSubmission) error
	FindSubmissionByIDForUser(id, userID uuid.UUID) (*domain.WritingSubmission, error)
	ListSubmissionsByUser(userID uuid.UUID, limit, offset int) ([]domain.WritingSubmission, int64, error)
}

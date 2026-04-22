package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type WritingRepository interface {
	CreateSubmission(submission *model.WritingSubmission) error
	FindSubmissionByIDForUser(id, userID uuid.UUID) (*model.WritingSubmission, error)
	ListSubmissionsByUser(userID uuid.UUID, limit, offset int) ([]model.WritingSubmission, int64, error)
}

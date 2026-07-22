package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

// WritingRepository defines the data access layer for writing submissions.
type WritingRepository interface {
	// Student-facing
	CreateSubmission(submission *domain.WritingSubmission) error
	FindSubmissionByIDForUser(id, userID uuid.UUID) (*domain.WritingSubmission, error)
	ListSubmissionsByUser(userID uuid.UUID, limit, offset int) ([]domain.WritingSubmission, int64, error)

	// Admin-facing
	FindSubmissionByID(id uuid.UUID) (*domain.WritingSubmission, error)
	ListAllSubmissions(limit, offset int) ([]domain.WritingSubmission, int64, error)
	UpdateSubmission(submission *domain.WritingSubmission) error
}

package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

// WritingRepository defines the data access layer for writing submissions.
type WritingRepository interface {
	// Student-facing
	CreateSubmission(ctx context.Context, submission *domain.WritingSubmission) error
	FindSubmissionByIDForUser(ctx context.Context, id, userID uuid.UUID) (*domain.WritingSubmission, error)
	ListSubmissionsByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]domain.WritingSubmission, int64, error)

	// Admin-facing
	FindSubmissionByID(ctx context.Context, id uuid.UUID) (*domain.WritingSubmission, error)
	ListAllSubmissions(ctx context.Context, limit, offset int) ([]domain.WritingSubmission, int64, error)
	UpdateSubmission(ctx context.Context, submission *domain.WritingSubmission) error
}

package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type ActivityRepository interface {
	CreateActivity(ctx context.Context, activity *domain.Activity) error
	FindActivityByID(ctx context.Context, id uuid.UUID) (*domain.Activity, error)
	UpdateActivity(ctx context.Context, activity *domain.Activity) error
	DeleteActivity(ctx context.Context, id uuid.UUID) error
	CreateSubmission(ctx context.Context, submission *domain.ActivitySubmission) error
	ListSubmissionsByActivity(ctx context.Context, activityID uuid.UUID, filter ActivitySubmissionListFilter) ([]domain.ActivitySubmission, int64, error)
	ListSubmissionsByUser(ctx context.Context, userID uuid.UUID, filter ActivitySubmissionUserFilter) ([]domain.ActivitySubmission, error)
	FindSubmissionByID(ctx context.Context, id uuid.UUID) (*domain.ActivitySubmission, error)
}

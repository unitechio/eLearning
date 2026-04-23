package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type ActivityRepository interface {
	CreateActivity(activity *domain.Activity) error
	FindActivityByID(id uuid.UUID) (*domain.Activity, error)
	UpdateActivity(activity *domain.Activity) error
	DeleteActivity(id uuid.UUID) error
	CreateSubmission(submission *domain.ActivitySubmission) error
	ListSubmissionsByActivity(activityID uuid.UUID, filter ActivitySubmissionListFilter) ([]domain.ActivitySubmission, int64, error)
	ListSubmissionsByUser(userID uuid.UUID, filter ActivitySubmissionUserFilter) ([]domain.ActivitySubmission, error)
	FindSubmissionByID(id uuid.UUID) (*domain.ActivitySubmission, error)
}

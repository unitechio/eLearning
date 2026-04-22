package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type ActivityRepository interface {
	CreateActivity(activity *model.Activity) error
	FindActivityByID(id uuid.UUID) (*model.Activity, error)
	UpdateActivity(activity *model.Activity) error
	DeleteActivity(id uuid.UUID) error
	CreateSubmission(submission *model.ActivitySubmission) error
	ListSubmissionsByActivity(activityID uuid.UUID, filter ActivitySubmissionListFilter) ([]model.ActivitySubmission, int64, error)
	ListSubmissionsByUser(userID uuid.UUID, filter ActivitySubmissionUserFilter) ([]model.ActivitySubmission, error)
	FindSubmissionByID(id uuid.UUID) (*model.ActivitySubmission, error)
}

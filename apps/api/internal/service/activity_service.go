package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type ActivityService interface {
	GetActivity(id string) (*dto.Activity, error)
	CreateActivity(req dto.UpsertActivityRequest) (*dto.Activity, error)
	UpdateActivity(id string, req dto.UpsertActivityRequest) (*dto.Activity, error)
	DeleteActivity(id string) error
	SubmitActivity(id string, userID uuid.UUID, req dto.SubmitActivityRequest) (*dto.Submission, error)
	ListActivitySubmissions(id string, query dto.ActivitySubmissionListQuery) (*dto.PageResult[dto.Submission], error)
	GetSubmission(id string) (*dto.Submission, error)
}

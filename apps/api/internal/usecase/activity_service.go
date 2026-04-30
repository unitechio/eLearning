package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type ActivityService interface {
	GetActivity(ctx context.Context, userID uuid.UUID, id string) (*dto.Activity, error)
	CreateActivity(ctx context.Context, actorID uuid.UUID, req dto.UpsertActivityRequest) (*dto.Activity, error)
	UpdateActivity(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertActivityRequest) (*dto.Activity, error)
	DeleteActivity(ctx context.Context, actorID uuid.UUID, id string) error
	SubmitActivity(ctx context.Context, id string, userID uuid.UUID, req dto.SubmitActivityRequest) (*dto.Submission, error)
	ListActivitySubmissions(ctx context.Context, userID uuid.UUID, id string, query dto.ActivitySubmissionListQuery) (*dto.PageResult[dto.Submission], error)
	GetSubmission(ctx context.Context, userID uuid.UUID, id string) (*dto.Submission, error)
}

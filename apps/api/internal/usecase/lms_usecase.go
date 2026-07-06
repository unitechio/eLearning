package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type LMSUsecase interface {
	GetMyDashboard(ctx context.Context, userID uuid.UUID) (*dto.LMSDashboardResponse, error)
	GetUserDashboard(ctx context.Context, userID string) (*dto.LMSDashboardResponse, error)
	UpsertDashboard(ctx context.Context, actorID uuid.UUID, userID string, req dto.UpsertLMSDashboardRequest) (*dto.LMSDashboardResponse, error)
	CreateEnrollment(ctx context.Context, actorID uuid.UUID, userID string, req dto.UpsertLMSEnrollmentRequest) (*dto.LMSEnrollmentItem, error)
	UpdateEnrollment(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertLMSEnrollmentRequest) (*dto.LMSEnrollmentItem, error)
	DeleteEnrollment(ctx context.Context, actorID uuid.UUID, id string) error
}

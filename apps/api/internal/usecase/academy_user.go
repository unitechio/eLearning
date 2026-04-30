package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type UserInsightsService interface {
	GetProgress(ctx context.Context, userID uuid.UUID) ([]dto.UserProgress, error)
	GetStats(ctx context.Context, userID uuid.UUID) (*dto.UserStats, error)
	GetActivities(ctx context.Context, userID uuid.UUID, query dto.UserActivityListQuery) (*dto.PageResult[dto.UserActivityItem], error)
}

type ProgressService interface {
	GetOverall(ctx context.Context, userID uuid.UUID) (*dto.ProgressSnapshot, error)
	GetCourseProgress(ctx context.Context, userID uuid.UUID, courseID string) (map[string]any, error)
	GetActivityProgress(ctx context.Context, userID uuid.UUID, activityID string) (map[string]any, error)
}

type PlannerService interface {
	GetPlanner(ctx context.Context, userID uuid.UUID) (*dto.Planner, error)
	GeneratePlanner(ctx context.Context, userID uuid.UUID) (*dto.Planner, error)
	UpdatePlanner(ctx context.Context, userID uuid.UUID, req dto.PlannerUpdateRequest) (*dto.Planner, error)
}

type NotificationService interface {
	ListNotifications(ctx context.Context, userID uuid.UUID, query dto.NotificationListQuery) (*dto.PageResult[dto.NotificationItem], error)
	MarkAsRead(ctx context.Context, userID uuid.UUID, id string) error
}

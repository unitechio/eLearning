package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type UserInsightsService interface {
	GetProgress(userID uuid.UUID) ([]dto.UserProgress, error)
	GetStats(userID uuid.UUID) (*dto.UserStats, error)
	GetActivities(userID uuid.UUID, query dto.UserActivityListQuery) (*dto.PageResult[dto.UserActivityItem], error)
}

type ProgressService interface {
	GetOverall(userID uuid.UUID) (*dto.ProgressSnapshot, error)
	GetCourseProgress(userID uuid.UUID, courseID string) (map[string]any, error)
	GetActivityProgress(userID uuid.UUID, activityID string) (map[string]any, error)
}

type PlannerService interface {
	GetPlanner(userID uuid.UUID) (*dto.Planner, error)
	GeneratePlanner(userID uuid.UUID) (*dto.Planner, error)
	UpdatePlanner(userID uuid.UUID, req dto.PlannerUpdateRequest) (*dto.Planner, error)
}

type NotificationService interface {
	ListNotifications(userID uuid.UUID, query dto.NotificationListQuery) (*dto.PageResult[dto.NotificationItem], error)
	MarkAsRead(userID uuid.UUID, id string) error
}

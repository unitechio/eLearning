package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type CourseProgressView struct {
	CourseID         uuid.UUID
	CourseTitle      string
	CompletedLessons int64
	TotalLessons     int64
	AverageScore     float64
	LastActivityAt   *domain.UserProgress
}

type ProgressRepository interface {
	ListCourseProgressByUser(ctx context.Context, userID uuid.UUID) ([]CourseProgressView, error)
	GetAverageScoreByUser(ctx context.Context, userID uuid.UUID) (float64, error)
	GetCompletedCoursesCountByUser(ctx context.Context, userID uuid.UUID) (int64, error)
	ListRecentProgressByUser(ctx context.Context, userID uuid.UUID, limit int) ([]domain.UserProgress, error)
	GetCourseProgress(ctx context.Context, userID, courseID uuid.UUID) (*CourseProgressView, error)
	GetLessonProgressByUser(ctx context.Context, userID uuid.UUID) ([]domain.UserProgress, error)
}

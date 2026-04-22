package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type CourseProgressView struct {
	CourseID         uuid.UUID
	CourseTitle      string
	CompletedLessons int64
	TotalLessons     int64
	AverageScore     float64
	LastActivityAt   *model.UserProgress
}

type ProgressRepository interface {
	ListCourseProgressByUser(userID uuid.UUID) ([]CourseProgressView, error)
	GetAverageScoreByUser(userID uuid.UUID) (float64, error)
	GetCompletedCoursesCountByUser(userID uuid.UUID) (int64, error)
	ListRecentProgressByUser(userID uuid.UUID, limit int) ([]model.UserProgress, error)
	GetCourseProgress(userID, courseID uuid.UUID) (*CourseProgressView, error)
	GetLessonProgressByUser(userID uuid.UUID) ([]model.UserProgress, error)
}

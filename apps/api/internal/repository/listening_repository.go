package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type ListeningRepository interface {
	ListLessons(ctx context.Context, filter ListeningLessonListFilter) ([]domain.ListeningLesson, int64, error)
	FindLessonByID(ctx context.Context, id uuid.UUID) (*domain.ListeningLesson, error)
}

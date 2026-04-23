package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type ListeningRepository interface {
	ListLessons(filter ListeningLessonListFilter) ([]domain.ListeningLesson, int64, error)
	FindLessonByID(id uuid.UUID) (*domain.ListeningLesson, error)
}

package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type ListeningLessonListFilter struct {
	Pagination
	Search string
	Level  string
	Domain string
}

type ListeningRepository interface {
	ListLessons(filter ListeningLessonListFilter) ([]model.ListeningLesson, int64, error)
	FindLessonByID(id uuid.UUID) (*model.ListeningLesson, error)
}

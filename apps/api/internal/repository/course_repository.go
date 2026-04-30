package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type CourseRepository interface {
	ListCourses(ctx context.Context, filter CourseListFilter) ([]domain.Course, int64, error)
	CreateCourse(ctx context.Context, course *domain.Course) error
	FindCourseByID(ctx context.Context, id uuid.UUID) (*domain.Course, error)
	UpdateCourse(ctx context.Context, course *domain.Course) error
	DeleteCourse(ctx context.Context, id uuid.UUID) error
	ListUnitsByCourse(ctx context.Context, courseID uuid.UUID, filter UnitListFilter) ([]domain.Unit, int64, error)
	CreateUnit(ctx context.Context, unit *domain.Unit) error
	FindUnitByID(ctx context.Context, id uuid.UUID) (*domain.Unit, error)
	UpdateUnit(ctx context.Context, unit *domain.Unit) error
	DeleteUnit(ctx context.Context, id uuid.UUID) error
	ListLessonsByUnit(ctx context.Context, unitID uuid.UUID, filter LessonListFilter) ([]domain.Lesson, int64, error)
	CreateLesson(ctx context.Context, lesson *domain.Lesson) error
	FindLessonByID(ctx context.Context, id uuid.UUID) (*domain.Lesson, error)
	UpdateLesson(ctx context.Context, lesson *domain.Lesson) error
	DeleteLesson(ctx context.Context, id uuid.UUID) error
}

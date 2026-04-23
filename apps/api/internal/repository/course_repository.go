package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type CourseRepository interface {
	ListCourses(filter CourseListFilter) ([]domain.Course, int64, error)
	CreateCourse(course *domain.Course) error
	FindCourseByID(id uuid.UUID) (*domain.Course, error)
	UpdateCourse(course *domain.Course) error
	DeleteCourse(id uuid.UUID) error
	ListUnitsByCourse(courseID uuid.UUID, filter UnitListFilter) ([]domain.Unit, int64, error)
	CreateUnit(unit *domain.Unit) error
	FindUnitByID(id uuid.UUID) (*domain.Unit, error)
	UpdateUnit(unit *domain.Unit) error
	DeleteUnit(id uuid.UUID) error
	ListLessonsByUnit(unitID uuid.UUID, filter LessonListFilter) ([]domain.Lesson, int64, error)
	CreateLesson(lesson *domain.Lesson) error
	FindLessonByID(id uuid.UUID) (*domain.Lesson, error)
	UpdateLesson(lesson *domain.Lesson) error
	DeleteLesson(id uuid.UUID) error
}

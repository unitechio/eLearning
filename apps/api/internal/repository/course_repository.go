package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type CourseRepository interface {
	ListCourses(filter CourseListFilter) ([]model.Course, int64, error)
	CreateCourse(course *model.Course) error
	FindCourseByID(id uuid.UUID) (*model.Course, error)
	UpdateCourse(course *model.Course) error
	DeleteCourse(id uuid.UUID) error
	ListUnitsByCourse(courseID uuid.UUID, filter UnitListFilter) ([]model.Unit, int64, error)
	CreateUnit(unit *model.Unit) error
	FindUnitByID(id uuid.UUID) (*model.Unit, error)
	UpdateUnit(unit *model.Unit) error
	DeleteUnit(id uuid.UUID) error
	ListLessonsByUnit(unitID uuid.UUID, filter LessonListFilter) ([]model.Lesson, int64, error)
	CreateLesson(lesson *model.Lesson) error
	FindLessonByID(id uuid.UUID) (*model.Lesson, error)
	UpdateLesson(lesson *model.Lesson) error
	DeleteLesson(id uuid.UUID) error
}

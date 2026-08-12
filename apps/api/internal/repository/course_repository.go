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

	// Course Categories
	ListCategories(ctx context.Context, tenantID uuid.UUID) ([]domain.CourseCategory, error)
	CreateCategory(ctx context.Context, category *domain.CourseCategory) error
	FindCategoryByID(ctx context.Context, id uuid.UUID) (*domain.CourseCategory, error)
	UpdateCategory(ctx context.Context, category *domain.CourseCategory) error
	DeleteCategory(ctx context.Context, id uuid.UUID) error

	// Course Resources
	ListResourcesByCourse(ctx context.Context, courseID uuid.UUID) ([]domain.CourseResource, error)
	CreateResource(ctx context.Context, resource *domain.CourseResource) error
	FindResourceByID(ctx context.Context, id uuid.UUID) (*domain.CourseResource, error)
	DeleteResource(ctx context.Context, id uuid.UUID) error

	// Course Reviews
	ListReviewsByCourse(ctx context.Context, courseID uuid.UUID) ([]domain.CourseReview, error)
	CreateReview(ctx context.Context, review *domain.CourseReview) error
}

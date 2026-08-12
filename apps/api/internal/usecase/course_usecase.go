package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type CourseService interface {
	ListCourses(ctx context.Context, userID uuid.UUID, query dto.CourseListQuery) (*dto.PageResult[dto.Course], error)
	CreateCourse(ctx context.Context, actorID uuid.UUID, req dto.UpsertCourseRequest) (*dto.Course, error)
	GetCourse(ctx context.Context, userID uuid.UUID, id string) (*dto.Course, error)
	UpdateCourse(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertCourseRequest) (*dto.Course, error)
	DeleteCourse(ctx context.Context, actorID uuid.UUID, id string) error
	ListCourseModules(ctx context.Context, userID uuid.UUID, courseID string, query dto.ModuleListQuery) (*dto.PageResult[dto.CourseModule], error)
	CreateModule(ctx context.Context, actorID uuid.UUID, req dto.UpsertModuleRequest) (*dto.CourseModule, error)
	UpdateModule(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertModuleRequest) (*dto.CourseModule, error)
	DeleteModule(ctx context.Context, actorID uuid.UUID, id string) error
	ListModuleLessons(ctx context.Context, userID uuid.UUID, moduleID string, query dto.LessonListQuery) (*dto.PageResult[dto.Lesson], error)
	CreateLesson(ctx context.Context, actorID uuid.UUID, req dto.UpsertLessonRequest) (*dto.Lesson, error)
	UpdateLesson(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertLessonRequest) (*dto.Lesson, error)
	DeleteLesson(ctx context.Context, actorID uuid.UUID, id string) error

	// Admin preview detail
	GetAdminCourseDetail(ctx context.Context, userID uuid.UUID, id string) (*dto.AdminCourseDetail, error)

	// Course Categories
	ListCategories(ctx context.Context, userID uuid.UUID) ([]dto.CourseCategory, error)
	CreateCategory(ctx context.Context, userID uuid.UUID, req dto.CourseCategoryPayload) (*dto.CourseCategory, error)
	UpdateCategory(ctx context.Context, userID uuid.UUID, id string, req dto.CourseCategoryPayload) (*dto.CourseCategory, error)
	DeleteCategory(ctx context.Context, userID uuid.UUID, id string) error

	// Course Resources
	ListResources(ctx context.Context, userID uuid.UUID, courseID string) ([]dto.CourseResource, error)
	CreateResource(ctx context.Context, userID uuid.UUID, courseID string, name string, storageKey string, mimeType string, sizeBytes int64) (*dto.CourseResource, error)
	DeleteResource(ctx context.Context, userID uuid.UUID, resourceID string) error

	// Course Reviews
	ListReviews(ctx context.Context, userID uuid.UUID, courseID string) ([]dto.CourseReview, error)
	CreateReview(ctx context.Context, userID uuid.UUID, courseID string, rating int, comment string) (*dto.CourseReview, error)
}

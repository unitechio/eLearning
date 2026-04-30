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
}

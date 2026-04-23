package usecase

import "github.com/unitechio/eLearning/apps/api/internal/dto"

type CourseService interface {
	ListCourses(query dto.CourseListQuery) (*dto.PageResult[dto.Course], error)
	CreateCourse(req dto.UpsertCourseRequest) (*dto.Course, error)
	GetCourse(id string) (*dto.Course, error)
	UpdateCourse(id string, req dto.UpsertCourseRequest) (*dto.Course, error)
	DeleteCourse(id string) error
	ListCourseModules(courseID string, query dto.ModuleListQuery) (*dto.PageResult[dto.CourseModule], error)
	CreateModule(req dto.UpsertModuleRequest) (*dto.CourseModule, error)
	UpdateModule(id string, req dto.UpsertModuleRequest) (*dto.CourseModule, error)
	DeleteModule(id string) error
	ListModuleLessons(moduleID string, query dto.LessonListQuery) (*dto.PageResult[dto.Lesson], error)
	CreateLesson(req dto.UpsertLessonRequest) (*dto.Lesson, error)
	UpdateLesson(id string, req dto.UpsertLessonRequest) (*dto.Lesson, error)
	DeleteLesson(id string) error
}

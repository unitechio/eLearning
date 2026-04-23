package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type CourseUsecase struct{ repo repository.CourseRepository }

func NewCourseUsecase(repo repository.CourseRepository) *CourseUsecase {
	return &CourseUsecase{repo: repo}
}

func (u *CourseUsecase) ListCourses() ([]usecase.Course, error) {
	items, _, err := u.repo.ListCourses(repository.CourseListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.Course, 0, len(items))
	for _, item := range items {
		res = append(res, mapCourse(item))
	}
	return res, nil
}
func (u *CourseUsecase) CreateCourse(req usecase.UpsertCourseRequest) (*usecase.Course, error) {
	item := &domain.Course{TenantID: uuid.Nil, Title: req.Title, Description: req.Description, Domain: req.Domain, Level: req.Level, Status: fallback(req.Status, "draft")}
	if err := u.repo.CreateCourse(item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}
func (u *CourseUsecase) GetCourse(id string) (*usecase.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := u.repo.FindCourseByID(courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}
func (u *CourseUsecase) UpdateCourse(id string, req usecase.UpsertCourseRequest) (*usecase.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := u.repo.FindCourseByID(courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	item.Title, item.Description, item.Domain = req.Title, req.Description, req.Domain
	item.Level, item.Status = req.Level, fallback(req.Status, item.Status)
	if err := u.repo.UpdateCourse(item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}
func (u *CourseUsecase) DeleteCourse(id string) error {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid course id")
	}
	if err := u.repo.DeleteCourse(courseID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}
func (u *CourseUsecase) ListCourseModules(courseID string) ([]usecase.CourseModule, error) {
	id, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	items, _, err := u.repo.ListUnitsByCourse(id, repository.UnitListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.CourseModule, 0, len(items))
	for _, item := range items {
		res = append(res, usecase.CourseModule{ID: item.ID.String(), CourseID: item.CourseID.String(), Title: item.Title, Order: item.OrderIndex})
	}
	return res, nil
}
func (u *CourseUsecase) CreateModule(req usecase.UpsertModuleRequest) (*usecase.CourseModule, error) {
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	unit := &domain.Unit{CourseID: courseID, TenantID: uuid.Nil, Title: req.Title, OrderIndex: req.Order}
	if err := u.repo.CreateUnit(unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &usecase.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}
func (u *CourseUsecase) UpdateModule(id string, req usecase.UpsertModuleRequest) (*usecase.CourseModule, error) {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	unit, err := u.repo.FindUnitByID(unitID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("module", id)
		}
		return nil, apperr.Internal(err)
	}
	unit.CourseID, unit.Title, unit.OrderIndex = courseID, req.Title, req.Order
	if err := u.repo.UpdateUnit(unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &usecase.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}
func (u *CourseUsecase) DeleteModule(id string) error {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid module id")
	}
	if err := u.repo.DeleteUnit(unitID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}
func (u *CourseUsecase) ListModuleLessons(moduleID string) ([]usecase.Lesson, error) {
	id, err := uuid.Parse(moduleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	items, _, err := u.repo.ListLessonsByUnit(id, repository.LessonListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.Lesson, 0, len(items))
	for _, item := range items {
		res = append(res, usecase.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex})
	}
	return res, nil
}
func (u *CourseUsecase) CreateLesson(req usecase.UpsertLessonRequest) (*usecase.Lesson, error) {
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	item := &domain.Lesson{UnitID: moduleID, TenantID: uuid.Nil, Title: req.Title, ContentType: "markdown", Content: req.Content, OrderIndex: req.Order}
	if err := u.repo.CreateLesson(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &usecase.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}
func (u *CourseUsecase) UpdateLesson(id string, req usecase.UpsertLessonRequest) (*usecase.Lesson, error) {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid lesson id")
	}
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	item, err := u.repo.FindLessonByID(lessonID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("lesson", id)
		}
		return nil, apperr.Internal(err)
	}
	item.UnitID, item.Title, item.Content, item.OrderIndex = moduleID, req.Title, req.Content, req.Order
	if err := u.repo.UpdateLesson(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &usecase.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}
func (u *CourseUsecase) DeleteLesson(id string) error {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid lesson id")
	}
	if err := u.repo.DeleteLesson(lessonID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func mapCourse(item domain.Course) usecase.Course {
	return usecase.Course{ID: item.ID.String(), Title: item.Title, Description: item.Description, Domain: item.Domain, Level: item.Level, Status: item.Status}
}

func fallback(v, def string) string {
	if v == "" {
		return def
	}
	return v
}

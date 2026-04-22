package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type CourseService struct{ repo repository.CourseRepository }

func NewCourseService(repo repository.CourseRepository) *CourseService {
	return &CourseService{repo: repo}
}

func (s *CourseService) ListCourses(query dto.CourseListQuery) (*dto.PageResult[dto.Course], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListCourses(repository.CourseListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Domain:     query.Domain,
		Level:      query.Level,
		Status:     query.Status,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.Course, 0, len(items))
	for _, item := range items {
		res = append(res, mapCourse(item))
	}
	return &dto.PageResult[dto.Course]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *CourseService) CreateCourse(req dto.UpsertCourseRequest) (*dto.Course, error) {
	item := &model.Course{TenantID: uuid.Nil, Title: req.Title, Description: req.Description, Domain: req.Domain, Level: req.Level, Status: fallback(req.Status, "draft")}
	if err := s.repo.CreateCourse(item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseService) GetCourse(id string) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.repo.FindCourseByID(courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseService) UpdateCourse(id string, req dto.UpsertCourseRequest) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.repo.FindCourseByID(courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	item.Title, item.Description, item.Domain = req.Title, req.Description, req.Domain
	item.Level, item.Status = req.Level, fallback(req.Status, item.Status)
	if err := s.repo.UpdateCourse(item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseService) DeleteCourse(id string) error {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid course id")
	}
	if err := s.repo.DeleteCourse(courseID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *CourseService) ListCourseModules(courseID string, query dto.ModuleListQuery) (*dto.PageResult[dto.CourseModule], error) {
	id, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListUnitsByCourse(id, repository.UnitListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.CourseModule, 0, len(items))
	for _, item := range items {
		res = append(res, dto.CourseModule{ID: item.ID.String(), CourseID: item.CourseID.String(), Title: item.Title, Order: item.OrderIndex})
	}
	return &dto.PageResult[dto.CourseModule]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *CourseService) CreateModule(req dto.UpsertModuleRequest) (*dto.CourseModule, error) {
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	unit := &model.Unit{CourseID: courseID, TenantID: uuid.Nil, Title: req.Title, OrderIndex: req.Order}
	if err := s.repo.CreateUnit(unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}

func (s *CourseService) UpdateModule(id string, req dto.UpsertModuleRequest) (*dto.CourseModule, error) {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	unit, err := s.repo.FindUnitByID(unitID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("module", id)
		}
		return nil, apperr.Internal(err)
	}
	unit.CourseID, unit.Title, unit.OrderIndex = courseID, req.Title, req.Order
	if err := s.repo.UpdateUnit(unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}

func (s *CourseService) DeleteModule(id string) error {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid module id")
	}
	if err := s.repo.DeleteUnit(unitID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *CourseService) ListModuleLessons(moduleID string, query dto.LessonListQuery) (*dto.PageResult[dto.Lesson], error) {
	id, err := uuid.Parse(moduleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListLessonsByUnit(id, repository.LessonListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.Lesson, 0, len(items))
	for _, item := range items {
		res = append(res, dto.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex})
	}
	return &dto.PageResult[dto.Lesson]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *CourseService) CreateLesson(req dto.UpsertLessonRequest) (*dto.Lesson, error) {
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	item := &model.Lesson{UnitID: moduleID, TenantID: uuid.Nil, Title: req.Title, ContentType: "markdown", Content: req.Content, OrderIndex: req.Order}
	if err := s.repo.CreateLesson(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}

func (s *CourseService) UpdateLesson(id string, req dto.UpsertLessonRequest) (*dto.Lesson, error) {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid lesson id")
	}
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	item, err := s.repo.FindLessonByID(lessonID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("lesson", id)
		}
		return nil, apperr.Internal(err)
	}
	item.UnitID, item.Title, item.Content, item.OrderIndex = moduleID, req.Title, req.Content, req.Order
	if err := s.repo.UpdateLesson(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}

func (s *CourseService) DeleteLesson(id string) error {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid lesson id")
	}
	if err := s.repo.DeleteLesson(lessonID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func mapCourse(item model.Course) dto.Course {
	return dto.Course{ID: item.ID.String(), Title: item.Title, Description: item.Description, Domain: item.Domain, Level: item.Level, Status: item.Status}
}

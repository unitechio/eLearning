package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type CourseUsecase struct {
	repo  repository.CourseRepository
	authz usecase.AuthorizationService
}

func NewCourseService(repo repository.CourseRepository, authz usecase.AuthorizationService) *CourseUsecase {
	return &CourseUsecase{repo: repo, authz: authz}
}

func (s *CourseUsecase) ListCourses(ctx context.Context, userID uuid.UUID, query dto.CourseListQuery) (*dto.PageResult[dto.Course], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	tenantID, err := s.authz.GetTenantID(ctx, userID)
	if err != nil {
		return nil, err
	}
	items, _, err := s.repo.ListCourses(ctx, repository.CourseListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		TenantID:   tenantID,
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
		if err := s.authz.CanReadCourse(ctx, userID, &item); err != nil {
			continue
		}
		res = append(res, mapCourse(item))
	}
	return &dto.PageResult[dto.Course]{Items: res, Meta: buildMeta(query.PaginationQuery, int64(len(res)))}, nil
}

func (s *CourseUsecase) CreateCourse(ctx context.Context, actorID uuid.UUID, req dto.UpsertCourseRequest) (*dto.Course, error) {
	tenantID, err := s.authz.GetTenantID(ctx, actorID)
	if err != nil {
		return nil, err
	}
	item := &domain.Course{
		TenantID:    tenantID,
		CreatedBy:   actorID,
		Title:       req.Title,
		Description: req.Description,
		Domain:      req.Domain,
		Level:       req.Level,
		Status:      fallback(req.Status, "draft"),
		Visibility:  fallback(req.Visibility, "private"),
	}
	if err := s.repo.CreateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseUsecase) GetCourse(ctx context.Context, userID uuid.UUID, id string) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.repo.FindCourseByID(ctx, courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanReadCourse(ctx, userID, item); err != nil {
		return nil, err
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseUsecase) UpdateCourse(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertCourseRequest) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.repo.FindCourseByID(ctx, courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, item); err != nil {
		return nil, err
	}
	item.Title, item.Description, item.Domain = req.Title, req.Description, req.Domain
	item.Level, item.Status, item.Visibility = req.Level, fallback(req.Status, item.Status), fallback(req.Visibility, item.Visibility)
	if err := s.repo.UpdateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *CourseUsecase) DeleteCourse(ctx context.Context, actorID uuid.UUID, id string) error {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid course id")
	}
	item, err := s.repo.FindCourseByID(ctx, courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("course", id)
		}
		return apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, item); err != nil {
		return err
	}
	if err := s.repo.DeleteCourse(ctx, courseID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *CourseUsecase) ListCourseModules(ctx context.Context, userID uuid.UUID, courseID string, query dto.ModuleListQuery) (*dto.PageResult[dto.CourseModule], error) {
	id, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	course, err := s.repo.FindCourseByID(ctx, id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", courseID)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanReadCourse(ctx, userID, course); err != nil {
		return nil, err
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListUnitsByCourse(ctx, id, repository.UnitListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		TenantID:   course.TenantID,
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

func (s *CourseUsecase) CreateModule(ctx context.Context, actorID uuid.UUID, req dto.UpsertModuleRequest) (*dto.CourseModule, error) {
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	course, err := s.repo.FindCourseByID(ctx, courseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return nil, err
	}
	unit := &domain.Unit{CourseID: courseID, TenantID: course.TenantID, Title: req.Title, OrderIndex: req.Order}
	if err := s.repo.CreateUnit(ctx, unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}

func (s *CourseUsecase) UpdateModule(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertModuleRequest) (*dto.CourseModule, error) {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	unit, err := s.repo.FindUnitByID(ctx, unitID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("module", id)
		}
		return nil, apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return nil, err
	}
	unit.CourseID, unit.Title, unit.OrderIndex = courseID, req.Title, req.Order
	if err := s.repo.UpdateUnit(ctx, unit); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseModule{ID: unit.ID.String(), CourseID: unit.CourseID.String(), Title: unit.Title, Order: unit.OrderIndex}, nil
}

func (s *CourseUsecase) DeleteModule(ctx context.Context, actorID uuid.UUID, id string) error {
	unitID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid module id")
	}
	unit, err := s.repo.FindUnitByID(ctx, unitID)
	if err != nil {
		return apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return err
	}
	if err := s.repo.DeleteUnit(ctx, unitID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *CourseUsecase) ListModuleLessons(ctx context.Context, userID uuid.UUID, moduleID string, query dto.LessonListQuery) (*dto.PageResult[dto.Lesson], error) {
	id, err := uuid.Parse(moduleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	unit, err := s.repo.FindUnitByID(ctx, id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("module", moduleID)
		}
		return nil, apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanReadCourse(ctx, userID, course); err != nil {
		return nil, err
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListLessonsByUnit(ctx, id, repository.LessonListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		TenantID:   unit.TenantID,
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

func (s *CourseUsecase) CreateLesson(ctx context.Context, actorID uuid.UUID, req dto.UpsertLessonRequest) (*dto.Lesson, error) {
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	unit, err := s.repo.FindUnitByID(ctx, moduleID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return nil, err
	}
	item := &domain.Lesson{UnitID: moduleID, TenantID: course.TenantID, Title: req.Title, ContentType: "markdown", Content: req.Content, OrderIndex: req.Order}
	if err := s.repo.CreateLesson(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}

func (s *CourseUsecase) UpdateLesson(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertLessonRequest) (*dto.Lesson, error) {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid lesson id")
	}
	moduleID, err := uuid.Parse(req.ModuleID)
	if err != nil {
		return nil, apperr.BadRequest("invalid module id")
	}
	item, err := s.repo.FindLessonByID(ctx, lessonID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("lesson", id)
		}
		return nil, apperr.Internal(err)
	}
	unit, err := s.repo.FindUnitByID(ctx, item.UnitID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return nil, err
	}
	item.UnitID, item.Title, item.Content, item.OrderIndex = moduleID, req.Title, req.Content, req.Order
	if err := s.repo.UpdateLesson(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.Lesson{ID: item.ID.String(), ModuleID: item.UnitID.String(), Title: item.Title, Content: item.Content, Order: item.OrderIndex}, nil
}

func (s *CourseUsecase) DeleteLesson(ctx context.Context, actorID uuid.UUID, id string) error {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid lesson id")
	}
	item, err := s.repo.FindLessonByID(ctx, lessonID)
	if err != nil {
		return apperr.Internal(err)
	}
	unit, err := s.repo.FindUnitByID(ctx, item.UnitID)
	if err != nil {
		return apperr.Internal(err)
	}
	course, err := s.repo.FindCourseByID(ctx, unit.CourseID)
	if err != nil {
		return apperr.Internal(err)
	}
	if err := s.authz.CanManageCourse(ctx, actorID, course); err != nil {
		return err
	}
	if err := s.repo.DeleteLesson(ctx, lessonID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func mapCourse(item domain.Course) dto.Course {
	return dto.Course{ID: item.ID.String(), Title: item.Title, Description: item.Description, Domain: item.Domain, Level: item.Level, Status: item.Status, Visibility: item.Visibility}
}

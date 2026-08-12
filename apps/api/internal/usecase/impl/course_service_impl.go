package impl

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"gorm.io/datatypes"
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

	var categoryID *uuid.UUID
	if req.CategoryID != nil && *req.CategoryID != "" {
		if u, err := uuid.Parse(*req.CategoryID); err == nil {
			categoryID = &u
		}
	}

	var instructorID *uuid.UUID
	if req.InstructorID != nil && *req.InstructorID != "" {
		if u, err := uuid.Parse(*req.InstructorID); err == nil {
			instructorID = &u
		}
	} else {
		instructorID = &actorID
	}

	whatYouLearnJSON, _ := json.Marshal(req.WhatYouLearn)
	if req.WhatYouLearn == nil {
		whatYouLearnJSON = []byte("[]")
	}

	item := &domain.Course{
		TenantID:        tenantID,
		CreatedBy:       actorID,
		Title:           req.Title,
		Subtitle:        req.Subtitle,
		Description:     req.Description,
		Domain:          req.Domain,
		Level:           req.Level,
		Status:          fallback(req.Status, "draft"),
		Visibility:      fallback(req.Visibility, "private"),
		Price:           req.Price,
		OriginalPrice:   req.OriginalPrice,
		Currency:        fallback(req.Currency, "USD"),
		ThumbnailURL:    req.ThumbnailURL,
		CategoryID:      categoryID,
		InstructorID:    instructorID,
		VideoPreviewURL: req.VideoPreviewURL,
		WhatYouLearn:    datatypes.JSON(whatYouLearnJSON),
		ToolsUsed:       req.ToolsUsed,
		HasCertificate:  req.HasCertificate,
	}

	if err := s.repo.CreateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}

	// reload to get Category preloaded
	reloaded, err := s.repo.FindCourseByID(ctx, item.ID)
	if err == nil {
		item = reloaded
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

	var categoryID *uuid.UUID
	if req.CategoryID != nil && *req.CategoryID != "" {
		if u, err := uuid.Parse(*req.CategoryID); err == nil {
			categoryID = &u
		}
	}

	var instructorID *uuid.UUID
	if req.InstructorID != nil && *req.InstructorID != "" {
		if u, err := uuid.Parse(*req.InstructorID); err == nil {
			instructorID = &u
		}
	}

	whatYouLearnJSON, _ := json.Marshal(req.WhatYouLearn)
	if req.WhatYouLearn == nil {
		whatYouLearnJSON = []byte("[]")
	}

	item.Title, item.Subtitle, item.Description, item.Domain = req.Title, req.Subtitle, req.Description, req.Domain
	item.Level, item.Status, item.Visibility = req.Level, fallback(req.Status, item.Status), fallback(req.Visibility, item.Visibility)
	item.Price, item.OriginalPrice, item.Currency, item.ThumbnailURL = req.Price, req.OriginalPrice, fallback(req.Currency, item.Currency), req.ThumbnailURL
	item.CategoryID = categoryID
	item.InstructorID = instructorID
	item.VideoPreviewURL = req.VideoPreviewURL
	item.WhatYouLearn = datatypes.JSON(whatYouLearnJSON)
	item.ToolsUsed = req.ToolsUsed
	item.HasCertificate = req.HasCertificate

	if err := s.repo.UpdateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}

	// reload to get Category preloaded
	reloaded, err := s.repo.FindCourseByID(ctx, item.ID)
	if err == nil {
		item = reloaded
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
	var whatYouLearn []string
	if len(item.WhatYouLearn) > 0 {
		_ = json.Unmarshal(item.WhatYouLearn, &whatYouLearn)
	}
	if whatYouLearn == nil {
		whatYouLearn = []string{}
	}

	var catIDStr, catName, catColor string
	if item.CategoryID != nil {
		catIDStr = item.CategoryID.String()
	}
	if item.Category != nil {
		catName = item.Category.Name
		catColor = item.Category.Color
	}

	var instIDStr string
	if item.InstructorID != nil {
		instIDStr = item.InstructorID.String()
	}

	return dto.Course{
		ID:              item.ID.String(),
		Title:           item.Title,
		Subtitle:        item.Subtitle,
		Description:     item.Description,
		Domain:          item.Domain,
		Level:           item.Level,
		Status:          item.Status,
		Visibility:      item.Visibility,
		Price:           item.Price,
		OriginalPrice:   item.OriginalPrice,
		Currency:        item.Currency,
		ThumbnailURL:    item.ThumbnailURL,
		CategoryID:      &catIDStr,
		CategoryName:    catName,
		CategoryColor:   catColor,
		InstructorID:    &instIDStr,
		InstructorName:  "Instructor",
		VideoPreviewURL: item.VideoPreviewURL,
		WhatYouLearn:    whatYouLearn,
		ToolsUsed:       item.ToolsUsed,
		HasCertificate:  item.HasCertificate,
		Rating:          item.Rating,
		ReviewCount:     item.ReviewCount,
		EnrollmentCount: item.EnrollmentCount,
	}
}

// Admin preview detail
func (s *CourseUsecase) GetAdminCourseDetail(ctx context.Context, userID uuid.UUID, id string) (*dto.AdminCourseDetail, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	course, err := s.repo.FindCourseByID(ctx, courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}

	// Fetch modules
	units, _, err := s.repo.ListUnitsByCourse(ctx, courseID, dto.UnitListFilter{Pagination: dto.Pagination{Page: 1, PageSize: 1000}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	modulesDto := make([]dto.CourseModule, len(units))
	for i, u := range units {
		modulesDto[i] = dto.CourseModule{
			ID:       u.ID.String(),
			CourseID: u.CourseID.String(),
			Title:    u.Title,
			Order:    u.OrderIndex,
		}
	}

	// Fetch resources
	resources, err := s.repo.ListResourcesByCourse(ctx, courseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	resourcesDto := make([]dto.CourseResource, len(resources))
	for i, r := range resources {
		resourcesDto[i] = dto.CourseResource{
			ID:         r.ID.String(),
			CourseID:   r.CourseID.String(),
			Name:       r.Name,
			StorageKey: r.StorageKey,
			MimeType:   r.MimeType,
			SizeBytes:  r.SizeBytes,
			UploadedBy: r.UploadedBy.String(),
			CreatedAt:  r.CreatedAt.Format(time.RFC3339),
		}
	}

	// Fetch reviews
	reviews, err := s.repo.ListReviewsByCourse(ctx, courseID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	reviewsDto := make([]dto.CourseReview, len(reviews))
	for i, rv := range reviews {
		userName := "Student"
		if rv.User != nil {
			userName = rv.User.FullName
			if userName == "" {
				userName = rv.User.Email
			}
		}
		reviewsDto[i] = dto.CourseReview{
			ID:        rv.ID.String(),
			CourseID:  rv.CourseID.String(),
			UserID:    rv.UserID.String(),
			UserName:  userName,
			Rating:    rv.Rating,
			Comment:   rv.Comment,
			CreatedAt: rv.CreatedAt.Format(time.RFC3339),
		}
	}

	return &dto.AdminCourseDetail{
		Course:    mapCourse(*course),
		Modules:   modulesDto,
		Resources: resourcesDto,
		Reviews:   reviewsDto,
	}, nil
}

// Course Categories
func (s *CourseUsecase) ListCategories(ctx context.Context, userID uuid.UUID) ([]dto.CourseCategory, error) {
	tenantID, err := s.authz.GetTenantID(ctx, userID)
	if err != nil {
		return nil, err
	}
	items, err := s.repo.ListCategories(ctx, tenantID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.CourseCategory, len(items))
	for i, item := range items {
		res[i] = dto.CourseCategory{
			ID:    item.ID.String(),
			Name:  item.Name,
			Slug:  item.Slug,
			Color: item.Color,
		}
	}
	return res, nil
}

func (s *CourseUsecase) CreateCategory(ctx context.Context, userID uuid.UUID, req dto.CourseCategoryPayload) (*dto.CourseCategory, error) {
	tenantID, err := s.authz.GetTenantID(ctx, userID)
	if err != nil {
		return nil, err
	}
	slug := req.Slug
	if slug == "" {
		slug = strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))
	}
	color := req.Color
	if color == "" {
		color = "#3B82F6"
	}
	item := &domain.CourseCategory{
		TenantID: tenantID,
		Name:     req.Name,
		Slug:     slug,
		Color:    color,
	}
	if err := s.repo.CreateCategory(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseCategory{
		ID:    item.ID.String(),
		Name:  item.Name,
		Slug:  item.Slug,
		Color: item.Color,
	}, nil
}

func (s *CourseUsecase) UpdateCategory(ctx context.Context, userID uuid.UUID, id string, req dto.CourseCategoryPayload) (*dto.CourseCategory, error) {
	catID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid category id")
	}
	item, err := s.repo.FindCategoryByID(ctx, catID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("category", id)
		}
		return nil, apperr.Internal(err)
	}

	slug := req.Slug
	if slug == "" {
		slug = strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))
	}
	color := req.Color
	if color == "" {
		color = "#3B82F6"
	}
	item.Name = req.Name
	item.Slug = slug
	item.Color = color

	if err := s.repo.UpdateCategory(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseCategory{
		ID:    item.ID.String(),
		Name:  item.Name,
		Slug:  item.Slug,
		Color: item.Color,
	}, nil
}

func (s *CourseUsecase) DeleteCategory(ctx context.Context, userID uuid.UUID, id string) error {
	catID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid category id")
	}
	if err := s.repo.DeleteCategory(ctx, catID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

// Course Resources
func (s *CourseUsecase) ListResources(ctx context.Context, userID uuid.UUID, courseID string) ([]dto.CourseResource, error) {
	cID, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	items, err := s.repo.ListResourcesByCourse(ctx, cID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.CourseResource, len(items))
	for i, item := range items {
		res[i] = dto.CourseResource{
			ID:         item.ID.String(),
			CourseID:   item.CourseID.String(),
			Name:       item.Name,
			StorageKey: item.StorageKey,
			MimeType:   item.MimeType,
			SizeBytes:  item.SizeBytes,
			UploadedBy: item.UploadedBy.String(),
			CreatedAt:  item.CreatedAt.Format(time.RFC3339),
		}
	}
	return res, nil
}

func (s *CourseUsecase) CreateResource(ctx context.Context, userID uuid.UUID, courseID string, name string, storageKey string, mimeType string, sizeBytes int64) (*dto.CourseResource, error) {
	cID, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item := &domain.CourseResource{
		CourseID:   cID,
		Name:       name,
		StorageKey: storageKey,
		MimeType:   mimeType,
		SizeBytes:  sizeBytes,
		UploadedBy: userID,
	}
	if err := s.repo.CreateResource(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseResource{
		ID:         item.ID.String(),
		CourseID:   item.CourseID.String(),
		Name:       item.Name,
		StorageKey: item.StorageKey,
		MimeType:   item.MimeType,
		SizeBytes:  item.SizeBytes,
		UploadedBy: item.UploadedBy.String(),
		CreatedAt:  item.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (s *CourseUsecase) DeleteResource(ctx context.Context, userID uuid.UUID, resourceID string) error {
	resID, err := uuid.Parse(resourceID)
	if err != nil {
		return apperr.BadRequest("invalid resource id")
	}
	if err := s.repo.DeleteResource(ctx, resID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

// Course Reviews
func (s *CourseUsecase) ListReviews(ctx context.Context, userID uuid.UUID, courseID string) ([]dto.CourseReview, error) {
	cID, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	items, err := s.repo.ListReviewsByCourse(ctx, cID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.CourseReview, len(items))
	for i, item := range items {
		userName := "Student"
		if item.User != nil {
			userName = item.User.FullName
			if userName == "" {
				userName = item.User.Email
			}
		}
		res[i] = dto.CourseReview{
			ID:        item.ID.String(),
			CourseID:  item.CourseID.String(),
			UserID:    item.UserID.String(),
			UserName:  userName,
			Rating:    item.Rating,
			Comment:   item.Comment,
			CreatedAt: item.CreatedAt.Format(time.RFC3339),
		}
	}
	return res, nil
}

func (s *CourseUsecase) CreateReview(ctx context.Context, userID uuid.UUID, courseID string, rating int, comment string) (*dto.CourseReview, error) {
	cID, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item := &domain.CourseReview{
		CourseID: cID,
		UserID:   userID,
		Rating:   rating,
		Comment:  comment,
	}
	if err := s.repo.CreateReview(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.CourseReview{
		ID:        item.ID.String(),
		CourseID:  item.CourseID.String(),
		UserID:    item.UserID.String(),
		UserName:  "Student", // dynamically resolved by GORM if preloaded, but since it's just created, we know user is userID
		Rating:    item.Rating,
		Comment:   item.Comment,
		CreatedAt: item.CreatedAt.Format(time.RFC3339),
	}, nil
}

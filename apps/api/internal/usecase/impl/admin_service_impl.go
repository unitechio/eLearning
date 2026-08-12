package impl

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type AdminUsecase struct {
	userRepo     repository.UserRepository
	courseRepo   repository.CourseRepository
	progressRepo repository.ProgressRepository
	activityRepo repository.ActivityRepository
}

func NewAdminService(userRepo repository.UserRepository, courseRepo repository.CourseRepository, progressRepo repository.ProgressRepository, activityRepo repository.ActivityRepository) *AdminUsecase {
	return &AdminUsecase{
		userRepo:     userRepo,
		courseRepo:   courseRepo,
		progressRepo: progressRepo,
		activityRepo: activityRepo,
	}
}

func (s *AdminUsecase) ListUsers(ctx context.Context, query dto.AdminUserListQuery) (*dto.PageResult[dto.AdminUser], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	users, total, err := s.userRepo.ListUsers(ctx, repository.UserListFilter{
		Page:     query.Page,
		PageSize: query.PageSize,
		Search:   query.Search,
		Status:   query.Status,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	items := make([]dto.AdminUser, 0, len(users))
	for _, user := range users {
		roleNames := make([]string, 0, len(user.Roles))
		for _, role := range user.Roles {
			roleNames = append(roleNames, role.Name)
		}
		status := string(user.Status)
		if query.Status != "" && !strings.EqualFold(status, query.Status) {
			continue
		}
		items = append(items, dto.AdminUser{
			ID:     user.ID.String(),
			Email:  user.Email,
			Status: status,
			Roles:  roleNames,
		})
	}
	return &dto.PageResult[dto.AdminUser]{Items: items, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *AdminUsecase) UpdateUserStatus(ctx context.Context, id string, req dto.UpdateUserStatusRequest) (*dto.AdminUser, error) {
	userID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id)
		}
		return nil, apperr.Internal(err)
	}
	user.Status = domain.UserStatus(req.Status)
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AdminUser{ID: user.ID.String(), Email: user.Email, Status: string(user.Status)}, nil
}

func (s *AdminUsecase) ListCourses(ctx context.Context, query dto.CourseListQuery) (*dto.PageResult[dto.Course], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.courseRepo.ListCourses(ctx, repository.CourseListFilter{
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

func (s *AdminUsecase) CreateCourse(ctx context.Context, req dto.UpsertCourseRequest) (*dto.Course, error) {
	var catID *uuid.UUID
	if req.CategoryID != nil && *req.CategoryID != "" {
		id, err := uuid.Parse(*req.CategoryID)
		if err == nil {
			catID = &id
		}
	}
	var instID *uuid.UUID
	if req.InstructorID != nil && *req.InstructorID != "" {
		id, err := uuid.Parse(*req.InstructorID)
		if err == nil {
			instID = &id
		}
	}
	var whatYouLearnJSON []byte
	if len(req.WhatYouLearn) > 0 {
		whatYouLearnJSON, _ = json.Marshal(req.WhatYouLearn)
	}
	item := &domain.Course{
		TenantID:        uuid.Nil,
		CreatedBy:       uuid.Nil,
		Title:           req.Title,
		Subtitle:        req.Subtitle,
		Description:     req.Description,
		Domain:          req.Domain,
		Level:           req.Level,
		Status:          fallback(req.Status, "draft"),
		Visibility:      fallback(req.Visibility, "public"),
		Price:           req.Price,
		OriginalPrice:   req.OriginalPrice,
		Currency:        fallback(req.Currency, "USD"),
		ThumbnailURL:    req.ThumbnailURL,
		CategoryID:      catID,
		InstructorID:    instID,
		VideoPreviewURL: req.VideoPreviewURL,
		WhatYouLearn:    whatYouLearnJSON,
		ToolsUsed:       req.ToolsUsed,
		HasCertificate:  req.HasCertificate,
	}
	if err := s.courseRepo.CreateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *AdminUsecase) UpdateCourse(ctx context.Context, id string, req dto.UpsertCourseRequest) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.courseRepo.FindCourseByID(ctx, courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	var catID *uuid.UUID
	if req.CategoryID != nil && *req.CategoryID != "" {
		id, err := uuid.Parse(*req.CategoryID)
		if err == nil {
			catID = &id
		}
	}
	var instID *uuid.UUID
	if req.InstructorID != nil && *req.InstructorID != "" {
		id, err := uuid.Parse(*req.InstructorID)
		if err == nil {
			instID = &id
		}
	}
	var whatYouLearnJSON []byte
	if len(req.WhatYouLearn) > 0 {
		whatYouLearnJSON, _ = json.Marshal(req.WhatYouLearn)
	}
	item.Title = req.Title
	item.Subtitle = req.Subtitle
	item.Description = req.Description
	item.Domain = req.Domain
	item.Level = req.Level
	item.Status = fallback(req.Status, item.Status)
	item.Visibility = fallback(req.Visibility, item.Visibility)
	item.Price = req.Price
	item.OriginalPrice = req.OriginalPrice
	item.Currency = fallback(req.Currency, item.Currency)
	item.ThumbnailURL = req.ThumbnailURL
	item.CategoryID = catID
	item.InstructorID = instID
	item.VideoPreviewURL = req.VideoPreviewURL
	item.WhatYouLearn = whatYouLearnJSON
	item.ToolsUsed = req.ToolsUsed
	item.HasCertificate = req.HasCertificate
	if err := s.courseRepo.UpdateCourse(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *AdminUsecase) DeleteCourse(ctx context.Context, id string) error {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid course id")
	}
	if err := s.courseRepo.DeleteCourse(ctx, courseID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AdminUsecase) GetAnalytics(ctx context.Context) (*dto.AnalyticsSnapshot, error) {
	courses, err := s.ListCourses(ctx, dto.CourseListQuery{PaginationQuery: dto.PaginationQuery{Page: 1, PageSize: 1000}})
	if err != nil {
		return nil, err
	}
	users, err := s.ListUsers(ctx, dto.AdminUserListQuery{PaginationQuery: dto.PaginationQuery{Page: 1, PageSize: 1000}})
	if err != nil {
		return nil, err
	}
	return &dto.AnalyticsSnapshot{
		TotalUsers:      len(users.Items),
		ActiveUsers:     len(users.Items),
		TotalCourses:    len(courses.Items),
		TotalActivities: 0,
	}, nil
}

func (s *AdminUsecase) GetAIUsage(ctx context.Context) (*dto.AIUsageSnapshot, error) {
	return &dto.AIUsageSnapshot{TotalRequests: 0, TokenUsage: 0}, nil
}

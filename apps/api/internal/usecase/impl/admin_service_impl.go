package impl

import (
	"context"
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

func (s *AdminUsecase) ListUsers(query dto.AdminUserListQuery) (*dto.PageResult[dto.AdminUser], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	users, total, err := s.userRepo.ListUsers(context.Background(), repository.UserListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Status:     query.Status,
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

func (s *AdminUsecase) UpdateUserStatus(id string, req dto.UpdateUserStatusRequest) (*dto.AdminUser, error) {
	userID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	user, err := s.userRepo.FindByID(context.Background(), userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id)
		}
		return nil, apperr.Internal(err)
	}
	user.Status = domain.UserStatus(req.Status)
	if err := s.userRepo.Update(context.Background(), user); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AdminUser{ID: user.ID.String(), Email: user.Email, Status: string(user.Status)}, nil
}

func (s *AdminUsecase) ListCourses(query dto.CourseListQuery) (*dto.PageResult[dto.Course], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.courseRepo.ListCourses(context.Background(), repository.CourseListFilter{
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

func (s *AdminUsecase) CreateCourse(req dto.UpsertCourseRequest) (*dto.Course, error) {
	item := &domain.Course{TenantID: uuid.Nil, CreatedBy: uuid.Nil, Title: req.Title, Description: req.Description, Domain: req.Domain, Level: req.Level, Status: fallback(req.Status, "draft"), Visibility: fallback(req.Visibility, "public")}
	if err := s.courseRepo.CreateCourse(context.Background(), item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *AdminUsecase) UpdateCourse(id string, req dto.UpsertCourseRequest) (*dto.Course, error) {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.courseRepo.FindCourseByID(context.Background(), courseID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course", id)
		}
		return nil, apperr.Internal(err)
	}
	item.Title, item.Description, item.Domain = req.Title, req.Description, req.Domain
	item.Level, item.Status, item.Visibility = req.Level, fallback(req.Status, item.Status), fallback(req.Visibility, item.Visibility)
	if err := s.courseRepo.UpdateCourse(context.Background(), item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapCourse(*item)
	return &res, nil
}

func (s *AdminUsecase) DeleteCourse(id string) error {
	courseID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid course id")
	}
	if err := s.courseRepo.DeleteCourse(context.Background(), courseID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AdminUsecase) GetAnalytics() (*dto.AnalyticsSnapshot, error) {
	courses, err := s.ListCourses(dto.CourseListQuery{PaginationQuery: dto.PaginationQuery{Page: 1, PageSize: 1000}})
	if err != nil {
		return nil, err
	}
	users, err := s.ListUsers(dto.AdminUserListQuery{PaginationQuery: dto.PaginationQuery{Page: 1, PageSize: 1000}})
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

func (s *AdminUsecase) GetAIUsage() (*dto.AIUsageSnapshot, error) {
	return &dto.AIUsageSnapshot{TotalRequests: 0, TokenUsage: 0}, nil
}

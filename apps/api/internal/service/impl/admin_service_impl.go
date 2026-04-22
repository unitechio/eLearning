package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type AdminService struct {
	userRepo     repository.UserRepository
	courseSvc    *CourseService
	progressRepo repository.ProgressRepository
	activityRepo repository.ActivityRepository
}

func NewAdminService(userRepo repository.UserRepository, courseRepo repository.CourseRepository, progressRepo repository.ProgressRepository, activityRepo repository.ActivityRepository) *AdminService {
	return &AdminService{
		userRepo:     userRepo,
		courseSvc:    NewCourseService(courseRepo),
		progressRepo: progressRepo,
		activityRepo: activityRepo,
	}
}

func (s *AdminService) ListUsers(query dto.AdminUserListQuery) (*dto.PageResult[dto.AdminUser], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	users, total, err := s.userRepo.ListUsers(repository.UserListFilter{
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

func (s *AdminService) UpdateUserStatus(id string, req dto.UpdateUserStatusRequest) (*dto.AdminUser, error) {
	userID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id)
		}
		return nil, apperr.Internal(err)
	}
	user.Status = model.UserStatus(req.Status)
	if err := s.userRepo.Update(user); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AdminUser{ID: user.ID.String(), Email: user.Email, Status: string(user.Status)}, nil
}

func (s *AdminService) ListCourses(query dto.CourseListQuery) (*dto.PageResult[dto.Course], error) {
	return s.courseSvc.ListCourses(query)
}

func (s *AdminService) CreateCourse(req dto.UpsertCourseRequest) (*dto.Course, error) {
	return s.courseSvc.CreateCourse(req)
}

func (s *AdminService) UpdateCourse(id string, req dto.UpsertCourseRequest) (*dto.Course, error) {
	return s.courseSvc.UpdateCourse(id, req)
}

func (s *AdminService) DeleteCourse(id string) error {
	return s.courseSvc.DeleteCourse(id)
}

func (s *AdminService) GetAnalytics() (*dto.AnalyticsSnapshot, error) {
	courses, err := s.courseSvc.ListCourses(dto.CourseListQuery{PaginationQuery: dto.PaginationQuery{Page: 1, PageSize: 1000}})
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

func (s *AdminService) GetAIUsage() (*dto.AIUsageSnapshot, error) {
	return &dto.AIUsageSnapshot{TotalRequests: 0, TokenUsage: 0}, nil
}

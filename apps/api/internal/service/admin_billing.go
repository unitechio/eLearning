package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AdminService interface {
	ListUsers(query dto.AdminUserListQuery) (*dto.PageResult[dto.AdminUser], error)
	UpdateUserStatus(id string, req dto.UpdateUserStatusRequest) (*dto.AdminUser, error)
	ListCourses(query dto.CourseListQuery) (*dto.PageResult[dto.Course], error)
	CreateCourse(req dto.UpsertCourseRequest) (*dto.Course, error)
	UpdateCourse(id string, req dto.UpsertCourseRequest) (*dto.Course, error)
	DeleteCourse(id string) error
	GetAnalytics() (*dto.AnalyticsSnapshot, error)
	GetAIUsage() (*dto.AIUsageSnapshot, error)
}

type BillingService interface {
	ListPlans(query dto.BillingPlanListQuery) (*dto.PageResult[dto.BillingPlan], error)
	Subscribe(userID uuid.UUID, req dto.SubscribeRequest) (map[string]any, error)
	ListBillingHistory(userID uuid.UUID, query dto.BillingHistoryQuery) (*dto.PageResult[dto.BillingHistoryItem], error)
}

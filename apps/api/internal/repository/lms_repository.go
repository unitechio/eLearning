package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LMSRepository interface {
	GetDashboardByUser(ctx context.Context, userID uuid.UUID) (*domain.LMSStudentDashboard, error)
	UpsertDashboard(ctx context.Context, item *domain.LMSStudentDashboard) error
	ListEnrollmentsByUser(ctx context.Context, userID uuid.UUID) ([]domain.LMSCourseEnrollment, error)
	CreateEnrollment(ctx context.Context, item *domain.LMSCourseEnrollment) error
	UpdateEnrollment(ctx context.Context, item *domain.LMSCourseEnrollment) error
	DeleteEnrollment(ctx context.Context, id uuid.UUID) error
	FindEnrollmentByID(ctx context.Context, id uuid.UUID) (*domain.LMSCourseEnrollment, error)
}

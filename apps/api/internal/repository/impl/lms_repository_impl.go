package impl

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LMSRepository struct {
	db *gorm.DB
}

func NewLMSRepository(db *gorm.DB) *LMSRepository {
	return &LMSRepository{db: db}
}

func (r *LMSRepository) GetDashboardByUser(ctx context.Context, userID uuid.UUID) (*domain.LMSStudentDashboard, error) {
	var item domain.LMSStudentDashboard
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&item).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("lms dashboard not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *LMSRepository) UpsertDashboard(ctx context.Context, item *domain.LMSStudentDashboard) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "user_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"tenant_id", "hero_title", "hero_description", "current_streak", "longest_streak", "estimated_band", "target_band", "overall_progress", "attendance_rate", "practice_rate", "assignment_rate", "active_courses", "upcoming_courses", "completed_courses", "study_days", "practice_sets", "assignments_done", "toolkit", "skill_plan", "score_breakdown", "four_skills", "ai_features", "highlight_cards", "current_focus", "current_focus_note", "updated_at"}),
		}).
		Create(item).Error
}

func (r *LMSRepository) ListEnrollmentsByUser(ctx context.Context, userID uuid.UUID) ([]domain.LMSCourseEnrollment, error) {
	var items []domain.LMSCourseEnrollment
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("sort_order ASC, created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *LMSRepository) CreateEnrollment(ctx context.Context, item *domain.LMSCourseEnrollment) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *LMSRepository) UpdateEnrollment(ctx context.Context, item *domain.LMSCourseEnrollment) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *LMSRepository) DeleteEnrollment(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.LMSCourseEnrollment{}, "id = ?", id).Error
}

func (r *LMSRepository) FindEnrollmentByID(ctx context.Context, id uuid.UUID) (*domain.LMSCourseEnrollment, error) {
	var item domain.LMSCourseEnrollment
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&item).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("lms enrollment not found")
		}
		return nil, err
	}
	return &item, nil
}

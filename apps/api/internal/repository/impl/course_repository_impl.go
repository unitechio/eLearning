package impl

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"gorm.io/gorm"
)

type CourseRepository struct{ db *gorm.DB }

func NewCourseRepository(db *gorm.DB) *CourseRepository { return &CourseRepository{db: db} }

func (r *CourseRepository) ListCourses(ctx context.Context, filter dto.CourseListFilter) ([]domain.Course, int64, error) {
	var items []domain.Course
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.Course{})
	if filter.TenantID != uuid.Nil {
		q = q.Where("tenant_id = ?", filter.TenantID)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(title) like ? or lower(description) like ?", like, like)
	}
	if filter.Domain != "" {
		q = q.Where("domain = ?", filter.Domain)
	}
	if filter.Level != "" {
		q = q.Where("level = ?", filter.Level)
	}
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}
func (r *CourseRepository) CreateCourse(ctx context.Context, course *domain.Course) error {
	return r.db.WithContext(ctx).Create(course).Error
}
func (r *CourseRepository) FindCourseByID(ctx context.Context, id uuid.UUID) (*domain.Course, error) {
	var item domain.Course
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateCourse(ctx context.Context, course *domain.Course) error {
	return r.db.WithContext(ctx).Save(course).Error
}
func (r *CourseRepository) DeleteCourse(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Course{}, "id = ?", id).Error
}
func (r *CourseRepository) ListUnitsByCourse(ctx context.Context, courseID uuid.UUID, filter dto.UnitListFilter) ([]domain.Unit, int64, error) {
	var items []domain.Unit
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.Unit{}).Where("course_id = ?", courseID)
	if filter.TenantID != uuid.Nil {
		q = q.Where("tenant_id = ?", filter.TenantID)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(title) like ?", like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("order_index asc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}
func (r *CourseRepository) CreateUnit(ctx context.Context, unit *domain.Unit) error {
	return r.db.WithContext(ctx).Create(unit).Error
}
func (r *CourseRepository) FindUnitByID(ctx context.Context, id uuid.UUID) (*domain.Unit, error) {
	var item domain.Unit
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateUnit(ctx context.Context, unit *domain.Unit) error {
	return r.db.WithContext(ctx).Save(unit).Error
}
func (r *CourseRepository) DeleteUnit(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Unit{}, "id = ?", id).Error
}
func (r *CourseRepository) ListLessonsByUnit(ctx context.Context, unitID uuid.UUID, filter dto.LessonListFilter) ([]domain.Lesson, int64, error) {
	var items []domain.Lesson
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.Lesson{}).Where("unit_id = ?", unitID)
	if filter.TenantID != uuid.Nil {
		q = q.Where("tenant_id = ?", filter.TenantID)
	}
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(title) like ? or lower(content) like ?", like, like)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("order_index asc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error
	return items, total, err
}
func (r *CourseRepository) CreateLesson(ctx context.Context, lesson *domain.Lesson) error {
	return r.db.WithContext(ctx).Create(lesson).Error
}
func (r *CourseRepository) FindLessonByID(ctx context.Context, id uuid.UUID) (*domain.Lesson, error) {
	var item domain.Lesson
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateLesson(ctx context.Context, lesson *domain.Lesson) error {
	return r.db.WithContext(ctx).Save(lesson).Error
}
func (r *CourseRepository) DeleteLesson(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Lesson{}, "id = ?", id).Error
}

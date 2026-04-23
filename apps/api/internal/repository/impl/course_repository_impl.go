package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type CourseRepository struct{ db *gorm.DB }

func NewCourseRepository(db *gorm.DB) *CourseRepository { return &CourseRepository{db: db} }

func (r *CourseRepository) ListCourses(filter repository.CourseListFilter) ([]domain.Course, int64, error) {
	var items []domain.Course
	var total int64
	q := r.db.Model(&domain.Course{})
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
func (r *CourseRepository) CreateCourse(course *domain.Course) error { return r.db.Create(course).Error }
func (r *CourseRepository) FindCourseByID(id uuid.UUID) (*domain.Course, error) {
	var item domain.Course
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateCourse(course *domain.Course) error { return r.db.Save(course).Error }
func (r *CourseRepository) DeleteCourse(id uuid.UUID) error {
	return r.db.Delete(&domain.Course{}, "id = ?", id).Error
}
func (r *CourseRepository) ListUnitsByCourse(courseID uuid.UUID, filter repository.UnitListFilter) ([]domain.Unit, int64, error) {
	var items []domain.Unit
	var total int64
	q := r.db.Model(&domain.Unit{}).Where("course_id = ?", courseID)
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
func (r *CourseRepository) CreateUnit(unit *domain.Unit) error { return r.db.Create(unit).Error }
func (r *CourseRepository) FindUnitByID(id uuid.UUID) (*domain.Unit, error) {
	var item domain.Unit
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateUnit(unit *domain.Unit) error { return r.db.Save(unit).Error }
func (r *CourseRepository) DeleteUnit(id uuid.UUID) error {
	return r.db.Delete(&domain.Unit{}, "id = ?", id).Error
}
func (r *CourseRepository) ListLessonsByUnit(unitID uuid.UUID, filter repository.LessonListFilter) ([]domain.Lesson, int64, error) {
	var items []domain.Lesson
	var total int64
	q := r.db.Model(&domain.Lesson{}).Where("unit_id = ?", unitID)
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
func (r *CourseRepository) CreateLesson(lesson *domain.Lesson) error { return r.db.Create(lesson).Error }
func (r *CourseRepository) FindLessonByID(id uuid.UUID) (*domain.Lesson, error) {
	var item domain.Lesson
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateLesson(lesson *domain.Lesson) error { return r.db.Save(lesson).Error }
func (r *CourseRepository) DeleteLesson(id uuid.UUID) error {
	return r.db.Delete(&domain.Lesson{}, "id = ?", id).Error
}

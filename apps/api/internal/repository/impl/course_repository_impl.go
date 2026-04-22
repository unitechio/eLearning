package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type CourseRepository struct{ db *gorm.DB }

func NewCourseRepository(db *gorm.DB) *CourseRepository { return &CourseRepository{db: db} }

func (r *CourseRepository) ListCourses(filter repository.CourseListFilter) ([]model.Course, int64, error) {
	var items []model.Course
	var total int64
	q := r.db.Model(&model.Course{})
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
func (r *CourseRepository) CreateCourse(course *model.Course) error { return r.db.Create(course).Error }
func (r *CourseRepository) FindCourseByID(id uuid.UUID) (*model.Course, error) {
	var item model.Course
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateCourse(course *model.Course) error { return r.db.Save(course).Error }
func (r *CourseRepository) DeleteCourse(id uuid.UUID) error {
	return r.db.Delete(&model.Course{}, "id = ?", id).Error
}
func (r *CourseRepository) ListUnitsByCourse(courseID uuid.UUID, filter repository.UnitListFilter) ([]model.Unit, int64, error) {
	var items []model.Unit
	var total int64
	q := r.db.Model(&model.Unit{}).Where("course_id = ?", courseID)
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
func (r *CourseRepository) CreateUnit(unit *model.Unit) error { return r.db.Create(unit).Error }
func (r *CourseRepository) FindUnitByID(id uuid.UUID) (*model.Unit, error) {
	var item model.Unit
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateUnit(unit *model.Unit) error { return r.db.Save(unit).Error }
func (r *CourseRepository) DeleteUnit(id uuid.UUID) error {
	return r.db.Delete(&model.Unit{}, "id = ?", id).Error
}
func (r *CourseRepository) ListLessonsByUnit(unitID uuid.UUID, filter repository.LessonListFilter) ([]model.Lesson, int64, error) {
	var items []model.Lesson
	var total int64
	q := r.db.Model(&model.Lesson{}).Where("unit_id = ?", unitID)
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
func (r *CourseRepository) CreateLesson(lesson *model.Lesson) error { return r.db.Create(lesson).Error }
func (r *CourseRepository) FindLessonByID(id uuid.UUID) (*model.Lesson, error) {
	var item model.Lesson
	if err := r.db.First(&item, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
func (r *CourseRepository) UpdateLesson(lesson *model.Lesson) error { return r.db.Save(lesson).Error }
func (r *CourseRepository) DeleteLesson(id uuid.UUID) error {
	return r.db.Delete(&model.Lesson{}, "id = ?", id).Error
}

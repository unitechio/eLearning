package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type ListeningRepository struct {
	db *gorm.DB
}

func NewListeningRepository(db *gorm.DB) *ListeningRepository {
	return &ListeningRepository{db: db}
}

func (r *ListeningRepository) ListLessons(filter repository.ListeningLessonListFilter) ([]model.ListeningLesson, int64, error) {
	var items []model.ListeningLesson
	var total int64
	q := r.db.Model(&model.ListeningLesson{}).Where("is_active = ?", true)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(title) like ? or lower(description) like ? or lower(transcript) like ?", like, like, like)
	}
	if filter.Level != "" {
		q = q.Where("level = ?", filter.Level)
	}
	if filter.Domain != "" {
		q = q.Where("domain = ?", filter.Domain)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *ListeningRepository) FindLessonByID(id uuid.UUID) (*model.ListeningLesson, error) {
	var item model.ListeningLesson
	if err := r.db.Where("id = ? AND is_active = ?", id, true).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

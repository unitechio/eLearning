package impl

import (
	"context"
	"strconv"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type TemplateRepository struct {
	db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) *TemplateRepository {
	return &TemplateRepository{db: db}
}

func (r *TemplateRepository) Create(ctx context.Context, template *domain.EmailTemplate) error {
	return r.db.WithContext(ctx).Create(template).Error
}

func (r *TemplateRepository) GetByID(ctx context.Context, id string) (*domain.EmailTemplate, error) {
	templateID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return nil, err
	}
	var template domain.EmailTemplate
	if err := r.db.WithContext(ctx).First(&template, uint(templateID)).Error; err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *TemplateRepository) GetByName(ctx context.Context, name string) (*domain.EmailTemplate, error) {
	var template domain.EmailTemplate
	if err := r.db.WithContext(ctx).Where("name = ?", name).First(&template).Error; err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *TemplateRepository) List(ctx context.Context, filter domain.EmailTemplateFilter) ([]*domain.EmailTemplate, int64, error) {
	filter = filter.Normalize()
	var (
		items []*domain.EmailTemplate
		total int64
	)

	query := r.db.WithContext(ctx).Model(&domain.EmailTemplate{})
	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Category != nil {
		query = query.Where("category = ?", *filter.Category)
	}
	if filter.IsActive != nil {
		query = query.Where("is_active = ?", *filter.IsActive)
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Offset(offset).Limit(filter.PageSize).Order("created_at DESC").Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *TemplateRepository) Update(ctx context.Context, template *domain.EmailTemplate) error {
	return r.db.WithContext(ctx).Save(template).Error
}

func (r *TemplateRepository) Delete(ctx context.Context, id string) error {
	templateID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}
	return r.db.WithContext(ctx).Delete(&domain.EmailTemplate{}, uint(templateID)).Error
}

package impl

import (
	"context"

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

func (r *TemplateRepository) FindByID(ctx context.Context, id uint) (*domain.EmailTemplate, error) {
	var template domain.EmailTemplate
	if err := r.db.WithContext(ctx).First(&template, id).Error; err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *TemplateRepository) GetByID(ctx context.Context, id string) (*domain.EmailTemplate, error) {
	var template domain.EmailTemplate
	if err := r.db.WithContext(ctx).First(&template, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *TemplateRepository) FindByName(ctx context.Context, name, locale string) (*domain.EmailTemplate, error) {
	if locale == "" {
		locale = "vi"
	}
	var template domain.EmailTemplate
	err := r.db.WithContext(ctx).
		Where("name = ? AND locale = ? AND is_active = ?", name, locale, true).
		Order("is_default DESC, version DESC").
		First(&template).
		Error
	if err == nil {
		return &template, nil
	}
	if err != gorm.ErrRecordNotFound || locale == "en" {
		return nil, err
	}
	err = r.db.WithContext(ctx).
		Where("name = ? AND locale = ? AND is_active = ?", name, "en", true).
		Order("is_default DESC, version DESC").
		First(&template).
		Error
	if err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *TemplateRepository) GetByName(ctx context.Context, name string) (*domain.EmailTemplate, error) {
	return r.FindByName(ctx, name, "vi")
}

func (r *TemplateRepository) List(ctx context.Context, filter domain.EmailTemplateFilter) ([]domain.EmailTemplate, int64, error) {
	filter = filter.Normalize()
	var (
		items []domain.EmailTemplate
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

func (r *TemplateRepository) ListLegacy(ctx context.Context, filter domain.EmailTemplateFilter) ([]*domain.EmailTemplate, int64, error) {
	items, total, err := r.List(ctx, filter)
	if err != nil {
		return nil, 0, err
	}
	result := make([]*domain.EmailTemplate, len(items))
	for i := range items {
		current := items[i]
		result[i] = &current
	}
	return result, total, nil
}

func (r *TemplateRepository) Update(ctx context.Context, template *domain.EmailTemplate) error {
	return r.db.WithContext(ctx).Save(template).Error
}

func (r *TemplateRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.EmailTemplate{}, id).Error
}

func (r *TemplateRepository) Exists(ctx context.Context, name string) (bool, error) {
	var count int64
	if err := r.db.WithContext(ctx).Model(&domain.EmailTemplate{}).Where("name = ?", name).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

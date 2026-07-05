package impl

import (
	"context"
	"fmt"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"gorm.io/gorm"
)

type PostRepository struct {
	db *gorm.DB
}

func NewPostRepository(db *gorm.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) List(ctx context.Context, filter dto.PostFilter) ([]domain.Post, int64, error) {
	var items []domain.Post
	var total int64
	query := r.db.WithContext(ctx).Model(&domain.Post{})
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR excerpt ILIKE ? OR content ILIKE ?", like, like, like)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	filter.PaginationQuery = filter.PaginationQuery.Normalize()
	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Order("published_at DESC NULLS LAST, created_at DESC").Offset(offset).Limit(filter.PageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *PostRepository) GetByID(ctx context.Context, id uint) (*domain.Post, error) {
	var item domain.Post
	if err := r.db.WithContext(ctx).Preload("Media").First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *PostRepository) GetBySlug(ctx context.Context, slug string) (*domain.Post, error) {
	var item domain.Post
	if err := r.db.WithContext(ctx).Preload("Media").First(&item, "slug = ?", slug).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *PostRepository) Create(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *PostRepository) Update(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *PostRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Post{}, "id = ?", id).Error
}

package impl

import (
	"context"
	"fmt"

	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type PermissionRepository struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) *PermissionRepository {
	return &PermissionRepository{db: db}
}

func (r *PermissionRepository) Create(ctx context.Context, permission *model.Permission) error {
	return r.db.WithContext(ctx).Create(permission).Error
}

func (r *PermissionRepository) GetByID(ctx context.Context, id string) (*model.Permission, error) {
	var permission model.Permission
	err := r.db.WithContext(ctx).First(&permission, "id = ?", id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("permission not found")
		}
		return nil, err
	}

	return &permission, nil
}

func (r *PermissionRepository) GetByName(ctx context.Context, name string) (*model.Permission, error) {
	var permission model.Permission
	err := r.db.WithContext(ctx).First(&permission, "name = ?", name).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("permission not found")
		}
		return nil, err
	}

	return &permission, nil
}

func (r *PermissionRepository) List(ctx context.Context, filter model.PermissionFilter) ([]*model.Permission, int64, error) {
	var permissions []*model.Permission
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Permission{})

	if filter.Resource != "" {
		query = query.Where("resource = ?", filter.Resource)
	}

	if filter.Action != "" {
		query = query.Where("action = ?", filter.Action)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.PageSize
	query = query.Offset(offset).Limit(filter.PageSize)

	if err := query.Find(&permissions).Error; err != nil {
		return nil, 0, err
	}

	return permissions, total, nil
}

func (r *PermissionRepository) Update(ctx context.Context, permission *model.Permission) error {
	return r.db.WithContext(ctx).Save(permission).Error
}

func (r *PermissionRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.Permission{}, "id = ?", id).Error
}

func (r *PermissionRepository) GetByResource(ctx context.Context, resource string) ([]*model.Permission, error) {
	var permissions []*model.Permission
	err := r.db.WithContext(ctx).
		Where("resource = ?", resource).
		Find(&permissions).Error

	if err != nil {
		return nil, err
	}

	return permissions, nil
}

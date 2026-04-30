package impl

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"gorm.io/gorm"
)

type MenuRepository struct {
	db *gorm.DB
}

func NewMenuRepositorysitory(db *gorm.DB) *MenuRepository {
	return &MenuRepository{db}
}
func (r *MenuRepository) Create(ctx context.Context, m *domain.Menu) error {
	m.ID = uuid.New()
	return r.db.WithContext(ctx).Create(m).Error
}

func (r *MenuRepository) Update(ctx context.Context, m *domain.Menu) error {
	return r.db.WithContext(ctx).
		Model(&domain.Menu{}).
		Where("id = ?", m.ID).
		Updates(m).Error
}

func (r *MenuRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&domain.Menu{}).
		Where("id = ?", id).
		Update("deleted", 1).Error
}

func (r *MenuRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Menu, error) {
	var m domain.Menu
	err := r.db.WithContext(ctx).
		Where("id = ? AND (deleted = 0 OR deleted IS NULL)", id).
		First(&m).Error

	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *MenuRepository) FindAll(ctx context.Context, filter dto.MenuListFilter) ([]domain.Menu, int64, error) {
	var menus []domain.Menu
	var total int64

	q := r.db.WithContext(ctx).
		Model(&domain.Menu{}).
		Where("deleted = 0 OR deleted IS NULL")

	// search
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("LOWER(menu_title) LIKE ?", like)
	}

	// filter type
	if filter.Type != nil {
		q = q.Where("menu_type = ?", *filter.Type)
	}

	// filter parent
	if filter.ParentID != nil {
		q = q.Where("parent_id = ?", *filter.ParentID)
	}

	// count
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// query data
	if err := q.
		Order("menu_period ASC").
		// Scopes(Paginate(filter.Page, filter.PageSize)).
		Find(&menus).Error; err != nil {
		return nil, 0, err
	}

	return menus, total, nil
}

func (r *MenuRepository) GetMenusByUser(ctx context.Context, userID uuid.UUID) ([]domain.Menu, error) {
	var menus []domain.Menu

	err := r.db.WithContext(ctx).
		Table("menu m").
		Select("DISTINCT m.*").
		Joins("JOIN permission p ON p.menu_assign = m.id").
		Joins("JOIN role_permission rp ON rp.permission_id = p.id").
		Joins("JOIN user_role ur ON ur.role_id = rp.role_id").
		Where("ur.user_id = ?", userID).
		Where("m.deleted = 0 OR m.deleted IS NULL").
		Scan(&menus).Error

	return menus, err
}

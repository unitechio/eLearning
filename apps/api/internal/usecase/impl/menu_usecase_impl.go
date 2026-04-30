package impl

import (
	"context"
	"errors"
	"sort"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type MenuUsecase struct {
	repo repository.MenuRepository
}

func NewMenuUsecase(r repository.MenuRepository) *MenuUsecase {
	return &MenuUsecase{repo: r}
}

func (u *MenuUsecase) Create(ctx context.Context, m *domain.Menu) error {
	if m.Title == "" {
		return errors.New("menu title is required")
	}

	if m.ParentID != nil {
		_, err := u.repo.FindByID(ctx, *m.ParentID)
		if err != nil {
			return errors.New("parent menu not found")
		}
	}

	return u.repo.Create(ctx, m)
}
func (u *MenuUsecase) Update(ctx context.Context, m *domain.Menu) error {
	existing, err := u.repo.FindByID(ctx, m.ID)
	if err != nil {
		return errors.New("menu not found")
	}

	if m.Title == "" {
		return errors.New("menu title is required")
	}

	if m.ParentID != nil {
		if *m.ParentID == m.ID {
			return errors.New("menu cannot be parent of itself")
		}

		_, err := u.repo.FindByID(ctx, *m.ParentID)
		if err != nil {
			return errors.New("parent menu not found")
		}
	}

	existing.Title = m.Title
	existing.URL = m.URL
	existing.Period = m.Period
	existing.Type = m.Type
	existing.ParentID = m.ParentID
	existing.Icon = m.Icon

	return u.repo.Update(ctx, existing)
}

func (u *MenuUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return errors.New("menu not found")
	}

	// menus, err := u.repo.FindAll(ctx)
	// if err != nil {
	// 	return err
	// }

	// for _, m := range menus {
	// 	if m.ParentID != nil && *m.ParentID == id {
	// 		return errors.New("cannot delete menu with children")
	// 	}
	// }

	return u.repo.Delete(ctx, id)
}

func (u *MenuUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Menu, error) {
	return u.repo.FindByID(ctx, id)
}

func (u *MenuUsecase) GetAll(ctx context.Context, filter dto.MenuListFilter) ([]domain.Menu, int64, error) {
	return u.repo.FindAll(ctx, filter)
}

func (u *MenuUsecase) GetTree(ctx context.Context, filter dto.MenuListFilter) ([]domain.Menu, error) {
	menus, _, err := u.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, err
	}

	return BuildMenuTree(menus), nil
}

func BuildMenuTree(menus []domain.Menu) []domain.Menu {
	menuMap := make(map[uuid.UUID]*domain.Menu)
	var roots []domain.Menu

	// init map
	for i := range menus {
		m := &menus[i]
		m.Children = []domain.Menu{} // tránh nil slice
		menuMap[m.ID] = m
	}

	// build tree
	for i := range menus {
		m := &menus[i]

		if m.ParentID != nil {
			parent, ok := menuMap[*m.ParentID]
			if ok {
				parent.Children = append(parent.Children, *m)
				continue
			}
			// ❗ orphan → fallback thành root
		}

		roots = append(roots, *m)
	}

	// optional: sort theo period
	sortMenuTree(roots)

	return roots
}

func sortMenuTree(menus []domain.Menu) {
	sort.SliceStable(menus, func(i, j int) bool {
		// ưu tiên sort theo Period
		if menus[i].Period != menus[j].Period {
			return menus[i].Period < menus[j].Period
		}
		// fallback theo Title (tránh random order)
		return menus[i].Title < menus[j].Title
	})

	// đệ quy sort children
	for i := range menus {
		if len(menus[i].Children) > 0 {
			sortMenuTree(menus[i].Children)
		}
	}
}

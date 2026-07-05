package usecase

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type PostUsecase interface {
	List(ctx context.Context, filter dto.PostFilter) ([]domain.Post, int64, error)
	GetByID(ctx context.Context, id uint) (*domain.Post, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Post, error)
	Create(ctx context.Context, req dto.PostRequest, actor dto.PostActor) (*domain.Post, error)
	Update(ctx context.Context, id uint, req dto.PostRequest, actor dto.PostActor) (*domain.Post, error)
	Delete(ctx context.Context, id uint) error
}

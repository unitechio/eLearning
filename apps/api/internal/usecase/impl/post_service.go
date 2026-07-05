package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type PostService struct {
	repo repository.PostRepository
}

func NewPostService(repo repository.PostRepository) *PostService {
	return &PostService{repo: repo}
}

func (s *PostService) List(ctx context.Context, filter dto.PostFilter) ([]domain.Post, int64, error) {
	return s.repo.List(ctx, filter)
}

func (s *PostService) GetByID(ctx context.Context, id uint) (*domain.Post, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PostService) GetBySlug(ctx context.Context, slug string) (*domain.Post, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *PostService) Create(ctx context.Context, req dto.PostRequest, actor dto.PostActor) (*domain.Post, error) {
	item := postFromRequest(req, actor)
	if err := s.repo.Create(ctx, item); err != nil {
		return nil, err
	}
	return item, nil
}

func (s *PostService) Update(ctx context.Context, id uint, req dto.PostRequest, actor dto.PostActor) (*domain.Post, error) {
	current, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	updated := postFromRequest(req, actor)
	updated.ID = current.ID
	updated.CreatedAt = current.CreatedAt
	if err := s.repo.Update(ctx, updated); err != nil {
		return nil, err
	}
	return updated, nil
}

func (s *PostService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func postFromRequest(req dto.PostRequest, actor dto.PostActor) *domain.Post {
	status := req.Status
	if status == "" {
		status = domain.PostStatusDraft
	}
	authorID := actor.UserID
	if authorID == uuid.Nil {
		authorID = uuid.New()
	}
	authorName := req.AuthorName
	if authorName == "" {
		authorName = actor.Name
	}
	return &domain.Post{
		Title:           req.Title,
		Slug:            req.Slug,
		Content:         req.Content,
		Excerpt:         req.Excerpt,
		FeaturedImage:   req.FeaturedImage,
		Status:          status,
		AuthorID:        authorID,
		AuthorName:      authorName,
		Language:        firstPostValue(req.Language, "vi"),
		PublishedAt:     req.PublishedAt,
		ScheduledAt:     req.ScheduledAt,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
		MetaKeywords:    req.MetaKeywords,
		TableOfContents: req.TableOfContents,
		Tags:            req.Tags,
		Categories:      req.Categories,
	}
}

func firstPostValue(value string, fallback string) string {
	if value != "" {
		return value
	}
	return fallback
}

package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type UserUsecase struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserUsecase {
	return &UserUsecase{repo: repo}
}

func (s *UserUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id.String())
		}
		return nil, apperr.Internal(err)
	}
	return user, nil
}

func (s *UserUsecase) UpdateProfile(ctx context.Context, id uuid.UUID, req usecase.UpdateProfileRequest) (*domain.User, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id.String())
		}
		return nil, apperr.Internal(err)
	}

	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, apperr.Internal(err)
	}
	return user, nil
}

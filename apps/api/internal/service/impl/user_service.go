package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetByID(id uuid.UUID) (*model.User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", id.String())
		}
		return nil, apperr.Internal(err)
	}
	return user, nil
}

func (s *UserService) UpdateProfile(id uuid.UUID, req service.UpdateProfileRequest) (*model.User, error) {
	user, err := s.repo.FindByID(id)
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

	if err := s.repo.Update(user); err != nil {
		return nil, apperr.Internal(err)
	}
	return user, nil
}

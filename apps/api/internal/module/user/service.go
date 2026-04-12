package user

import "github.com/unitechio/eLearning/apps/api/pkg/apperr"

type UpdateProfileRequest struct {
	Name string `json:"name" binding:"required,min=2,max=100"`
}

type Service interface {
	GetByID(id uint) (*User, error)
	UpdateProfile(id uint, req UpdateProfileRequest) (*User, error)
}

type service struct{ repo Repository }

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetByID(id uint) (*User, error) {
	u, err := s.repo.FindByID(id)
	if err != nil {
		return nil, apperr.NotFound("user", id)
	}
	return u, nil
}

func (s *service) UpdateProfile(id uint, req UpdateProfileRequest) (*User, error) {
	u, err := s.repo.FindByID(id)
	if err != nil {
		return nil, apperr.NotFound("user", id)
	}
	u.Name = req.Name
	if err := s.repo.Update(u); err != nil {
		return nil, apperr.Internal(err)
	}
	return u, nil
}

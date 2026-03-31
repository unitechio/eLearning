package user

import "fmt"

type Service interface {
	GetUser(id string) (*User, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetUser(id string) (*User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

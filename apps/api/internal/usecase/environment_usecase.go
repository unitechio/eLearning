package usecase

import (
	"context"
)

type EnvironmentUsecase interface {
	CreateEnvironment(ctx context.Context, env *domain.Environment) error
	GetEnvironment(ctx context.Context, id string) (*domain.Environment, error)
	GetEnvironmentByName(ctx context.Context, name string) (*domain.Environment, error)
	ListEnvironments(ctx context.Context, filter domain.EnvironmentFilter) ([]*domain.Environment, int64, error)
	UpdateEnvironment(ctx context.Context, env *domain.Environment) error
	DeleteEnvironment(ctx context.Context, id string) error
}

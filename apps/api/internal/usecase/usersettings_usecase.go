package usecase

import (
	"context"
	"einfra/api/internal/model"
)

type UserSettingsUsecase interface {
	GetUserSettings(ctx context.Context, userID string) (*domain.UserSettings, error)
	UpdateUserSettings(ctx context.Context, userID string, update *domain.UserSettingsUpdate) error
	ResetToDefaults(ctx context.Context, userID string) error
	GetOrCreateSettings(ctx context.Context, userID string) (*domain.UserSettings, error)
}

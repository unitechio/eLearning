package impl

import (
	"context"
	"errors"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type UserSettingsUsecase struct {
	repo repository.UserSettingsRepository
}

func NewUserSettingsUsecase(repo repository.UserSettingsRepository) *UserSettingsUsecase {
	return &UserSettingsUsecase{repo: repo}
}

func (u *UserSettingsUsecase) GetUserSettings(ctx context.Context, userID string) (*domain.UserSettings, error) {
	settings, err := u.repo.GetByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			defaults := domain.GetDefaultSettings(userID)
			if err := u.repo.Create(ctx, defaults); err != nil {
				return nil, err
			}
			return defaults, nil
		}
		return nil, err
	}
	return settings, nil
}

func (u *UserSettingsUsecase) UpdateUserSettings(ctx context.Context, userID string, settings *domain.UserSettingsUpdate) error {
	// Ensure the record exists
	if _, err := u.repo.GetByUserID(ctx, userID); err != nil {
		return err
	}
	// Use PartialUpdate since we're receiving UserSettingsUpdate
	return u.repo.PartialUpdate(ctx, userID, settings)
}

// PartialUpdateUserSettings updates selected fields
func (u *UserSettingsUsecase) PartialUpdateUserSettings(ctx context.Context, userID string, upd *domain.UserSettingsUpdate) error {
	// Ensure user settings exist
	if _, err := u.repo.GetByUserID(ctx, userID); err != nil {
		return err
	}
	return u.repo.PartialUpdate(ctx, userID, upd)
}

// ResetToDefaults resets a user's settings to the default configuration
func (u *UserSettingsUsecase) ResetToDefaults(ctx context.Context, userID string) error {
	return u.repo.ResetToDefaults(ctx, userID)
}

// GetOrCreateSettings returns existing settings or creates defaults if missing
func (u *UserSettingsUsecase) GetOrCreateSettings(ctx context.Context, userID string) (*domain.UserSettings, error) {
	settings, err := u.repo.GetByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			defaults := domain.GetDefaultSettings(userID)
			if err := u.repo.Create(ctx, defaults); err != nil {
				return nil, err
			}
			return defaults, nil
		}
		return nil, err
	}
	return settings, nil
}

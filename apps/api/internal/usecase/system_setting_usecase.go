package usecase

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

type SystemSettingUsecase struct {
	repo repository.SystemSettingRepository
}

func NewSystemSettingUsecase(repo repository.SystemSettingRepository) *SystemSettingUsecase {
	return &SystemSettingUsecase{repo: repo}
}

func (uc *SystemSettingUsecase) CreateSystemSetting(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error) {
	return uc.repo.Create(ctx, setting)
}

func (uc *SystemSettingUsecase) GetSystemSettingByKey(ctx context.Context, key string) (*domain.SystemSetting, error) {
	return uc.repo.GetByKey(ctx, key)
}

func (uc *SystemSettingUsecase) GetAllSystemSettings(ctx context.Context) ([]*domain.SystemSetting, error) {
	return uc.repo.GetAll(ctx)
}

func (uc *SystemSettingUsecase) GetSystemSettingsByCategory(ctx context.Context, category string) ([]*domain.SystemSetting, error) {
	return uc.repo.GetByCategory(ctx, category)
}

func (uc *SystemSettingUsecase) UpdateSystemSetting(ctx context.Context, setting *domain.SystemSetting) (*domain.SystemSetting, error) {
	return uc.repo.Update(ctx, setting)
}

func (uc *SystemSettingUsecase) DeleteSystemSetting(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}

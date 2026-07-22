package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type EmailRepository interface {
	Create(ctx context.Context, log *domain.EmailLog) error
	Update(ctx context.Context, log *domain.EmailLog) error
	Delete(ctx context.Context, id uint) error

	FindByID(ctx context.Context, id uint) (*domain.EmailLog, error)
	FindByProviderMessageID(ctx context.Context, providerMessageID string) (*domain.EmailLog, error)
	FindByIdempotencyKey(ctx context.Context, key string) (*domain.EmailLog, error)

	List(ctx context.Context, filter domain.EmailLogFilter) ([]domain.EmailLog, int64, error)
	UpdateStatus(ctx context.Context, id uint, status domain.EmailStatus, errMsg string) error

	MarkDelivered(ctx context.Context, providerMessageID string) error
	MarkOpened(ctx context.Context, providerMessageID string) error
	MarkClicked(ctx context.Context, providerMessageID string) error
	IncreaseRetry(ctx context.Context, id uint, lastError string) error

	ListPending(ctx context.Context, limit int) ([]domain.EmailLog, error)
	ListRetryable(ctx context.Context, limit int) ([]domain.EmailLog, error)
}

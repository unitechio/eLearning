package repository

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type EmailRepository interface {
	SaveEmailLog(ctx context.Context, log *domain.EmailLog) error
	GetEmailLog(ctx context.Context, id string) (*domain.EmailLog, error)
	ListEmailLogs(ctx context.Context, filter dto.EmailLogFilter) ([]*domain.EmailLog, error)
	UpdateEmailStatus(ctx context.Context, id string, status domain.EmailStatus, errorMsg string) error
}
